import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCategories } from "@/data/getCategories";
import NewTransactionForm from "./new-transaction-form";

const NewTransactionPage = async () => {
  const categories = await getCategories();
  return (
    <Card className="mt-4 max-w-screen-md">
      <CardHeader>
        <CardTitle>New Transaction</CardTitle>
      </CardHeader>
      <CardContent>
        <NewTransactionForm categories={categories} />
      </CardContent>
    </Card>
  );
};

export default NewTransactionPage;
