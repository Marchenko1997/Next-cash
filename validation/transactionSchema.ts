import { addDays, subYears } from "date-fns";
import z from "zod";

export const transactionSchema = z.object({
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
