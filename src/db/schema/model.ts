import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { modelProviderTable } from "./model-provider";
import { relations } from "drizzle-orm";

export const modelTable = pgTable("model", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name"),
  description: text("description"),
  providerId: uuid("provider").references(() => modelProviderTable.id, {
    onDelete: "cascade",
  }),

  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const modelRelations = relations(modelTable, ({ one }) => ({
  modelProviderTable: one(modelProviderTable, {
    fields: [modelTable.providerId],
    references: [modelProviderTable.id],
  }),
}));
