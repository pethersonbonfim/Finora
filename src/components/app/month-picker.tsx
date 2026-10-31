"use client";

import { CalendarDays } from "lucide-react";
import { lastMonthKeys, monthLabel } from "@/lib/format";

export function MonthPicker({
  value,
  onChange,
  months = 8,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  months?: number;
  className?: string;
}) {
  const options = lastMonthKeys(months).reverse();

  return (
    <div className={`relative ${className ?? ""}`}>
      <CalendarDays className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-dim" />
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label="Selecionar mês"
        className="field h-9 w-full appearance-none py-0 pl-8.5 pr-8 text-[12px] font-medium sm:w-[148px]"
      >
        {options.map((key) => (
          <option key={key} value={key}>
            {monthLabel(key)}
          </option>
        ))}
      </select>
    </div>
  );
}
