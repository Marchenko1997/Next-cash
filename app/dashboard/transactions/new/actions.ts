"use server";

import db from "@/db";
import { transactionsTable } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { addDays, subYears } from "date-fns";
import z from "zod";

const transactionSchema = z.object({
  categoryId: z.coerce.number().positive("Please, select a category"),
  transactionDate: z.coerce
    .date()
    .min(subYears(new Date(), 100))
    .max(addDays(new Date(), 1)),
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  description: z
    .string()
    .min(3, "Description must be at least 3 characters")
    .max(300, "Description must be less than 300 characters"),
});

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
