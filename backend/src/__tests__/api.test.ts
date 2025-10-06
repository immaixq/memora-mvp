import request from 'supertest';
import express from 'express';

// Simple test to ensure Jest is working
describe('API Health Check', () => {
  let app: express.Application;

  beforeAll(() => {
    app = express();
    app.get('/health', (_req, res) => {
      res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
    });
  });

  it('should return health status', async () => {
    const response = await request(app)
      .get('/health')
      .expect(200);

    expect(response.body).toHaveProperty('status', 'ok');
    expect(response.body).toHaveProperty('timestamp');
  });

  it('should handle 404 for unknown routes', async () => {
    await request(app)
      .get('/unknown-route')
      .expect(404);
  });
});

// Basic utility function tests
describe('Utility Functions', () => {
  it('should validate environment is test', () => {
    expect(process.env.NODE_ENV).toBe('test');
  });

  it('should have test database URL configured', () => {
    expect(process.env.DATABASE_URL).toContain('test');
  });
});