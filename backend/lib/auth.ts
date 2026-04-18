import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { securityConfig } from "./securityConfig";
import dotenv from 'dotenv';
dotenv.config({path: '../backend'});

import prismaClientInstance from "../prismaClient"
export const auth = (trustedOrigins: string) => betterAuth({
    trustedOrigins: [trustedOrigins],
    baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
    database: prismaAdapter(prismaClientInstance, {
        provider: 'mysql'
    }),
    emailAndPassword: {
        enabled: securityConfig.emailAndPassword
    }
});
