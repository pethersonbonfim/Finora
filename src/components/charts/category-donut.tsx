"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { formatCurrency } from "@/lib/format";
import { ChartTooltip } from "./cashflow-chart";

export interface DonutDatum {
  name: string;
  value: number;
  color: string;
  percent: number;
}

export function CategoryDonut({
  data,
  total,
  currency,
}: {
  data: DonutDatum[];
  total: number;
  currency: string;
}) {
  return (
    <div className="relative h-[208px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius="65%"
            outerRadius="94%"
            paddingAngle={2.5}
            cornerRadius={6}
            stroke="none"
            startAngle={90}
            endAngle={-270}
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<ChartTooltip currency={currency} />} />
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-dim">
          Total
        </span>
        <span className="mt-1 font-mono text-[19px] font-semibold tracking-tight text-text">
          {formatCurrency(total, currency, { compact: true })}
        </span>
        <span className="mt-0.5 text-[10.5px] text-muted">em despesas</span>
      </div>
    </div>
  );
}
