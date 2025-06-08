import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .union([z.literal("development"), z.literal("production")])
    .default("development"),
  NEON_DATABASE_URL: z.string().url(),
  OAUTH_BASE_REDIRECT_URI: z.string().url(),
  GITHUB_CLIENT_ID: z.string(),
  GITHUB_CLIENT_SECRET: z.string(),
  UPSTASH_REDIS_REST_URL: z.string(),
  UPSTASH_REDIS_REST_TOKEN: z.string(),
});

export const env = envSchema.parse(process.env);
