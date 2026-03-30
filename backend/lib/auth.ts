import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

import prismaClientInstance from "../prismaClient"
export const auth = betterAuth({
    trustedOrigins: ["http://localhost:5173"],
    baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
    database: prismaAdapter(prismaClientInstance, {
        provider: 'mysql'
    }),
    emailAndPassword: { 
        enabled: true,
    },
});
