import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { getCategories } from "@/data/getCategories";
import EditTransactionForm from "./edit-transaction-form";
import { getTransaction } from "@/data/getTransaction";
import { notFound } from "next/navigation";

const EditTransactionPage = async ({
  params,
}: {
  params: Promise<{ transactionId: string }>;
}) => {
  const paramsValues = await params;
  const transactionId = Number(paramsValues.transactionId);

  if (isNaN(transactionId)) {
    notFound();
  }

  const categories = await getCategories();
  const transaction = await getTransaction(transactionId);

  console.log("PAGE - Transaction ID:", transactionId);
  console.log("PAGE - Transaction data:", transaction);
  console.log("PAGE - Categories:", categories);

  if (!transaction) {
    notFound();
  }

  return (
    <div className="max-w-screen-xl mx-auto py-10">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={"/dashboard"}>Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={"/dashboard/transactions"}>Transactions</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Edit Transaction</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Card className="mt-4 max-w-screen-md">
        <CardHeader>
          <CardTitle>Edit Transaction</CardTitle>
        </CardHeader>
        <CardContent>
          <EditTransactionForm
            categories={categories}
            transaction={transaction}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default EditTransactionPage;
