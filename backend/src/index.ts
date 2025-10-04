import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

import { promptRoutes } from './routes/prompts';
import { responseRoutes } from './routes/responses';
import { reportRoutes } from './routes/reports';
import { communityRoutes } from './routes/communities';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const port = parseInt(process.env.PORT || '3001');

// Initialize Prisma
export const prisma = new PrismaClient();

// Initialize Firebase Admin
let auth: any = null;

if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
  try {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      }),
    });
    auth = getAuth();
    console.log('Firebase Admin initialized successfully');
  } catch (error) {
    console.error('Failed to initialize Firebase Admin:', error);
  }
} else {
  console.warn('Firebase Admin not initialized - missing environment variables');
}

export { auth };

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://memora-mvp.vercel.app', 'https://localhost:5173', 'https://localhost:5174'] 
    : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use(limiter);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/prompts', promptRoutes);
app.use('/api/responses', responseRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/communities', communityRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handler
app.use(errorHandler);

// Start server
async function startServer(): Promise<void> {
  try {
    await prisma.$connect();
    console.log('Database connected successfully');
    
    app.listen(port, '0.0.0.0', () => {
      console.log(`Server running on port ${port}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`Health check available at: http://localhost:${port}/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

if (require.main === module) {
  startServer();
}