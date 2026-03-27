import db from "@/db";
import { transactionsTable } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { logServerError } from "@/lib/server-error";
import "server-only";

export const getTransaction = async (transactionId: number) => {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  try {
    const [transaction] = await db
      .select()
      .from(transactionsTable)
      .where(
        and(
          eq(transactionsTable.id, transactionId),
          eq(transactionsTable.userId, userId),
        ),
      );

    return transaction;
  } catch (error) {
    logServerError("getTransaction", error, {
      transactionId,
      userId,
    });

    return null;
  }
};
