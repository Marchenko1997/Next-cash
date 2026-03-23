"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import Link from "next/link";
import { useState } from "react";

type Props = {
  year: number;
  month: number;
  yearsRange: number[];
};

const Filters = ({ year, month, yearsRange }: Props) => {
  const [selectedMonth, setSelectedMonth] = useState(month);
  const [selectedYear, setSelectedYear] = useState(year);
  return (
    <div className="flex gap-1">
      <Select
        value={String(selectedMonth)}
        onValueChange={(newValue) => setSelectedMonth(Number(newValue))}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Array.from({ length: 12 }).map((_, i) => (
            <SelectItem value={`${i + 1}`} key={i}>
              {format(new Date(selectedYear, i, 1), "MMM")}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={String(selectedYear)}
        onValueChange={(newValue) => setSelectedYear(Number(newValue))}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {yearsRange.map((year) => (
            <SelectItem value={`${year}`} key={year}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button asChild>
        <Link
          href={`/dashboard/transactions?year=${selectedYear}&month=${selectedMonth}`}
        >
          Go
        </Link>
      </Button>
    </div>
  );
};

export default Filters;
