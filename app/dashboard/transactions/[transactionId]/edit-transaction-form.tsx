"use client";

import TransactionForm from "@/components/transaction-form";
import { transactionFormSchema } from "@/schemas/transactionFormSchema";
import type { Category } from "@/types/Category";
import { toast } from "sonner";
import z from "zod";
import { useRouter } from "next/navigation";
import { updateTransaction } from "./actions";
import { format } from "date-fns";


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
 const router: ReturnType<typeof useRouter> = useRouter();

  const handleSubmit = async (data: z.input<typeof transactionFormSchema>) => {
     const result = await updateTransaction({
       id: transaction.id,
       amount: Number(data.amount),
       description: data.description,
       transactionDate: format(
         new Date(data.transactionDate as string),
         "yyyy-MM-dd",
       ),
       categoryId: Number(data.categoryId),
     });

     if (result?.error) {
       toast.error(result?.message);
       return;
     }

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
