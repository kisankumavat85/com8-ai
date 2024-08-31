"use server";

import { createAccount } from "@/db/queries/account";
import { createUser, getUserByEmail } from "@/db/queries/user";

type CreateUserAccountParams = {
  email: string;
  provider: string;
  providerId: string;
  image: string;
  name: string;
};

export const createUserAccount = async (data: CreateUserAccountParams) => {
  const { email, name, image, provider, providerId } = data;

  let existingUser = await getUserByEmail(email);

  if (!existingUser) {
    const emailVerified = new Date();
    existingUser = await createUser({ email, emailVerified, image, name });
  }

  await createAccount({ userId: existingUser.id, provider, providerId });

  return existingUser;
};
