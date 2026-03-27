import { z } from "zod";
import { transactionDateSchema } from "@/validation/transactionDateSchema";

export const transactionFormSchema = z.object({
  transactionType: z.enum(["income", "expense"]),
  categoryId: z.coerce.number().positive("Please, select a category"),
  transactionDate: transactionDateSchema,
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  description: z
    .string()
    .min(3, "Description must be at least 3 characters")
    .max(300, "Description must be less than 300 characters"),
});
