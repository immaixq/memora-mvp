import { Router } from 'express';
import { prisma } from '../index';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';
import { createReportSchema } from '../schemas/report';

export const reportRoutes = Router();

// Create a report
reportRoutes.post('/', authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const { resourceType, resourceId, reason } = createReportSchema.parse(req.body);

    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    // Verify resource exists
    if (resourceType === 'PROMPT') {
      const prompt = await prisma.prompt.findUnique({
        where: { id: resourceId },
      });
      if (!prompt) {
        res.status(404).json({ error: 'Prompt not found' });
        return;
      }
    } else if (resourceType === 'RESPONSE') {
      const response = await prisma.response.findUnique({
        where: { id: resourceId },
      });
      if (!response) {
        res.status(404).json({ error: 'Response not found' });
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

    const report = await prisma.report.create({
      data: {
        resourceType,
        resourceId,
        reason,
        reporterId: user.id,
      },
    });

    res.status(201).json({
      id: report.id,
      message: 'Report submitted successfully',
    });
  } catch (error) {
    next(error);
  }
});