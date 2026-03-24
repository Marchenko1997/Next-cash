"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";

const CashflowFilters = ({
  year,
  yearsRange,
}: {
  year: number;
  yearsRange: number[];
}) => {
  const router = useRouter();
  return (
    <div>
      <Select
        defaultValue={String(year)}
        onValueChange={(value) => {
          router.push(`/dashboard?cfyear=${value}`);
        }}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {yearsRange.map((year) => (
            <SelectItem key={year} value={`${year}`}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CashflowFilters;
