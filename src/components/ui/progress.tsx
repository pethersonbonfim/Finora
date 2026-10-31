import { cn } from "@/lib/utils";

export function Progress({
  value,
  color = "#34D399",
  className,
  trackClassName,
}: {
  value: number;
  color?: string;
  className?: string;
  trackClassName?: string;
}) {
  const width = Math.max(0, Math.min(100, value));
  return (
    <div
      className={cn("h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]", trackClassName)}
      role="progressbar"
      aria-valuenow={Math.round(width)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={cn("h-full rounded-full transition-[width] duration-700 ease-out", className)}
        style={{
          width: `${width}%`,
          backgroundColor: color,
          boxShadow: `0 0 12px -2px ${color}80`,
        }}
      />
    </div>
  );
}
