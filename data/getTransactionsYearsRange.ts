import db from "@/db";
import { transactionsTable } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { asc, eq } from "drizzle-orm";
import { getDateParts } from "@/lib/date-only";
import { logServerError } from "@/lib/server-error";
import "server-only";

export const getTransactionsYearsRange = async () => {
  const { userId } = await auth();
  if (!userId) return [];

  try {
    const [earliestTransaction] = await db
      .select()
      .from(transactionsTable)
      .where(eq(transactionsTable.userId, userId))
      .orderBy(asc(transactionsTable.transactionDate))
      .limit(1);

    const currentYear = new Date().getFullYear();
    const earliestYear = earliestTransaction
      ? getDateParts(earliestTransaction.transactionDate).year
      : currentYear;

    return Array.from({ length: currentYear - earliestYear + 1 }).map(
      (_, index) => currentYear - index,
    );
  } catch (error) {
    logServerError("getTransactionsYearsRange", error, {
      userId,
    });

    return [];
  }
};
