import { json, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { userTable } from "./user";
import { chatTable } from "./chat";
import { modelTable } from "./model";

export const messageTable = pgTable("message", {
  id: uuid("id").defaultRandom().primaryKey(),
  chatId: uuid("chat_id")
    .notNull()
    .references(() => chatTable.id),
  userId: uuid("user_id")
    .notNull()
    .references(() => userTable.id),
  modelId: uuid("model_id")
    .notNull()
    .references(() => modelTable.id),
  role: text("role").notNull(), // eg. "user" | "assistant" | "system"
  type: text("type").notNull(), // eg. "message" TODO: What is type in OpenAI
  message: text("message").notNull(),
  rawResponse: json("raw_response").default(null),

  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// TODO: Store other properties later
// AI specific properties, null for role user
// tokens_used: integer("tokens_used").default(null),
// latency: float("latency").default(null),
// finish_reason: text("finish_reason").default(null),
// temperature: float("temperature").default(null),
// top_p: float("top_p").default(null),
// max_tokens: integer("max_tokens").default(null),
// frequency_penalty: float("frequency_penalty").default(null),
// presence_penalty: float("presence_penalty").default(null),

// // AI response extras
// function_call: jsonb("function_call").default(null),
// tool_usage: jsonb("tool_usage").default(null),
// raw_response: jsonb("raw_response").default(null),
