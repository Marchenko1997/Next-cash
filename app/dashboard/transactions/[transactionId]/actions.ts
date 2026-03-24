"use server";

import { auth } from "@clerk/nextjs/server";
import { transactionSchema } from "@/validation/transactionSchema";
import z from "zod";
import db from "@/db";
import { transactionsTable } from "@/db/schema";
import { and, eq } from "drizzle-orm";

const updateTransactionSchema = transactionSchema.and(
  z.object({
    id: z.number().positive("Invalid transaction ID"),
  }),
);

type Props = {
  id: number;
  transactionDate: string;
  description: string;
  amount: number;
  categoryId: number;
};

export const updateTransaction = async (data: Props) => {
  const { userId } = await auth();
  if (!userId)
    return {
      error: true,
      message: "Unauthorized",
    };

  const validation = updateTransactionSchema.safeParse(data);
  if (!validation.success)
    return {
      error: true,
      message: validation.error.issues[0].message,
    };

  await db
    .update(transactionsTable)
    .set({
      description: data.description,
      amount: String(data.amount),
      transactionDate: data.transactionDate,
      categoryId: data.categoryId,
    })
    .where(
      and(
        eq(transactionsTable.id, data.id),
        eq(transactionsTable.userId, userId),
      ),
    );
};

export const deleteTransaction = async (transactionId: number) => {
  const { userId } = await auth();
  if (!userId)
    return {
      error: true,
      message: "Unauthorized",
    };

  await db
    .delete(transactionsTable)
    .where(
      and(
        eq(transactionsTable.id, transactionId),
        eq(transactionsTable.userId, userId),
      ),
    );
};
