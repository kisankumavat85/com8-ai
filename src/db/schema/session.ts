import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { userTable } from "./user";

export const sessionTable = pgTable("session", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

export const sessionRelations = relations(sessionTable, ({ one }) => ({
  userTable: one(userTable, {
    fields: [sessionTable.userId],
    references: [userTable.id],
  }),
}));
