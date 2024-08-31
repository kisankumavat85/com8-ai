import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const userTable = pgTable("user", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name"),
  image: text("image"),
  email: text("email").unique(),
  emailVerified: timestamp("email_verified", { mode: "date" }),
});

export type InsertUser = typeof userTable.$inferInsert;
