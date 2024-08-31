import { cookies } from "next/headers";
import { OAuth2RequestError } from "arctic";

import { github } from "@/lib/auth";
import { getAccountByProviderId } from "@/db/queries/account";
import { setSession } from "@/actions/sessions";
import { createUserAccount } from "@/actions/auth";
import { GitHubUser, GitHubUserEmail } from "@/types";

export const GET = async (request: Request): Promise<Response> => {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const storedState = cookies().get("github_oauth_state")?.value;

  if (!code || !state || !storedState || state !== storedState) {
    return new Response(null, { status: 400 });
  }

  try {
    const tokens = await github.validateAuthorizationCode(code);
    const githubUserResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });

    const githubUser: GitHubUser = await githubUserResponse.json();
    const existingAccount = await getAccountByProviderId(String(githubUser.id));

    if (existingAccount) {
      await setSession(existingAccount.userId);

      return new Response(null, {
        status: 302,
        headers: {
          Location: "/",
        },
      });
    }

    if (!githubUser.email) {
      const email = await getPrimaryEmail(tokens.accessToken);
      if (!email) {
        throw new Error("Email not found");
      }
      githubUser.email = email;
    }

    const user = await createUserAccount({
      email: githubUser.email,
      name: githubUser.name,
      image: githubUser.image,
      provider: "github",
      providerId: String(githubUser.id),
    });

    await setSession(user.id);

    return new Response(null, {
      status: 302,
      headers: {
        Location: "/",
      },
    });
  } catch (error) {
    if (error instanceof OAuth2RequestError) {
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
