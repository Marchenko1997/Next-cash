"use server";

import db from "@/db";
import { transactionsTable } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { transactionSchema } from "@/validation/transactionSchema";
import { logServerError } from "@/lib/server-error";

export const createTransaction = async (data: {
  amount: number;
  description: string;
  transactionDate: string;
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

  try {
    const [transaction] = await db
      .insert(transactionsTable)
      .values({
        userId,
        amount: String(data.amount),
        description: data.description,
        transactionDate: data.transactionDate,
        categoryId: data.categoryId,
      })
      .returning({ id: transactionsTable.id });

    return {
      error: false,
      id: transaction.id,
    };
  } catch (error) {
    logServerError("createTransaction", error, {
      categoryId: data.categoryId,
      userId,
    });

    return {
      error: true,
      message: "Failed to create transaction",
    };
  }
};
