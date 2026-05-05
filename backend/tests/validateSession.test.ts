import { validateSesstion } from '../middleware/validateSession';
import type { Request, Response, NextFunction } from 'express';

// Mock dependencies
jest.mock('../lib/auth', () => ({
  auth: jest.fn()
}));

jest.mock('better-auth/node', () => ({
  fromNodeHeaders: jest.fn()
}));

import { auth } from '../lib/auth';
import { fromNodeHeaders } from 'better-auth/node';

describe('validateSesstion middleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      headers: {
        authorization: 'Bearer test-token'
      }
    };

    res = {
      json: jest.fn()
    };

    next = jest.fn();

    jest.clearAllMocks();
  });

  it('should call next() when a valid session exists', async () => {
    const mockGetSession = jest.fn().mockResolvedValue({ user: { id: '123' } });

    (auth as jest.Mock).mockReturnValue({
      api: {
        getSession: mockGetSession
      }
    });

    (fromNodeHeaders as jest.Mock).mockReturnValue(req.headers);

    await validateSesstion(req as Request, res as Response, next);

    expect(mockGetSession).toHaveBeenCalledWith({
      headers: req.headers
    });

    expect(next).toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it('should return error when no session exists', async () => {
    const mockGetSession = jest.fn().mockResolvedValue(null);

    (auth as jest.Mock).mockReturnValue({
      api: {
        getSession: mockGetSession
      }
    });

    (fromNodeHeaders as jest.Mock).mockReturnValue(req.headers);

    await validateSesstion(req as Request, res as Response, next);

    expect(mockGetSession).toHaveBeenCalled();

    expect(res.json).toHaveBeenCalledWith({
      error: 'No valid session'
    });

    expect(next).not.toHaveBeenCalled();
  });
});