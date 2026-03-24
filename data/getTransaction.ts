import db from "@/db";
import { transactionsTable } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import "server-only";

export const getTransaction = async (transactionId: number) => {
  const { userId } = await auth();
  console.log("getTransaction - userId:", userId);
  console.log("getTransaction - transactionId:", transactionId);

  if (!userId) {
    console.log("getTransaction - No userId, returning null");
    return null;
  }

  const [transaction] = await db
    .select()
    .from(transactionsTable)
    .where(
      and(
        eq(transactionsTable.id, transactionId),
        eq(transactionsTable.userId, userId),
      ),
    );

  console.log("getTransaction - Found transaction:", transaction);
  return transaction;
};
