import { getCategoryIcon } from "@/lib/icons";
import type { Category } from "@/lib/types";

export function CategoryBadge({
  category,
  size = "md",
}: {
  category?: Category;
  size?: "sm" | "md";
}) {
  const Icon = getCategoryIcon(category?.icon ?? "wallet");
  const color = category?.color ?? "#5c636d";

  return (
    <span className="inline-flex items-center gap-2">
      <span
        className="grid place-items-center rounded-md"
        style={{
          width: size === "sm" ? 22 : 28,
          height: size === "sm" ? 22 : 28,
          backgroundColor: `${color}14`,
          color,
        }}
      >
        <Icon className={size === "sm" ? "size-3" : "size-3.5"} strokeWidth={1.9} />
      </span>
      <span className="text-[12px] text-muted">{category?.name ?? "Sem categoria"}</span>
    </span>
  );
}
