import * as dotenv from 'dotenv'; 
dotenv.config();

import type { Request, Response, NextFunction } from "express";

export function checkAdmin(req: Request, res: Response, next: NextFunction) {
    const accessLevel = req.headers["accessLevel"];

    if (!accessLevel || accessLevel !== "admin") {
        return res.status(401).json({ error: "Unauthorized" });
    }

    next();
}