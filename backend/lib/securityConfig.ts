export type SecurityConfig = {
    emailAndPassword: boolean,
    socialProviders: {
        github?: githubProvider
        gitlab?: gitLabProvider
    }
}

// Interface for authentication providers
interface AuthProvider{
    clientId: string
    clientSecret: string   
}

export class githubProvider implements AuthProvider {
    clientId: string
    clientSecret: string

    constructor(clientId: string, clientSecret: string) {
        this.clientId = clientId
        this.clientSecret = clientSecret
    }
}

export class gitLabProvider implements AuthProvider {
    clientId: string
    clientSecret: string
    private issuer: string

    constructor(clientId: string, clientSecret: string, issuer: string) {
        this.clientId = clientId
        this.clientSecret = clientSecret
        this.issuer = issuer
    }
}

//config for Better Auth 
export const securityConfig: SecurityConfig = {
    emailAndPassword: true,
    socialProviders:{
        
    }
}
