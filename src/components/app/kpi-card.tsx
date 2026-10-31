"use client";

import {
  ArrowDownRight,
  ArrowUpRight,
  Minus,
  type LucideIcon,
} from "lucide-react";
import { CountUp } from "@/components/ui/count-up";
import { formatPercent } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Sparkline } from "@/components/charts/cashflow-chart";

export function KpiCard({
  label,
  amount,
  format,
  hint,
  icon: Icon,
  color,
  delta,
  deltaLabel,
  invert = false,
  spark,
  sparkId,
  index = 0,
}: {
  label: string;
  amount: number;
  format: (value: number) => string;
  hint: string;
  icon: LucideIcon;
  color: string;
  delta?: number | null;
  deltaLabel?: string;
  invert?: boolean;
  spark?: { value: number }[];
  sparkId: string;
  index?: number;
}) {
  const positive = delta !== undefined && delta !== null ? delta >= 0 : true;
  const good = invert ? !positive : positive;
  const DeltaIcon =
    delta === undefined || delta === null || Math.abs(delta) < 0.5
      ? Minus
      : positive
        ? ArrowUpRight
        : ArrowDownRight;

  return (
    <div
      className={cn("card card-hover group overflow-hidden p-5 animate-fade-up", `delay-${Math.min(index + 1, 5)}`)}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span
            className="grid size-8 place-items-center rounded-[10px] border"
            style={{
              backgroundColor: `${color}12`,
              borderColor: `${color}22`,
              color,
            }}
          >
            <Icon className="size-[15px]" strokeWidth={1.9} />
          </span>
          <span className="text-[11.5px] font-medium text-muted">{label}</span>
        </div>
        {delta !== undefined && delta !== null && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 font-mono text-[10px] font-medium",
              good ? "bg-mint/10 text-mint" : "bg-coral/10 text-coral"
            )}
          >
            <DeltaIcon className="size-3" />
            {formatPercent(Math.abs(delta))}
          </span>
        )}
      </div>

      <p className="mt-4 font-mono text-[25px] font-semibold leading-none tracking-tight text-text">
        <CountUp value={amount} format={format} />
      </p>

      <div className="mt-2 flex items-end justify-between gap-3">
        <p className="text-[10.5px] leading-relaxed text-dim">
          {deltaLabel ?? hint}
        </p>
        {spark && spark.length > 1 && (
          <div className="w-[86px] shrink-0 opacity-80 transition group-hover:opacity-100">
            <Sparkline data={spark} color={color} id={sparkId} />
          </div>
        )}
      </div>
    </div>
  );
}
