import { redis } from "../redis";

export const createSession = async (userId: string) => {
  const sessionId = crypto.randomUUID();
  await redis.hset(`session-${userId}-${sessionId}`, { status: "ACTIVE" });
  await redis.expire(`session-${userId}-${sessionId}`, 60 * 60);
  return sessionId;
};
