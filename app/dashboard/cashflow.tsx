import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { getAnnualCashflow } from "@/data/getAnnualCashflow";
import CashflowFilters from "./cashflow-filters";
import { getTransactionsYearsRange } from "@/data/getTransactionsYearsRange";

const Cashflow = async ({ year }: { year: number }) => {
  const [cashflow, yearsRange] = await Promise.all([
    getAnnualCashflow(year),
    getTransactionsYearsRange(),
  ]);
  return (
    <Card className="mb-5">
      <CardHeader>
        <CardTitle className="flex justify-between">
          <span>Cashflow</span>
          <CashflowFilters yearsRange={yearsRange} year={year} />
        </CardTitle>
      </CardHeader>
    </Card>
  );
};

export default Cashflow;
