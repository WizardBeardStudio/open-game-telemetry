import type { Request, Response } from "express";
import { ingestEvents } from "../controllers/eventsController";
import { prismaMock } from "../singleton";
import { PrismaClientKnownRequestError, PrismaClientValidationError } from "@prisma/client/runtime/library";

describe('event ingestion', () => {
  let mockRes: any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  describe('Tests event ingestion', () => {
    
    /**
     * SUCCESS CASE
     * Verifies that when valid data and a correct PSK are provided,
     * the data is persisted via Prisma and a 201 status is returned.
     */
    test('should save a game event and return 201', async () => {
      const mockReq = {
        headers: { "X-Telemetry-Key": "valid-key" },
        body: {
          metaData: { 
            id: "67845c8c-0e6a-4694-95df-37bc49e91f1b", 
            eventType: "kill", 
            gameInfo: { name: "Doom", type: "FPS", version: "1.0" }, 
            timeStamp: new Date() 
          },
          eventPayload: { enemy: "imp" }
        }
      } as unknown as Request;

      prismaMock.gameEvent.create.mockResolvedValue({} as any);
      
      await ingestEvents(mockReq, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({ status: "Event ingested" });
    });

    /**
     * AUTHENTICATION EDGE CASE
     * Ensures the database is never reached if the security header is missing.
     */
    test('should return 401 if X-Telemetry-Key is missing', async () => {
      const mockReq = { headers: {}, body: {} } as unknown as Request;

      await ingestEvents(mockReq, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      // Verify database was not called
      expect(prismaMock.gameEvent.create).not.toHaveBeenCalled();
    });

    /**
     * SCHEMA VALIDATION EDGE CASE
     * Verifies that if the data structure doesn't match the Prisma schema,
     * the controller catches the error and returns a 400 Bad Request.
     */
    test('should return 400 when Prisma validation fails', async () => {
      const mockReq = {
        headers: { "X-Telemetry-Key": "valid" },
        body: { metaData: { gameInfo: {} } } 
      } as unknown as Request;

      prismaMock.gameEvent.create.mockRejectedValue(
        new PrismaClientValidationError("Incomplete data", { clientVersion: "5.0.0" })
      );

      await ingestEvents(mockReq, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({ errorMessage: "Incomplete data" }));
    });

    /**
     * DATABASE CONSTRAINT EDGE CASE
     * Tests "Known Request Errors" (e.g., P2002 Unique Constraint violation).
     * This happens if a client tries to submit the same event UUID twice.
     */
    test('should return 500 for known Prisma request errors (e.g. Unique ID conflict)', async () => {
      const mockReq = {
        headers: { "X-Telemetry-Key": "valid" },
        body: { metaData: { id: "duplicate-id", gameInfo: {} } }
      } as unknown as Request;

      const error = new PrismaClientKnownRequestError("Unique constraint failed", {
        code: "P2002",
        clientVersion: "5.0.0",
      });

      prismaMock.gameEvent.create.mockRejectedValue(error);

      await ingestEvents(mockReq, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ errorMessage: "Database error P2002" });
    });

    /**
     * SYSTEM FAILURE EDGE CASE
     * Verifies the fallback "catch-all" error handling for unexpected issues
     * like a lost database connection or memory limits.
     */
    test('should return 500 for unhandled generic errors (e.g. DB connection lost)', async () => {
      const mockReq = {
        headers: { "X-Telemetry-Key": "valid" },
        body: { metaData: { gameInfo: {} } }
      } as unknown as Request;

      prismaMock.gameEvent.create.mockRejectedValue(new Error("Network Timeout"));

      await ingestEvents(mockReq, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ errorMessage: "Internal server error" });
    });
  });
});
