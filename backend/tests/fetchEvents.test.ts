import type { Request, Response } from "express";
import { fetchEvents } from "../controllers/eventsController";
import { prismaMock } from "../singleton";

describe('Event fetching from database', () => {
    let mockRes: any;

    /**
     * SETUP: Resets mocks before every single test case.
     * This ensures that call counts and mock return values don't leak between tests.
     */
    beforeEach(() => {
        jest.clearAllMocks();
        mockRes = {
            status: jest.fn().mockReturnThis(), // Allows chaining like .status(200).json(...)
            json: jest.fn().mockReturnThis(),
        };
    });

    /**
     * TEST: Default Pagination
     * Validates that when no query parameters are passed, the controller 
     * defaults to Page 1 (skip 0) and a Limit of 10 (take 10).
     */
    it('should fetch events with default pagination when no queries are provided', async () => {
        // ARRANGE: Create a request with an empty query object
        const mockReq = {
            query: {}
        } as unknown as Request;

        // MOCK: Setup the expected return object from Prisma
        prismaMock.gameEvent.findMany.mockResolvedValue([{
            id: 'ce50ad03-6c09-47c5-a244-7b5e22845e11',
            gameName: 'Cyber Sprint',
            gameType: 'Racing',
            gameVersion: '1.0.0',
            eventType: 'SESSION_START',
            timestamp: new Date('2026-02-03T02:11:33.825Z'),
            payload: {
                map: 'Neo-Tokyo',
                players: 8
            }
        }]);

        // ACT: Call the controller function
        await fetchEvents(mockReq, mockRes);

        // ASSERT: Check if findMany was called with the correct default pagination logic
        expect(prismaMock.gameEvent.findMany).toHaveBeenCalledWith(
            expect.objectContaining({
                where: {},
                take: 10,
                skip: 0
            })
        );
        expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    /**
     * TEST: Full Filtering
     * Verifies that when multiple filters are provided in the URL, they are 
     * all mapped correctly into the Prisma 'where' object.
     */
    it('should apply all filters (gameName, gameType, eventType) to the where clause', async () => {
        // ARRANGE: Setup request with specific filtering criteria
        const mockReq = {
            query: {
                gameName: 'Super Mario',
                gameType: 'Platformer',
                eventType: 'Jump'
            }
        } as unknown as Request;

        prismaMock.gameEvent.findMany.mockResolvedValue([{
            id: 'ce50ad03-6c09-47c5-a244-7b5e22845e11',
            gameName: 'Super Mario',
            gameType: 'Platformer',
            gameVersion: '1.0.0',
            eventType: 'Jump',
            timestamp: new Date('2026-02-03T02:11:33.825Z'),
            payload: {
                stage: 'Stage_1'
            }
        }]);

        // ACT: Call the controller function
        await fetchEvents(mockReq, mockRes);

        // ASSERT: Ensure the 'where' clause contains all three filters
        expect(prismaMock.gameEvent.findMany).toHaveBeenCalledWith(
            expect.objectContaining({
                where: {
                    gameName: 'Super Mario',
                    gameType: 'Platformer',
                    eventType: 'Jump'
                }
            })
        );
        expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    /**
     * TEST: Offset Calculation
     * Validates the pagination formula: skip = (page - 1) * limit.
     * Page 3 with a limit of 20 should result in skipping 40 records.
     */
    it('should correctly calculate offset for specific page and limit', async () => {
        // ARRANGE: Request page 3 with 20 items per page
        const mockReq = {
            query: {
                page: '3',
                limit: '20'
            }
        } as unknown as Request;

        prismaMock.gameEvent.findMany.mockResolvedValue([{
            id: 'ce50ad03-6c09-47c5-a244-7b5e22845e11',
            gameName: 'Super Mario',
            gameType: 'Platformer',
            gameVersion: '1.0.0',
            eventType: 'Jump',
            timestamp: new Date('2026-02-03T02:11:33.825Z'),
            payload: {
                stage: 'Stage_1'
            }
        }]);

        // ACT: Call the controller function
        await fetchEvents(mockReq, mockRes);

        // ASSERT: Verify the calculated skip (40) and take (20)
        expect(prismaMock.gameEvent.findMany).toHaveBeenCalledWith(
            expect.objectContaining({
                take: 20,
                skip: 40
            })
        );
        expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    /**
     * TEST: Partial Filtering
     * Ensures the controller handles requests where only some filters are provided,
     * confirming the 'where' clause isn't cluttered with undefined keys.
     */
    it('should handle partial filters correctly', async () => {
        // ARRANGE: Request with only one of the possible filters
        const mockReq = {
            query: {
                gameName: 'Zelda'
            }
        } as unknown as Request;

        prismaMock.gameEvent.findMany.mockResolvedValue([{
            id: 'ce50ad03-6c09-47c5-a244-7b5e22845e11',
            gameName: 'The Legend of Zelda',
            gameType: 'Action/Adventure',
            gameVersion: '1.0.0',
            eventType: 'Jump',
            timestamp: new Date('2026-02-03T02:11:33.825Z'),
            payload: {
                stage: 'Stage_1'
            }
        }]);

        // ACT: Call the controller function
        await fetchEvents(mockReq, mockRes);

        // ASSERT: Confirm only gameName was passed to the database filter
        expect(prismaMock.gameEvent.findMany).toHaveBeenCalledWith(
            expect.objectContaining({
                where: { gameName: 'Zelda' }
            })
        );
        expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    /**
     * TEST: Empty Results (404)
     * Verifies the business logic that if findMany returns an empty array, 
     * the user receives a 404 error instead of an empty 200 list.
     */
    it('should return 404 if no events match the provided filters', async () => {
        // ARRANGE: Search for something that won't exist
        const mockReq = {
            query: {
                gameName: 'NonExistentGame',
            }
        } as unknown as Request;

        // MOCK: Force Prisma to return an empty array []
        prismaMock.gameEvent.findMany.mockResolvedValue([]);

        // ACT: Call the controller function
        await fetchEvents(mockReq, mockRes);

        // ASSERT: Verify the 404 response status and specific error JSON
        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.json).toHaveBeenCalledWith({
            error: 'Event does not exist'
        });
    });

    /**
     * TEST: Database Failure (500)
     * Verifies that the controller's try/catch block handles unexpected
     * database crashes or connection issues gracefully.
     */
    it('should return 500 status code when the database query fails', async () => {
        // ARRANGE: Trigger a request
        const mockReq = { query: {} } as Request;

        // MOCK: Simulate a database rejection (error thrown by Prisma)
        prismaMock.gameEvent.findMany.mockRejectedValue(new Error('Database connection failed'));

        // ACT: Call the controller function
        await fetchEvents(mockReq, mockRes);

        // ASSERT: Ensure a 500 status and generic error message are returned
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
});
