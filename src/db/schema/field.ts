import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { modelTable } from "./model";
import { relations } from "drizzle-orm";

export const fieldTable = pgTable("field", {
  id: uuid("id").defaultRandom().primaryKey(),
  modelId: uuid("model_id")
    .notNull()
    .references(() => modelTable.id, { onDelete: "cascade" }),
  name: text("name"), // eg. API key
  type: text("type"), // eg. text, select, slider

  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const fieldRelations = relations(fieldTable, ({ one }) => ({
  modelTable: one(modelTable, {
    fields: [fieldTable.modelId],
    references: [modelTable.id],
  }),
}));
