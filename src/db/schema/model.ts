import { pgTable, text } from "drizzle-orm/pg-core";

export const modelTable = pgTable("model", {
  id: text("id"),
  name: text("name"),
  developer: text("developer"),
  description: text("description"),
});
