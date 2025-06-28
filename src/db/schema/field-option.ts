import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { fieldTable } from "./field";
import { relations } from "drizzle-orm";

export const fieldOptionTable = pgTable("field_option", {
  id: uuid("id").defaultRandom().primaryKey(),
  fieldId: uuid("field_id")
    .notNull()
    .references(() => fieldTable.id, { onDelete: "cascade" }),
  label: text("label").notNull(),
  value: text("value").notNull(),

  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const fieldOptionRelations = relations(fieldOptionTable, ({ one }) => ({
  fieldTable: one(fieldTable, {
    fields: [fieldOptionTable.fieldId],
    references: [fieldTable.id],
  }),
}));
