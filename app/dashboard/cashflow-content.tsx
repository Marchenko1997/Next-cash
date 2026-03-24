"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import numeral from "numeral";
import { Bar, BarChart, CartesianGrid, Legend, XAxis, YAxis } from "recharts";

const config = {
  income: {
    label: "Income",
    color: "#84cc16",
  },
  expense: {
    label: "Expense",
    color: "#ef4444",
  },
};

const CashflowContent = ({
  annualCashflow,
}: {
  annualCashflow: { month: number; income: number; expense: number }[];
}) => {
  const today = new Date();
  const totalAnnualIncome = annualCashflow.reduce(
    (acc, curr) => acc + curr.income,
    0,
  );
  const totalAnnualExpense = annualCashflow.reduce(
    (acc, curr) => acc + curr.expense,
    0,
  );
  const totalAnnualBalance = totalAnnualIncome - totalAnnualExpense;
  return (
    <>
      <ChartContainer className="w-full h-[300px]" config={config}>
        <BarChart data={annualCashflow}>
          <CartesianGrid vertical={false} />
          <YAxis
            tickFormatter={(value) => {
              return `€${numeral(value).format("0,0")}`;
            }}
          />
          <XAxis
            tickFormatter={(value) => {
              return format(new Date(today.getFullYear(), value, 1), "MMM");
            }}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                labelFormatter={(value, payload) => {
                  const month = payload?.[0]?.payload?.month;
                  return (
                    <div>
                      {format(
                        new Date(today.getFullYear(), month - 1, 1),
                        "MMMM",
                      )}
                    </div>
                  );
                }}
              />
            }
          />
          <Legend
            verticalAlign="top"
            align="right"
            height={30}
            iconType="circle"
            formatter={(value) => {
              return <span className="capitalize text-primary">{value}</span>;
            }}
          />
          <Bar dataKey="income" radius={4} fill={config.income.color} />
          <Bar dataKey="expense" radius={4} fill={config.expense.color} />
        </BarChart>
      </ChartContainer>
      <div className="border-l px-4 flex flex-col gap-4 justify-center">
        <div>
          <span className="text-muted-foreground font-bold text-sm">
            Income
          </span>
          <h2 className="text-3xl">
            €{numeral(totalAnnualIncome).format("0,0[.]00")}
          </h2>
        </div>
        <div className="border-t" />
        <div>
          <span className="text-muted-foreground font-bold text-sm">
            Expense
          </span>
          <h2 className="text-3xl">
            €{numeral(totalAnnualExpense).format("0,0[.]00")}
          </h2>
        </div>
        <div className="border-t" />
        <div>
          <span className="text-muted-foreground font-bold text-sm">
            Balance
          </span>
          <h2
            className={cn(
              "text-3xl font-bold",
              totalAnnualBalance >= 0 ? "text-lime-500" : "text-orange-500",
            )}
          >
            €{numeral(totalAnnualBalance).format("0,0[.]00")}
          </h2>
        </div>
      </div>
    </>
  );
};

export default CashflowContent;
