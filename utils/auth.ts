import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prismaClientInstance from "../backend/prismaClient"
export const auth = betterAuth({
  database: prismaAdapter(prismaClientInstance, {
        provider: 'mysql'
    }),
    emailAndPassword: { 
        enabled: true, 
    }
});