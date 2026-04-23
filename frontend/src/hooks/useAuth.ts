import { useState } from "react";
import { useNavigate } from "react-router";
import { authClient } from "../lib/auth-client";

const client = authClient(import.meta.env.VITE_BETTER_AUTH_URL); //may need to  tweak this as setting the baseURL here may complicate testing

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  //Auth actions object returned by the hook, each property defined by the desired auth method and containing auth action sub-properties for that auth method, signout method applies to all auth methods
  //NOTE: would like to have a helper function for request, success and error states to reduce duplication
  const authActions = {
    email: {
      signup: async (name: string, email: string, password: string) =>
        await client.signUp.email(
          { email, password, name },
          {
            onRequest: () => setIsLoading(true),
            onSuccess: () => {
              setIsLoading(false);
              navigate("/home");
            },
            onError: (ctx) => {
              setIsLoading(false);
              alert(ctx.error.message);
            },
          },
        ),

      signin: async (email: string, password: string) =>
        await client.signIn.email(
          { email, password, rememberMe: false },
          {
            onRequest: () => setIsLoading(true),
            onSuccess: async () => {
              setIsLoading(false);
              navigate("/home");
            },
            onError: (ctx) => {
              setIsLoading(false);
              alert(ctx.error.message);
            },
          },
        ),
    },

    signout: async () =>
      await client.signOut({
        fetchOptions: {
          onRequest: () => setIsLoading(true),
          onSuccess: async() => {
            await client.revokeSession({
              token: "session-token"
            })
            setIsLoading(false);
            navigate('/login')
          },
          onError: (ctx) => {
            setIsLoading(false);
            alert(ctx.error.message)
          }
        }
      }),
  };

  return {
    isLoading,
    authActions,
  };
}
