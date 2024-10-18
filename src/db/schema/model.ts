import { pgTable, text } from "drizzle-orm/pg-core";
import { modelProviderTable } from "./model-provider";
import { relations } from "drizzle-orm";

export const modelTable = pgTable("model", {
  id: text("id"),
  name: text("name"),
  description: text("description"),
  providerId: text("provider").references(() => modelProviderTable.id, {
    onDelete: "cascade",
  }),
});

export const modelRelations = relations(modelTable, ({ one }) => ({
  modelProviderTable: one(modelProviderTable, {
    fields: [modelTable.providerId],
    references: [modelProviderTable.id],
  }),
}));
