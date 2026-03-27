import Cashflow from "./cashflow";
import RecentTransactions from "./recent-transactions";

const DashboardPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ cfyear?: string }>;
}) => {
  const searchParamsValues = await searchParams;
  let cfYear = Number(searchParamsValues.cfyear ?? new Date().getFullYear());
  if (isNaN(cfYear)) {
    cfYear = new Date().getFullYear();
  }
  return (
    <div className="max-w-screen-xl mx-auto py-5 px-2">
      <h1 className="text-4xl font-semibold pb-5">Dashboard</h1>
      <Cashflow year={cfYear} />
      <RecentTransactions />
    </div>
  );
};

export default DashboardPage;
