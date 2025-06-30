import "server-only";
import { cookies } from "next/headers";

// import { lucia } from "@/lib/auth";
import {
  createSession,
  deleteSession,
  getSession,
  ttl,
} from "@/db/queries/session";
import { env } from "@/lib/env";
import { redirect } from "next/navigation";

export const setSession = async (userId: string) => {
  const sessionId = await createSession(userId);

  (await cookies()).set("session-id", sessionId || "", {
    httpOnly: true,
    maxAge: ttl,
    path: "/",
    sameSite: "lax",
    secure: env.NODE_ENV === "production",
  });
};

export const verifySession = async () => {
  const sessionId = (await cookies()).get("session-id")?.value;
  if (!sessionId) redirect("/login");
  const sessionData = await getSession(sessionId);
  if (!sessionData?.userId) redirect("/login");
  return sessionData;
};

export const removeSession = async (sessionId: string) => {
  await deleteSession(sessionId);
  (await cookies()).delete("session-id");
};

// export const _setSession = async (userId: string) => {
//   const session = await lucia.createSession(userId, {});
//   const sessionCookie = lucia.createSessionCookie(session.id);

//   cookies().set(
//     sessionCookie.name,
//     sessionCookie.value,
//     sessionCookie.attributes
//   );
// };
