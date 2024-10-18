import { pgTable, text, uuid } from "drizzle-orm/pg-core";

export const modelProviderTable = pgTable("model-provider", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  description: text("description")
})