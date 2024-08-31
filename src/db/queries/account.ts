"use server";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { accountTable, InsertAccount } from "../schema/account";

export const getAccountByProviderId = async (id: string) => {
  const [account] = await db
    .select()
    .from(accountTable)
    .where(eq(accountTable.providerId, id));
  return account;
};

export const createAccount = async (values: InsertAccount) => {
  const [account] = await db.insert(accountTable).values(values).returning();
  return account;
};
