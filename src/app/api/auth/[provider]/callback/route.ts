import { cookies } from "next/headers";
import { NextRequest } from "next/server";

import { AuthClientError, AuthClient } from "@/lib/oauth-client";
import { getAccountByProviderId } from "@/db/queries/account";
import { createSession } from "@/db/queries/session";
import { GitHubUserEmail } from "@/types";
import { createUserAccount } from "@/actions/auth";
import { _setSession, setSession } from "@/actions/sessions";

type Context = {
  params: {
    provider: string;
  };
};

export const GET = async (request: NextRequest, context: Context) => {
  const provider = context.params.provider;
  if (!provider) return new Response(null, { status: 400 });

  console.log("*******1")
  
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const storedState = cookies().get(`${provider}-oauth-state`)?.value;
  
  console.log({ code, state, storedState });
  
  if (!code || !state || state !== storedState) {
    return new Response(null, { status: 400 });
  }
  
  console.log("*******2")
  try {
    const authClient = new AuthClient(provider);
    const tokenData = await authClient.getAccessToken(code);
    const user = await authClient.getUser(tokenData);
    console.log("*******3")
    const existingAccount = await getAccountByProviderId(String(user.id));
    console.log("*******4")
    console.log('existingAccount---------', existingAccount)
    if (existingAccount) {
      await createSession(existingAccount.userId);

      return new Response(null, {
        status: 302,
        headers: {
          Location: "/",
        },
      });
    }

    if (!user.email) {
      const email = await getPrimaryEmail(tokenData.access_token);
      if (!email) {
        throw new Error("Email not found");
      }
      user.email = email;
    }

    const newUser = await createUserAccount({
      email: user.email,
      name: user.name,
      image: user.avatar_url,
      provider: "github",
      providerId: String(user.id),
    });

    await setSession(newUser.id);

    return new Response(null, {
      status: 302,
      headers: {
        Location: "/",
      },
    });
  } catch (error) {
    if (error instanceof AuthClientError) {
      return new Response(null, { status: 400 });
    }

    console.log('error', error)
    return new Response(null, { status: 500 });
  }
};

export const getPrimaryEmail = async (token: string) => {
  const response = await fetch("https://api.github.com/user/emails", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const emails = (await response.json()) as GitHubUserEmail[];
  const email = emails.find((email) => email.primary)?.email;
  return email;
};
