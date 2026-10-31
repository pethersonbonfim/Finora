"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCurrency } from "@/lib/format";
import type { SimulationPoint } from "@/lib/finance";
import { ChartTooltip } from "./cashflow-chart";

export function InvestmentChart({
  data,
  currency,
}: {
  data: SimulationPoint[];
  currency: string;
}) {
  const chartData = data.map((point) => ({
    ...point,
    label: point.month === 0 ? "Hoje" : `${Math.round(point.month / 12)}a`,
  }));

  return (
    <div className="h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 12, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="investedFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#60A5FA" stopOpacity={0.22} />
              <stop offset="100%" stopColor="#60A5FA" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="totalFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#34D399" stopOpacity={0.38} />
              <stop offset="100%" stopColor="#34D399" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(255,255,255,0.055)" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fill: "#8d949e", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            dy={10}
            interval="preserveStartEnd"
            minTickGap={40}
          />
          <YAxis
            tickFormatter={(value: number) => formatCurrency(value, currency, { compact: true })}
            tick={{ fill: "#7c8490", fontSize: 10.5 }}
            axisLine={false}
            tickLine={false}
            width={66}
          />
          <Tooltip
            content={<ChartTooltip currency={currency} />}
            cursor={{ stroke: "rgba(255,255,255,0.14)", strokeDasharray: "4 4" }}
          />
          <Area
            type="monotone"
            dataKey="invested"
            name="Total investido"
            stroke="#60A5FA"
            strokeWidth={1.8}
            fill="url(#investedFill)"
            activeDot={{ r: 3.5, strokeWidth: 0 }}
          />
          <Area
            type="monotone"
            dataKey="total"
            name="Com juros"
            stroke="#34D399"
            strokeWidth={2.2}
            fill="url(#totalFill)"
            activeDot={{ r: 4, strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
