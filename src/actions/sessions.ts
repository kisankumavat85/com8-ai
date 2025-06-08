import "server-only";
import { cookies } from "next/headers";

import { lucia } from "@/lib/auth";
import { redis } from "@/db/redis";
import { createSession } from "@/db/queries/session";
import { env } from "@/lib/env";

export const _setSession = async (userId: string) => {
  const session = await lucia.createSession(userId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);

  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
};

export const setSession = async (userId: string) => {
  const sessionId = await createSession(userId);

  cookies().set("session-id", sessionId, {
    httpOnly: true,
    maxAge: 60 * 10,
    path: "/",
    sameSite: "lax",
    secure: env.NODE_ENV === "production",
  });
};
