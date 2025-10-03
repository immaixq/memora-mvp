import { Router } from 'express';
import { prisma } from '../index';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';
import { createPromptSchema, getPromptsQuerySchema } from '../schemas/prompt';
import { pollVoteSchema } from '../schemas/response';

export const promptRoutes = Router();

// Get prompts with pagination and filtering
promptRoutes.get('/', async (req, res, next) => {
  try {
    const query = getPromptsQuerySchema.parse(req.query);
    const { communityId, sort, page, limit } = query;
    
    const skip = (page - 1) * limit;
    
    const where = communityId ? { communityId } : {};
    
    const orderBy = sort === 'trending' 
      ? [{ responses: { _count: 'desc' } }, { createdAt: 'desc' }]
      : [{ createdAt: 'desc' }];

    const [prompts, total] = await Promise.all([
      prisma.prompt.findMany({
        where,
        orderBy: orderBy as any,
        skip,
        take: limit,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              avatarUrl: true,
            },
          },
          community: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          pollOptions: {
            select: {
              id: true,
              text: true,
              voteCount: true,
            },
            orderBy: { voteCount: 'desc' },
          },
          _count: {
            select: {
              responses: true,
              likes: true,
            },
          },
        },
      }),
      prisma.prompt.count({ where }),
    ]);

    res.json({
      prompts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
});

// Get single prompt by ID
promptRoutes.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const prompt = await prisma.prompt.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
        community: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        pollOptions: {
          select: {
            id: true,
            text: true,
            voteCount: true,
          },
          orderBy: { voteCount: 'desc' },
        },
        responses: {
          where: { parentId: null }, // Only top-level responses
          include: {
            author: {
              select: {
                id: true,
                name: true,
                email: true,
                avatarUrl: true,
              },
            },
            replies: {
              include: {
                author: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    avatarUrl: true,
                  },
                },
                replies: {
                  include: {
                    author: {
                      select: {
                        id: true,
                        name: true,
                        email: true,
                        avatarUrl: true,
                      },
                    },
                    replies: {
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
                      orderBy: { createdAt: 'asc' },
                    },
                  },
                  orderBy: { createdAt: 'asc' },
                },
              },
              orderBy: { createdAt: 'asc' },
            },
          },
          orderBy: { upvotesCount: 'desc' },
        },
        _count: {
          select: {
            responses: true,
            likes: true,
          },
        },
      },
    });

    if (!prompt) {
      res.status(404).json({ error: 'Prompt not found' });
      return;
    }

    res.json(prompt);
  } catch (error) {
    next(error);
  }
});

// Create new prompt
promptRoutes.post('/', authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const data = createPromptSchema.parse(req.body);
    const { title, body, type, communityId, pollOptions } = data;
    
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    // Validate poll options for POLL type
    if (type === 'POLL' && (!pollOptions || pollOptions.length < 2)) {
      res.status(400).json({ error: 'Poll must have at least 2 options' });
      return;
    }

    if (type === 'TEXT' && pollOptions) {
      res.status(400).json({ error: 'Text prompts cannot have poll options' });
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

    // Create prompt with poll options if applicable
    const prompt = await prisma.prompt.create({
      data: {
        title,
        body,
        type,
        authorId: user.id,
        communityId,
        pollOptions: type === 'POLL' ? {
          create: pollOptions!.map(text => ({ text })),
        } : undefined,
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
        community: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        pollOptions: {
          select: {
            id: true,
            text: true,
            voteCount: true,
          },
        },
        _count: {
          select: {
            responses: true,
            likes: true,
          },
        },
      },
    });

    res.status(201).json(prompt);
  } catch (error) {
    next(error);
  }
});

// Vote on poll option
promptRoutes.post('/:id/vote', authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const { id: promptId } = req.params;
    const { pollOptionId } = pollVoteSchema.parse(req.body);
    
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    // Verify prompt exists and is a poll
    const prompt = await prisma.prompt.findUnique({
      where: { id: promptId },
      include: {
        pollOptions: true,
      },
    });

    if (!prompt) {
      res.status(404).json({ error: 'Prompt not found' });
      return;
    }

    if (prompt.type !== 'POLL') {
      res.status(400).json({ error: 'Can only vote on poll prompts' });
      return;
    }

    // Verify poll option belongs to this prompt
    const pollOption = prompt.pollOptions.find(option => option.id === pollOptionId);
    if (!pollOption) {
      res.status(400).json({ error: 'Invalid poll option' });
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

    // Handle vote (upsert to allow changing vote)
    await prisma.$transaction(async (tx) => {
      // Remove any existing vote for this user on this prompt
      const existingVotes = await tx.pollVote.findMany({
        where: {
          userId: user.id,
          pollOption: {
            promptId: promptId,
          },
        },
        include: {
          pollOption: true,
        },
      });

      // Decrement vote counts for previous votes
      for (const vote of existingVotes) {
        await tx.pollOption.update({
          where: { id: vote.pollOptionId },
          data: { voteCount: { decrement: 1 } },
        });
        await tx.pollVote.delete({
          where: { id: vote.id },
        });
      }

      // Add new vote
      await tx.pollVote.create({
        data: {
          userId: user.id,
          pollOptionId,
        },
      });

      // Increment vote count
      await tx.pollOption.update({
        where: { id: pollOptionId },
        data: { voteCount: { increment: 1 } },
      });
    });

    // Return updated poll options
    const updatedOptions = await prisma.pollOption.findMany({
      where: { promptId },
      select: {
        id: true,
        text: true,
        voteCount: true,
      },
      orderBy: { voteCount: 'desc' },
    });

    res.json({ pollOptions: updatedOptions });
  } catch (error) {
    next(error);
  }
});

// Delete prompt
promptRoutes.delete('/:id', authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const { id } = req.params;
    
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    // Find the prompt and verify ownership
    const prompt = await prisma.prompt.findUnique({
      where: { id },
      include: {
        author: true,
      },
    });

    if (!prompt) {
      res.status(404).json({ error: 'Memory not found' });
      return;
    }

    // Check if user owns the prompt
    if (prompt.author.email !== req.user.email) {
      res.status(403).json({ error: 'You can only delete your own memories' });
      return;
    }

    // Delete the prompt (cascading delete will handle related records)
    await prisma.prompt.delete({
      where: { id },
    });

    res.json({ message: 'Memory deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// Like/unlike prompt
promptRoutes.post('/:id/like', authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const { id: promptId } = req.params;
    
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    // Verify prompt exists
    const prompt = await prisma.prompt.findUnique({
      where: { id: promptId },
    });

    if (!prompt) {
      res.status(404).json({ error: 'Memory not found' });
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

    // Check if user already liked this prompt
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_promptId: {
          userId: user.id,
          promptId: promptId,
        },
      },
    });

    let liked = false;
    if (existingLike) {
      // Unlike: remove like
      await prisma.like.delete({
        where: { id: existingLike.id },
      });
      liked = false;
    } else {
      // Like: add like
      await prisma.like.create({
        data: {
          userId: user.id,
          promptId: promptId,
        },
      });
      liked = true;
    }

    // Get updated like count
    const likesCount = await prisma.like.count({
      where: { promptId },
    });

    res.json({ liked, likesCount });
  } catch (error) {
    next(error);
  }
});