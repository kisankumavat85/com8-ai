import { pgTable, text, uuid } from "drizzle-orm/pg-core";

export const chatTable = pgTable("chat", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  systemPrompt: text("system_prompt"),
  modalProvider: text("modal_provider"),
});
