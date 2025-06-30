import { cookies } from "next/headers";
import { NextRequest } from "next/server";

import { AuthError, Auth } from "@/lib/auth";
import { getAccountByProviderId } from "@/db/queries/account";
import { GitHubUserEmail } from "@/types";
import { createUserAccount } from "@/actions/auth";
import { setSession } from "@/actions/sessions";

type Context = {
  params: Promise<{
    provider: string;
  }>;
};

export const GET = async (request: NextRequest, context: Context) => {
  const provider = (await context.params).provider;
  if (!provider) return new Response(null, { status: 400 });

  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const storedState = (await cookies()).get(`${provider}-oauth-state`)?.value;

  if (!code || !state || state !== storedState) {
    return new Response(null, { status: 400 });
  }

  try {
    const authClient = new Auth(provider);
    const tokenData = await authClient.getAccessToken(code);
    const user = await authClient.getUser(tokenData);
    const existingAccount = await getAccountByProviderId(String(user.id));

    if (existingAccount) {
      await setSession(existingAccount.userId);
      return new Response(null, {
        status: 302,
        headers: {
          Location: "/chat",
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
        Location: "/chat",
      },
    });
  } catch (error) {
    console.log('error', error)
    if (error instanceof AuthError) {
      return new Response(null, { status: 400 });
    }

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
