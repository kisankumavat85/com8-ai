import { pgTable, text, uuid } from "drizzle-orm/pg-core";

import { modelTable } from "./model";
import { relations } from "drizzle-orm";

export const fieldTable = pgTable("field", {
  id: uuid("id").defaultRandom().primaryKey(),
  modelId: text("model_id")
    .notNull()
    .references(() => modelTable.id, { onDelete: "cascade" }),
  name: text("name"), // eg. API key
  type: text("type"), // eg. text, select, slider
});

export const fieldRelations = relations(fieldTable, ({ one }) => ({
  modelTable: one(modelTable, {
    fields: [fieldTable.modelId],
    references: [modelTable.id],
  }),
}));
