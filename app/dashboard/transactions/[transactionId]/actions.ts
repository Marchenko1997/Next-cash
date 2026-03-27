"use server";

import { auth } from "@clerk/nextjs/server";
import { transactionSchema } from "@/validation/transactionSchema";
import z from "zod";
import db from "@/db";
import { transactionsTable } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { logServerError } from "@/lib/server-error";

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
  if (!userId) {
    return {
      error: true,
      message: "Unauthorized",
    };
  }

  const validation = updateTransactionSchema.safeParse(data);
  if (!validation.success) {
    return {
      error: true,
      message: validation.error.issues[0].message,
    };
  }

  try {
    const [transaction] = await db
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
      )
      .returning({ id: transactionsTable.id });

    if (!transaction) {
      return {
        error: true,
        message: "Transaction not found",
      };
    }

    return {
      error: false,
      id: transaction.id,
    };
  } catch (error) {
    logServerError("updateTransaction", error, {
      transactionId: data.id,
      userId,
    });

    return {
      error: true,
      message: "Failed to update transaction",
    };
  }
};

export const deleteTransaction = async (transactionId: number) => {
  const { userId } = await auth();
  if (!userId) {
    return {
      error: true,
      message: "Unauthorized",
    };
  }

  try {
    const [transaction] = await db
      .delete(transactionsTable)
      .where(
        and(
          eq(transactionsTable.id, transactionId),
          eq(transactionsTable.userId, userId),
        ),
      )
      .returning({ id: transactionsTable.id });

    if (!transaction) {
      return {
        error: true,
        message: "Transaction not found",
      };
    }

    return {
      error: false,
      id: transaction.id,
    };
  } catch (error) {
    logServerError("deleteTransaction", error, {
      transactionId,
      userId,
    });

    return {
      error: true,
      message: "Failed to delete transaction",
    };
  }
};
