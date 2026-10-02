import type { Request, Response } from "express";
import { githubProvider, gitLabProvider, securityConfig } from "../lib/securityConfig";

export async function addProvider(req: Request, res: Response){
    const {provider, clientId, clientSecret, issuer} = req.body;

    if(provider === 'github'){
        securityConfig.socialProviders.github = new githubProvider(clientId, clientSecret)
        return res.status(200).json({ message: "Provider added successfully" });
    }

    if(provider === 'gitlab'){
        securityConfig.socialProviders.gitlab = new gitLabProvider(clientId, clientSecret, issuer);
        return res.status(200).json({ message: "Provider added successfully" });
    }

        res.status(400).json({ message: "Invalid provider credentials" });
}
