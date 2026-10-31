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
import type { SeriesPoint } from "@/lib/finance";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ChartTooltip({ active, payload, label, currency = "BRL" }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-white/[0.09] bg-[#0b0e12]/95 px-3.5 py-3 shadow-2xl backdrop-blur-md">
      {label !== undefined && (
        <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.14em] text-dim">
          {label}
        </p>
      )}
      <div className="space-y-1.5">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {payload.map((entry: any) => (
          <div key={entry.dataKey ?? entry.name} className="flex items-center gap-2.5">
            <span
              className="size-1.5 rounded-full"
              style={{ backgroundColor: entry.color ?? entry.payload?.fill ?? "#34D399" }}
            />
            <span className="text-[11.5px] text-muted">{entry.name}</span>
            <span className="ml-auto pl-4 font-mono text-[11.5px] font-medium text-text">
              {formatCurrency(Number(entry.value ?? 0), currency)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CashflowChart({
  data,
  currency,
}: {
  data: SeriesPoint[];
  currency: string;
}) {
  return (
    <div className="h-[248px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 6, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="incomeFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#34D399" stopOpacity={0.32} />
              <stop offset="100%" stopColor="#34D399" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="expenseFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FB7185" stopOpacity={0.24} />
              <stop offset="100%" stopColor="#FB7185" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(255,255,255,0.055)" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fill: "#8d949e", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            dy={10}
          />
          <YAxis
            tickFormatter={(value: number) => formatCurrency(value, currency, { compact: true })}
            tick={{ fill: "#7c8490", fontSize: 10.5 }}
            axisLine={false}
            tickLine={false}
            width={62}
          />
          <Tooltip
            content={<ChartTooltip currency={currency} />}
            cursor={{ stroke: "rgba(255,255,255,0.14)", strokeDasharray: "4 4" }}
          />
          <Area
            type="monotone"
            dataKey="income"
            name="Receitas"
            stroke="#34D399"
            strokeWidth={2}
            fill="url(#incomeFill)"
            activeDot={{ r: 4, strokeWidth: 0, fill: "#34D399" }}
          />
          <Area
            type="monotone"
            dataKey="expense"
            name="Despesas"
            stroke="#FB7185"
            strokeWidth={2}
            fill="url(#expenseFill)"
            activeDot={{ r: 4, strokeWidth: 0, fill: "#FB7185" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function Sparkline({
  data,
  color = "#34D399",
  id,
}: {
  data: { value: number }[];
  color?: string;
  id: string;
}) {
  return (
    <div className="h-9 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={`spark-${id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.35} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={1.6}
            fill={`url(#spark-${id})`}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
