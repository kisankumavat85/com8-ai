import { relations } from "drizzle-orm";
import { pgTable, text, uuid } from "drizzle-orm/pg-core";

import { userTable } from "./user";

export const accountTable = pgTable("account", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  provider: text("provider"),
  providerId: text("provider_id").unique(),
});

export const accountRelations = relations(accountTable, ({ one }) => ({
  userTable: one(userTable, {
    fields: [accountTable.userId],
    references: [userTable.id],
  }),
}));

export type InsertAccount = typeof accountTable.$inferInsert;
