import { eq } from "drizzle-orm";

import { db } from "@/db";
import { InsertUser, userTable } from "../schema/user";

export const getUserByEmail = async (email: string) => {
  const [user] = await db
    .select()
    .from(userTable)
    .where(eq(userTable.email, email));
  return user;
};

export const createUser = async (values: InsertUser) => {
  const [user] = await db.insert(userTable).values(values).returning();
  return user;
};
