import { validateSesstion } from "../middleware/validateSession";
import type { Request, Response, NextFunction } from "express";

// Mock dependencies
jest.mock("../lib/auth", () => ({
  auth: jest.fn(),
}));

jest.mock("better-auth/node", () => ({
  fromNodeHeaders: jest.fn(),
}));

import { auth } from "../lib/auth";
import { fromNodeHeaders } from "better-auth/node";

describe("validateSesstion middleware", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      headers: {
        authorization: "Bearer test-token",
      },
    };

    res = {
      json: jest.fn(),
    };

    next = jest.fn();

    jest.clearAllMocks();
  });

  it("should call next() when a valid session exists", async () => {
    const mockSession = {
      session: {
        id: "sess_1",
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: "user_1",
        expiresAt: new Date(Date.now() + 1000 * 60 * 60),
        token: "token_abc",
        ipAddress: "127.0.0.1",
        userAgent: "jest",
      },
      user: {
        id: "user_1",
        createdAt: new Date(),
        updatedAt: new Date(),
        email: "test@example.com",
        emailVerified: true,
        name: "Test User",
        image: null,
      },
    };

    const mockGetSession = jest.fn().mockResolvedValue(mockSession);

    (auth as jest.Mock).mockReturnValue({
      api: {
        getSession: mockGetSession,
      },
    });

    (fromNodeHeaders as jest.Mock).mockReturnValue(req.headers);

    await validateSesstion(req as Request, res as Response, next);

    expect(mockGetSession).toHaveBeenCalledWith({
      headers: req.headers,
    });

    expect(next).toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it("should return error when no session exists", async () => {
    const mockGetSession = jest.fn().mockResolvedValue(null);

    (auth as jest.Mock).mockReturnValue({
      api: {
        getSession: mockGetSession,
      },
    });

    (fromNodeHeaders as jest.Mock).mockReturnValue(req.headers);

    await validateSesstion(req as Request, res as Response, next);

    expect(mockGetSession).toHaveBeenCalledWith({
      headers: req.headers,
    });

    expect(res.json).toHaveBeenCalledWith({
      error: "No valid session",
    });

    expect(next).not.toHaveBeenCalled();
  });
});
 