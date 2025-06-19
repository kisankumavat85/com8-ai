import { relations } from "drizzle-orm";
import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { userTable } from "./user";

export const authProviders = ["github", "google"] as const;
export const providersEnum = pgEnum("provider", authProviders);

export const accountTable = pgTable("account", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  provider: providersEnum("provider").notNull(),
  providerId: text("provider_id").unique(),

  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const accountRelations = relations(accountTable, ({ one }) => ({
  userTable: one(userTable, {
    fields: [accountTable.userId],
    references: [userTable.id],
  }),
}));

export type InsertAccount = typeof accountTable.$inferInsert;
