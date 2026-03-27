import db from "@/db";
import { categoriesTable, transactionsTable } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq, gte, lte, desc } from "drizzle-orm";
import { getMonthBounds } from "@/lib/date-only";
import { logServerError } from "@/lib/server-error";
import "server-only";

export const getTransactionsByMonth = async ({
  month,
  year,
}: {
  month: number;
  year: number;
}) => {
  const { userId } = await auth();
  if (!userId) return [];

  const { end, start } = getMonthBounds(year, month);

  try {
    const transactions = await db
      .select({
        id: transactionsTable.id,
        description: transactionsTable.description,
        amount: transactionsTable.amount,
        transactionDate: transactionsTable.transactionDate,
        category: categoriesTable.name,
        transactionType: categoriesTable.type,
      })
      .from(transactionsTable)
      .where(
        and(
          eq(transactionsTable.userId, userId),
          gte(transactionsTable.transactionDate, start),
          lte(transactionsTable.transactionDate, end),
        ),
      )
      .orderBy(desc(transactionsTable.transactionDate))
      .leftJoin(
        categoriesTable,
        eq(transactionsTable.categoryId, categoriesTable.id),
      );

    return transactions;
  } catch (error) {
    logServerError("getTransactionsByMonth", error, {
      month,
      userId,
      year,
    });

    return [];
  }
};
