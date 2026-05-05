import * as dotenv from 'dotenv'; 
dotenv.config();
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../lib/auth"
import type { Request, Response, NextFunction } from "express";
export async function validateSesstion(req: Request, res: Response, next: NextFunction){
    const session = await auth(process.env.BETTER_AUTH_TRUSTED_ORIGINS!).api.getSession({
        headers: fromNodeHeaders(req.headers)
    })
    if(!session){
        return res.json({ error: 'No valid session' });
    }
    else{
        next();
    }
}