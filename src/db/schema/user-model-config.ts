import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { userTable } from "./user";
import { modelTable } from "./model";
import { fieldTable } from "./field";

// To store value of dynamic value from dynamic model config form
export const userModelConfigTable = pgTable("user_model_config", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  modelId: uuid("model_id")
    .notNull()
    .references(() => modelTable.id, { onDelete: "cascade" }),
  fieldId: uuid("field_id")
    .notNull()
    .references(() => fieldTable.id, { onDelete: "cascade" }),
  value: text("value").notNull(),

  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const userModelConfigRelations = relations(
  userModelConfigTable,
  ({ one }) => ({
    userTable: one(userTable, {
      fields: [userModelConfigTable.userId],
      references: [userTable.id],
    }),
    modelTable: one(modelTable, {
      fields: [userModelConfigTable.modelId],
      references: [modelTable.id],
    }),
    fieldTable: one(fieldTable, {
      fields: [userModelConfigTable.modelId],
      references: [fieldTable.id],
    }),
  })
);
