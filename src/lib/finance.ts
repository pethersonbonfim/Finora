import {
  formatCurrency,
  formatPercent,
  lastMonthKeys,
  monthKey,
  monthLabel,
  monthsUntil,
  shiftMonth,
} from "./format";
import type {
  Category,
  Goal,
  Insight,
  Profile,
  Transaction,
} from "./types";

export interface MonthSummary {
  income: number;
  expense: number;
  balance: number;
  savingsRate: number;
  count: number;
}

export function summarize(transactions: Transaction[], month: string): MonthSummary {
  let income = 0;
  let expense = 0;
  let count = 0;

  for (const tx of transactions) {
    if (monthKey(tx.date) !== month) continue;
    count += 1;
    if (tx.type === "income") income += tx.amount;
    else expense += tx.amount;
  }

  const balance = income - expense;
  return {
    income,
    expense,
    balance,
    count,
    savingsRate: income > 0 ? (balance / income) * 100 : 0,
  };
}

export function monthTransactions(transactions: Transaction[], month: string) {
  return transactions.filter((tx) => monthKey(tx.date) === month);
}

export interface CategoryTotal {
  category: Category;
  total: number;
  percent: number;
  count: number;
}

export function categoryBreakdown(
  transactions: Transaction[],
  categories: Category[],
  month: string
): CategoryTotal[] {
  const expenses = monthTransactions(transactions, month).filter(
    (tx) => tx.type === "expense"
  );
  const totalExpense = expenses.reduce((sum, tx) => sum + tx.amount, 0);
  const totals = new Map<string, { total: number; count: number }>();

  for (const tx of expenses) {
    const current = totals.get(tx.categoryId) ?? { total: 0, count: 0 };
    totals.set(tx.categoryId, {
      total: current.total + tx.amount,
      count: current.count + 1,
    });
  }

  return categories
    .filter((category) => totals.has(category.id))
    .map((category) => {
      const entry = totals.get(category.id)!;
      return {
        category,
        total: entry.total,
        count: entry.count,
        percent: totalExpense > 0 ? (entry.total / totalExpense) * 100 : 0,
      };
    })
    .sort((a, b) => b.total - a.total);
}

export interface SeriesPoint {
  key: string;
  label: string;
  income: number;
  expense: number;
  balance: number;
}

export function monthlySeries(
  transactions: Transaction[],
  months = 6,
  from = new Date()
): SeriesPoint[] {
  const keys = lastMonthKeys(months, from);
  return keys.map((key) => {
    const summary = summarize(transactions, key);
    const label = monthLabel(key).split(" ")[0].slice(0, 3);
    return {
      key,
      label,
      income: Math.round(summary.income),
      expense: Math.round(summary.expense),
      balance: Math.round(summary.balance),
    };
  });
}

export interface BudgetRow {
  category: Category;
  spent: number;
  budget: number;
  percent: number;
  remaining: number;
  status: "ok" | "attention" | "over";
}

export function budgetRows(
  categories: Category[],
  transactions: Transaction[],
  month: string
): BudgetRow[] {
  return categories
    .filter((category) => category.kind === "expense")
    .map((category) => {
      const spent = monthTransactions(transactions, month)
        .filter((tx) => tx.type === "expense" && tx.categoryId === category.id)
        .reduce((sum, tx) => sum + tx.amount, 0);
      const percent = category.budget > 0 ? (spent / category.budget) * 100 : 0;
      const status: BudgetRow["status"] =
        percent > 100 ? "over" : percent >= 80 ? "attention" : "ok";
      return {
        category,
        spent,
        budget: category.budget,
        percent,
        remaining: category.budget - spent,
        status,
      };
    })
    .sort((a, b) => b.percent - a.percent);
}

export interface SimulationPoint {
  month: number;
  invested: number;
  total: number;
  interest: number;
}

export interface SimulationResult {
  points: SimulationPoint[];
  final: number;
  invested: number;
  interest: number;
  monthlyRate: number;
}

export function simulateInvestment(
  initial: number,
  monthly: number,
  annualRate: number,
  months: number
): SimulationResult {
  const safeMonths = Math.max(1, Math.round(months));
  const monthlyRate = Math.pow(1 + Math.max(0, annualRate) / 100, 1 / 12) - 1;

  let total = Math.max(0, initial);
  const points: SimulationPoint[] = [
    { month: 0, invested: total, total, interest: 0 },
  ];

  for (let m = 1; m <= safeMonths; m++) {
    total = total * (1 + monthlyRate) + Math.max(0, monthly);
    const invested = Math.max(0, initial) + Math.max(0, monthly) * m;
    points.push({
      month: m,
      invested: Math.round(invested),
      total: Math.round(total),
      interest: Math.round(total - invested),
    });
  }

  return {
    points,
    final: Math.round(total),
    invested: Math.round(Math.max(0, initial) + Math.max(0, monthly) * safeMonths),
    interest: Math.round(total - (Math.max(0, initial) + Math.max(0, monthly) * safeMonths)),
    monthlyRate,
  };
}

export function buildInsights(
  profile: Profile,
  categories: Category[],
  transactions: Transaction[],
  goals: Goal[],
  month: string
): Insight[] {
  const insights: Insight[] = [];
  const currency = profile.currency;
  const summary = summarize(transactions, month);
  const breakdown = categoryBreakdown(transactions, categories, month);
  const budgets = budgetRows(categories, transactions, month);

  if (summary.income > 0) {
    if (summary.savingsRate >= 20) {
      insights.push({
        id: "savings-good",
        tone: "positive",
        title: `Você guardou ${formatPercent(summary.savingsRate)} da sua renda`,
        text: `Isso é ${formatCurrency(summary.balance, currency)} livres neste mês. Acima de 20% já é um excelente ritmo — continue aportando.`,
      });
    } else if (summary.savingsRate >= 5) {
      insights.push({
        id: "savings-ok",
        tone: "neutral",
        title: `Sobraram ${formatCurrency(summary.balance, currency)} este mês`,
        text: `Sua taxa de poupança é de ${formatPercent(summary.savingsRate)}. Mirar em 20% liberaria mais ${formatCurrency(
          Math.max(0, summary.income * 0.2 - summary.balance),
          currency
        )} por mês.`,
      });
    } else if (summary.balance < 0) {
      insights.push({
        id: "savings-negative",
        tone: "danger",
        title: "Você gastou mais do que recebeu",
        text: `O mês fechou ${formatCurrency(Math.abs(summary.balance), currency)} no vermelho. O primeiro passo é revisar as categorias com maior gasto.`,
      });
    } else {
      insights.push({
        id: "savings-low",
        tone: "warning",
        title: "Sua taxa de poupança está baixa",
        text: `Apenas ${formatPercent(summary.savingsRate)} da renda ficou com você. Comece transferindo um valor fixo no dia do salário.`,
      });
    }
  }

  const top = breakdown[0];
  if (top && top.percent >= 28) {
    insights.push({
      id: "top-category",
      tone: "neutral",
      title: `${top.category.name} concentra ${formatPercent(top.percent)} dos gastos`,
      text: `Foram ${formatCurrency(top.total, currency)} em ${top.count} transações. Reduzir 15% aqui liberaria ${formatCurrency(
        top.total * 0.15,
        currency
      )} por mês.`,
    });
  }

  const over = budgets.filter((row) => row.status === "over" && row.budget > 0);
  if (over.length > 0) {
    insights.push({
      id: "budget-over",
      tone: "warning",
      title: `${over.length} ${over.length === 1 ? "orçamento estourou" : "orçamentos estouraram"}`,
      text: `${over
        .slice(0, 3)
        .map((row) => row.category.name)
        .join(", ")} passaram do limite. Ajuste o teto ou reduza os gastos nessa reta final.`,
    });
  }

  const nextGoal = goals
    .filter((goal) => goal.saved < goal.target)
    .sort(
      (a, b) =>
        (a.saved / Math.max(1, a.target)) - (b.saved / Math.max(1, b.target))
    )[0];

  if (nextGoal) {
    const remaining = Math.max(0, nextGoal.target - nextGoal.saved);
    const months = Math.max(1, monthsUntil(nextGoal.deadline));
    insights.push({
      id: "goal",
      tone: "positive",
      title: `Faltam ${formatCurrency(remaining, currency)} para "${nextGoal.name}"`,
      text: `Guardando ${formatCurrency(remaining / months, currency)} por mês você chega lá em ${months} ${months === 1 ? "mês" : "meses"}.`,
    });
  }

  const previous = summarize(transactions, shiftMonth(month, -1));
  if (previous.expense > 0 && summary.expense > 0) {
    const delta = ((summary.expense - previous.expense) / previous.expense) * 100;
    if (Math.abs(delta) >= 8) {
      insights.push({
        id: "compare",
        tone: delta > 0 ? "warning" : "positive",
        title:
          delta > 0
            ? `Gastos ${formatPercent(Math.abs(delta))} maiores que o mês passado`
            : `Gastos ${formatPercent(Math.abs(delta))} menores que o mês passado`,
        text:
          delta > 0
            ? `Você desembolsou ${formatCurrency(summary.expense - previous.expense, currency)} a mais. Vale olhar o que mudou.`
            : `Você economizou ${formatCurrency(previous.expense - summary.expense, currency)} em relação ao mês anterior. Ótimo sinal.`,
      });
    }
  }

  return insights.slice(0, 4);
}
