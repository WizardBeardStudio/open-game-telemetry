import { checkPSK } from "../middleware/checkPSK";
import { Request, Response, NextFunction } from "express";

describe('Tests middleware which verifies that incoming requests contain a valid PSK', () => {
    let mockReq: Partial<Request>;
    let mockRes: any;
    let nextFunction: NextFunction;
    
    beforeEach(() => {
        process.env.PSK = "test-secret-uuid"
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
        nextFunction = jest.fn();
  });

    test('Should return 401 if PSK is missing', () => {
        const mockReq = {
                headers: {},
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
        checkPSK(mockReq as Request, mockRes as Response, nextFunction);

        // ASSERTIONS
        expect(mockRes.status).toHaveBeenCalledWith(401);
        expect(mockRes.json).toHaveBeenCalledWith({ error: "Unauthorized" });
        expect(nextFunction).not.toHaveBeenCalled();
    });

    
    test('Should return 401 if PSK is missing', () => {
        const mockReq = {
                headers: {'X-Telemetry-Key': '2acdb160-4f15-46e3-92b2-b377cae90f2b'},
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
        checkPSK(mockReq as Request, mockRes as Response, nextFunction);

        // ASSERTIONS
        expect(mockRes.status).toHaveBeenCalledWith(401);
        expect(mockRes.json).toHaveBeenCalledWith({ error: "Unauthorized" });
        expect(nextFunction).not.toHaveBeenCalled();
    });
});