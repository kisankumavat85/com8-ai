import { relations } from "drizzle-orm";
import { pgTable, text, uuid } from "drizzle-orm/pg-core";

import { userTable } from "./user";
import { modelTable } from "./model";
import { fieldTable } from "./field";

// To store value of dynamic value from dynamic model config form
export const userModelConfigTable = pgTable("user_model_config", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  modelId: text("model_id")
    .notNull()
    .references(() => modelTable.id, { onDelete: "cascade" }),
  fieldId: text("field_id")
    .notNull()
    .references(() => fieldTable.id, { onDelete: "cascade" }),
  value: text("value").notNull(),
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
