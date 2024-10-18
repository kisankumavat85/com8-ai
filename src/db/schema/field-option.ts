import { pgTable, text, uuid } from "drizzle-orm/pg-core";

import { fieldTable } from "./field";
import { relations } from "drizzle-orm";

export const fieldOptionTable = pgTable("field_option", {
  id: uuid("id").defaultRandom().primaryKey(),
  fieldId: text("field_id")
    .notNull()
    .references(() => fieldTable.id, { onDelete: "cascade" }),
  label: text("label").notNull(),
  value: text("value").notNull(),
});

export const fieldOptionRelations = relations(fieldOptionTable, ({ one }) => ({
  fieldTable: one(fieldTable, {
    fields: [fieldOptionTable.fieldId],
    references: [fieldTable.id],
  }),
}));
