import { AuthError } from "@/lib/auth";
import { redis } from "../redis";

export type SessionData = {
  userId: string;
  status: string;
  createdAt: string;
};

export const ttl = 60 * 60 * 24 * 7; // 7 days

export const createSession = async (userId: string) => {
  try {
    const sessionId = crypto.randomUUID();
    const key = `session-${sessionId}`;
    const sessionData: SessionData = {
      userId,
      status: "ACTIVE",
      createdAt: new Date().toISOString(),
    };
    await redis.multi().hset(key, sessionData).expire(key, ttl).exec();
    return sessionId;
  } catch (error) {
    throw new AuthError("Failed to create session", { cause: error });
  }
};

export const getSession = async (sessionId: string) => {
  try {
    const key = `session-${sessionId}`;
    const sessionData: SessionData | null = await redis.hgetall(key);
    return sessionData;
  } catch (error) {
    throw new AuthError("Failed to fetch session", { cause: error });
  }
};

export const deleteSession = async (sessionId: string) => {
  try {
    const key = `session-${sessionId}`;
    return await redis.hdel(key, 'userId', 'status', 'createdAt');
  } catch (error) {
    throw new AuthError("Failed to delete session", { cause: error });
  }
};
