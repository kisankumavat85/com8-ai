import { env } from "@/lib/env";
import { Auth } from "@/lib/auth";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

type Context = {
  params: Promise<{
    provider: string;
  }>;
};

export const GET = async (request: NextRequest, context: Context) => {
  const provider = (await context.params).provider;
  if (!provider) return new Response(null, { status: 400 });

  const authClient = new Auth(provider);
  const state = authClient.generateState();
  const authURL = authClient.createAuthURL(state);

  (await cookies()).set(`${provider}-oauth-state`, state, {
    path: "/",
    secure: env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: "lax",
  })

  console.log('authURL', authURL)

  return Response.redirect(authURL);
};
