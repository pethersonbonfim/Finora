export const CURRENCIES = [
  { code: "BRL", label: "Real brasileiro (R$)", symbol: "R$" },
  { code: "USD", label: "Dólar americano (US$)", symbol: "US$" },
  { code: "EUR", label: "Euro (€)", symbol: "€" },
] as const;

const MONTHS_SHORT = [
  "jan",
  "fev",
  "mar",
  "abr",
  "mai",
  "jun",
  "jul",
  "ago",
  "set",
  "out",
  "nov",
  "dez",
];

const MONTHS_LONG = [
  "janeiro",
  "fevereiro",
  "março",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
];

export function toDate(value: string | Date) {
  if (value instanceof Date) return value;
  const [y, m, d] = value.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

export function monthKey(value: string | Date = new Date()) {
  const date = typeof value === "string" ? toDate(value) : value;
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export function monthLabel(key: string, style: "short" | "long" = "short") {
  const [y, m] = key.split("-").map(Number);
  const name = style === "long" ? MONTHS_LONG[(m ?? 1) - 1] : MONTHS_SHORT[(m ?? 1) - 1];
  const label = `${name} ${y}`;
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export function shiftMonth(key: string, delta: number) {
  const [y, m] = key.split("-").map(Number);
  const date = new Date(y, m - 1 + delta, 1);
  return monthKey(date);
}

export function lastMonthKeys(count: number, from = new Date()) {
  const keys: string[] = [];
  for (let i = count - 1; i >= 0; i--) {
    keys.push(shiftMonth(monthKey(from), -i));
  }
  return keys;
}

export function currencySymbol(currency = "BRL") {
  return CURRENCIES.find((item) => item.code === currency)?.symbol ?? "R$";
}

export function formatCurrency(
  value: number,
  currency = "BRL",
  options: { compact?: boolean; signed?: boolean } = {}
) {
  const formatted = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency,
    maximumFractionDigits: options.compact ? 0 : 2,
    minimumFractionDigits: options.compact ? 0 : 2,
    notation: options.compact ? "compact" : "standard",
  }).format(Math.abs(value));

  if (options.signed) {
    return `${value < 0 ? "−" : "+"} ${formatted}`;
  }
  return value < 0 ? `− ${formatted}` : formatted;
}

export function formatNumber(value: number, digits = 1) {
  return new Intl.NumberFormat("pt-BR", {
    maximumFractionDigits: digits,
  }).format(value);
}

export function formatPercent(value: number, digits = 0) {
  return `${new Intl.NumberFormat("pt-BR", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(value)}%`;
}

export function formatDate(value: string, style: "short" | "long" = "short") {
  const date = toDate(value);
  if (style === "long") {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(date);
  }
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
  }).format(date);
}

export function daysUntil(value: string) {
  const target = toDate(value).getTime();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.ceil((target - today.getTime()) / 86_400_000);
}

export function monthsUntil(value: string) {
  const target = toDate(value);
  const today = new Date();
  return Math.max(
    0,
    (target.getFullYear() - today.getFullYear()) * 12 +
      (target.getMonth() - today.getMonth())
  );
}

function localISO(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")}`;
}

export function todayISO() {
  return localISO(new Date());
}

export function addMonthsISO(months: number) {
  const date = new Date();
  date.setMonth(date.getMonth() + months);
  return localISO(date);
}
