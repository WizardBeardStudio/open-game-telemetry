import * as dotenv from 'dotenv'; 
dotenv.config();

import type { Request, Response, NextFunction } from "express";

export function checkPSK(req: Request, res: Response, next: NextFunction) {
    const PSK = req.headers["x-telemetry-key"]; 

    if (!PSK || PSK !== process.env.PSK) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    next();
};
