import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const chatTable = pgTable("chat", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  systemPrompt: text("system_prompt"),
  modalProvider: text("modal_provider"),

  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
