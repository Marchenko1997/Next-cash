import { addDays, subYears } from "date-fns";
import { z } from "zod";
import { isDateOnlyString, parseDateOnly } from "@/lib/date-only";

const earliestAllowedDate = subYears(new Date(), 100);
const latestAllowedDate = addDays(new Date(), 1);

export const transactionDateSchema = z
  .string()
  .refine(isDateOnlyString, "Transaction date must use yyyy-MM-dd format")
  .refine(
    (value) => parseDateOnly(value) >= earliestAllowedDate,
    "Transaction date must be within the last 100 years",
  )
  .refine(
    (value) => parseDateOnly(value) <= latestAllowedDate,
    "Transaction date cannot be in the future",
  );
