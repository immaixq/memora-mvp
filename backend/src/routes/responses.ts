import { Router } from 'express';
import { prisma } from '../index';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';
import { createResponseSchema } from '../schemas/response';

export const responseRoutes = Router();

// Create response to a prompt or reply to another response
responseRoutes.post('/', authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const { text } = createResponseSchema.parse(req.body);
    const { promptId, parentId } = req.body;

    if (!promptId) {
      res.status(400).json({ error: 'promptId is required' });
      return;
    }

    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    // Verify prompt exists and is TEXT type
    const prompt = await prisma.prompt.findUnique({
      where: { id: promptId },
    });

    if (!prompt) {
      res.status(404).json({ error: 'Prompt not found' });
      return;
    }

    if (prompt.type !== 'TEXT') {
      res.status(400).json({ error: 'Can only respond to text prompts' });
      return;
    }

    // If this is a reply, verify parent exists and calculate depth
    let depth = 0;
    if (parentId) {
      const parentResponse = await prisma.response.findUnique({
        where: { id: parentId },
      });
      
      if (!parentResponse) {
        res.status(404).json({ error: 'Parent response not found' });
        return;
      }
      
      if (parentResponse.promptId !== promptId) {
        res.status(400).json({ error: 'Parent response must belong to the same prompt' });
        return;
      }
      
      depth = parentResponse.depth + 1;
      
      // Limit nesting depth to prevent infinite threads
      if (depth > 10) {
        res.status(400).json({ error: 'Maximum thread depth reached' });
        return;
      }
    }

    // Ensure user exists in database
    const user = await prisma.user.upsert({
      where: { email: req.user.email },
      update: {},
      create: {
        id: req.user.uid,
        name: req.user.name || req.user.email.split('@')[0],
        email: req.user.email,
        authProvider: 'firebase',
      },
    });

    const response = await prisma.response.create({
      data: {
        text,
        promptId,
        parentId,
        authorId: user.id,
        depth,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
    });

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
});

// Toggle upvote on a response
responseRoutes.post('/:id/upvote', authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const { id: responseId } = req.params;

    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    // Verify response exists
    const response = await prisma.response.findUnique({
      where: { id: responseId },
    });

    if (!response) {
      res.status(404).json({ error: 'Response not found' });
      return;
    }

    // Ensure user exists in database
    const user = await prisma.user.upsert({
      where: { email: req.user.email },
      update: {},
      create: {
        id: req.user.uid,
        name: req.user.name || req.user.email.split('@')[0],
        email: req.user.email,
        authProvider: 'firebase',
      },
    });

    // Check if user already upvoted
    const existingUpvote = await prisma.upvote.findUnique({
      where: {
        userId_responseId: {
          userId: user.id,
          responseId,
        },
      },
    });

    let upvotesCount: number;

    if (existingUpvote) {
      // Remove upvote
      await prisma.$transaction([
        prisma.upvote.delete({
          where: { id: existingUpvote.id },
        }),
        prisma.response.update({
          where: { id: responseId },
          data: { upvotesCount: { decrement: 1 } },
        }),
      ]);
      upvotesCount = response.upvotesCount - 1;
    } else {
      // Add upvote
      await prisma.$transaction([
        prisma.upvote.create({
          data: {
            userId: user.id,
            responseId,
          },
        }),
        prisma.response.update({
          where: { id: responseId },
          data: { upvotesCount: { increment: 1 } },
        }),
      ]);
      upvotesCount = response.upvotesCount + 1;
    }

    res.json({
      upvoted: !existingUpvote,
      upvotesCount,
    });
  } catch (error) {
    next(error);
  }
});