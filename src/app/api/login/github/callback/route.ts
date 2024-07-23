import { cookies } from "next/headers";
import { generateIdFromEntropySize } from "lucia";
import { OAuth2RequestError } from "arctic";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { userTable } from "@/db/schema";
import { github, lucia } from "@/auth";
import { GitHubUser } from "@/types";

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

    // TODO: Remove
    console.info("githubUser >>>", githubUser);

    // TODO: Check below Number() code
    const existingUser = await db
      .select()
      .from(userTable)
      .where(eq(userTable.github_id, Number(githubUser.id)))
      .limit(1);

    if (existingUser.length) {
      const session = await lucia.createSession(existingUser[0].id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);

      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );

      return new Response(null, {
        status: 302,
        headers: {
          Location: "/",
        },
      });
    }

    const userId = generateIdFromEntropySize(10);

    // TODO: Check below Number() code
    await db.insert(userTable).values({
      id: userId,
      github_id: Number(githubUser.id),
      username: githubUser.login,
    });

    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

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
