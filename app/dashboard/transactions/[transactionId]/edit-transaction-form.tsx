"use client";

import TransactionForm from "@/components/transaction-form";
import { transactionFormSchema } from "@/schemas/transactionFormSchema";
import type { Category } from "@/types/Category";
import { toast } from "sonner";
import z from "zod";
import { useRouter } from "next/navigation";


type Props = {
  categories: Category[];
  transaction: {
    id: number;
    categoryId: number;
    amount: string;
    description: string;
    transactionDate: string;
  };
};

const EditTransactionForm = ({ categories, transaction }: Props) => {
  const router = useRouter();

  const handleSubmit = async (data: z.input<typeof transactionFormSchema>) => {
    const result = {};

    toast.success("Transaction updated successfully");
    router.push(
      `/dashboard/transactions?month=${new Date(data.transactionDate as string).getMonth() + 1}&year=${new Date(data.transactionDate as string).getFullYear()}`,
    );
  };

  const defaultValues = {
    amount: Number(transaction.amount),
    categoryId: transaction.categoryId,
    description: transaction.description,
    transactionDate: new Date(transaction.transactionDate),
    transactionType:
      categories.find((category) => category.id === transaction.categoryId)
        ?.type || "income",
  };

  return (
    <div>
      <TransactionForm
        defaultValues={defaultValues}
        categories={categories}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default EditTransactionForm;
