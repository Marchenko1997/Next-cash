"use server";

import db from "@/db";
import { transactionsTable } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { transactionSchema } from "@/validation/transactionSchema";

export const createTransaction = async (data: {
  amount: number;
  description: string;
  transactionDate: Date;
  categoryId: number;
}) => {
  const { userId } = await auth();
  if (!userId) {
    return {
      error: true,
      message: "Unauthorized",
    };
  }

  const validation = transactionSchema.safeParse(data);
  if (!validation.success) {
    return {
      error: true,
      message: validation.error.issues[0].message,
    };
  }

  const [transaction] = await db
    .insert(transactionsTable)
    .values({
      userId,
      amount: String(data.amount),
      description: data.description,
      transactionDate: data.transactionDate.toISOString(),
      categoryId: data.categoryId,
    })
    .returning();

  return {
    id: transaction.id,
  };
};
