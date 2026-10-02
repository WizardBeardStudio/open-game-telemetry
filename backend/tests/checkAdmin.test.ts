import { checkAdmin } from '../middleware/checkAdmin';
import { Request, Response, NextFunction } from "express";

describe('checks the accessLevel header to see if it is admin', () => {
    
    test('should allow access for admin users', () => {
        const mockReq = {
            headers: {
                accessLevel: 'admin'
            }
        } as unknown as Request;
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        } as unknown as Response;
        let nextFunction: NextFunction = jest.fn();

        checkAdmin(mockReq as Request, mockRes as Response, nextFunction);

        expect(nextFunction).toHaveBeenCalled();
    });

    test('should not allow access for non-admin users', () => {
        const mockReq = {
            headers: {
                accessLevel: 'user'
            }
        } as unknown as Request;
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        } as unknown as Response;
        let nextFunction: NextFunction = jest.fn();

        checkAdmin(mockReq as Request, mockRes as Response, nextFunction);

        expect(nextFunction).not.toHaveBeenCalled();
    });

    test('should not allow access when accessLevel is undefined', () => {
        const mockReq = {
            headers: {
                accessLevel: undefined
            }
        } as unknown as Request;
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        } as unknown as Response;
        let nextFunction: NextFunction = jest.fn();

        checkAdmin(mockReq as Request, mockRes as Response, nextFunction);

        expect(nextFunction).not.toHaveBeenCalled();
    });
});