import { Router } from 'express';
import { prisma } from '../index';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';
import { z } from 'zod';

export const communityRoutes = Router();

const createCommunitySchema = z.object({
  name: z.string().min(1, 'Community name is required').max(100, 'Name too long'),
  slug: z.string().min(1, 'Slug is required').max(50, 'Slug too long').regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
});

const updateCommunitySchema = z.object({
  name: z.string().min(1, 'Community name is required').max(100, 'Name too long').optional(),
});

// Get all communities
communityRoutes.get('/', async (req, res, next) => {
  try {
    const communities = await prisma.community.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: {
            prompts: true,
          },
        },
      },
    });

    res.json(communities);
  } catch (error) {
    next(error);
  }
});

// Get community by slug
communityRoutes.get('/:slug', async (req, res, next) => {
  try {
    const { slug } = req.params;

    const community = await prisma.community.findUnique({
      where: { slug },
      include: {
        _count: {
          select: {
            prompts: true,
          },
        },
      },
    });

    if (!community) {
      res.status(404).json({ error: 'Community not found' });
      return;
    }

    res.json(community);
  } catch (error) {
    next(error);
  }
});

// Create new community
communityRoutes.post('/', authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const { name, slug } = createCommunitySchema.parse(req.body);
    
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    // Check if slug already exists
    const existingCommunity = await prisma.community.findUnique({
      where: { slug },
    });

    if (existingCommunity) {
      res.status(409).json({ error: 'A community with this slug already exists' });
      return;
    }

    // Ensure user exists in database
    await prisma.user.upsert({
      where: { email: req.user.email },
      update: {},
      create: {
        id: req.user.uid,
        name: req.user.name || req.user.email.split('@')[0],
        email: req.user.email,
        authProvider: 'firebase',
      },
    });

    const community = await prisma.community.create({
      data: {
        name,
        slug,
      },
      include: {
        _count: {
          select: {
            prompts: true,
          },
        },
      },
    });

    res.status(201).json(community);
  } catch (error) {
    next(error);
  }
});

// Update community
communityRoutes.patch('/:slug', authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const { slug } = req.params;
    const { name } = updateCommunitySchema.parse(req.body);
    
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const community = await prisma.community.findUnique({
      where: { slug },
    });

    if (!community) {
      res.status(404).json({ error: 'Community not found' });
      return;
    }

    const updatedCommunity = await prisma.community.update({
      where: { slug },
      data: { name },
      include: {
        _count: {
          select: {
            prompts: true,
          },
        },
      },
    });

    res.json(updatedCommunity);
  } catch (error) {
    next(error);
  }
});

// Get community prompts
communityRoutes.get('/:slug/prompts', async (req, res, next) => {
  try {
    const { slug } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const sort = (req.query.sort as string) || 'recent';
    
    const skip = (page - 1) * limit;
    
    const community = await prisma.community.findUnique({
      where: { slug },
    });

    if (!community) {
      res.status(404).json({ error: 'Community not found' });
      return;
    }
    
    const orderBy = sort === 'trending' 
      ? [{ responses: { _count: 'desc' } }, { createdAt: 'desc' }]
      : [{ createdAt: 'desc' }];

    const [prompts, total] = await Promise.all([
      prisma.prompt.findMany({
        where: { communityId: community.id },
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
      prisma.prompt.count({ where: { communityId: community.id } }),
    ]);

    res.json({
      prompts,
      community,
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