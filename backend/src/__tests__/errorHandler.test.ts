import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { errorHandler } from '../middleware/errorHandler';

// Mock console.error to avoid cluttering test output
jest.spyOn(console, 'error').mockImplementation(() => {});

describe('errorHandler', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should handle ZodError with validation details', () => {
    const zodError = new ZodError([
      {
        code: 'invalid_type',
        expected: 'string',
        received: 'number',
        path: ['name'],
        message: 'Expected string, received number',
      },
    ]);

    errorHandler(zodError, mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Validation error',
      details: [{
        field: 'name',
        message: 'Expected string, received number',
      }],
    });
  });

  it('should handle generic errors', () => {
    const genericError = new Error('Something went wrong');

    errorHandler(genericError, mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Internal server error',
      message: undefined, // Since NODE_ENV is not 'development' in test
    });
  });

  it('should handle Prisma P2002 error (unique constraint)', () => {
    // Create a mock Prisma error object
    const prismaError = {
      name: 'PrismaClientKnownRequestError',
      code: 'P2002',
      meta: { target: ['email'] },
      message: 'Unique constraint failed'
    };
    
    // Make it instanceof PrismaClientKnownRequestError
    Object.setPrototypeOf(prismaError, Prisma.PrismaClientKnownRequestError.prototype);

    errorHandler(prismaError as any, mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(409);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Resource already exists',
      field: ['email'],
    });
  });

  it('should include error message in development mode', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    const genericError = new Error('Something went wrong');

    errorHandler(genericError, mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Internal server error',
      message: 'Something went wrong',
    });

    process.env.NODE_ENV = originalEnv;
  });
});