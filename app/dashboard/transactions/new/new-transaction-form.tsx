"use client";

import TransactionForm from "@/components/transaction-form";
import { transactionFormSchema } from "@/schemas/transactionFormSchema";
import type { Category } from "@/types/Category";
import { toast } from "sonner";
import z from "zod";
import { createTransaction } from "./actions";
import { useRouter } from "next/navigation";
import { getDateParts } from "@/lib/date-only";

type Props = {
  categories: Category[];
};

const NewTransactionForm = ({ categories }: Props) => {
  const router = useRouter();

  const handleSubmit = async (data: z.input<typeof transactionFormSchema>) => {
    const result = await createTransaction({
      amount: Number(data.amount),
      transactionDate: data.transactionDate,
      description: data.description,
      categoryId: Number(data.categoryId),
    });

    if (result.error) {
      toast.error(result.message);
      return;
    }

    const { month, year } = getDateParts(data.transactionDate);
    toast.success("Transaction created successfully");
    router.push(`/dashboard/transactions?month=${month}&year=${year}`);
  };
  return <TransactionForm categories={categories} onSubmit={handleSubmit} />;
};

export default NewTransactionForm;
