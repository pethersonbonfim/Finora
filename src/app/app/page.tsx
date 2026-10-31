"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowDownLeft,
  ArrowRight,
  ArrowUpRight,
  ChevronRight,
  Info,
  PiggyBank,
  Plus,
  Sparkles,
  Target,
  TrendingUp,
  TriangleAlert,
  Wallet,
  CheckCircle2,
} from "lucide-react";
import { useApp } from "@/components/app-provider";
import { KpiCard } from "@/components/app/kpi-card";
import { MonthPicker } from "@/components/app/month-picker";
import { CategoryBadge } from "@/components/app/category-badge";
import { GoalRing } from "@/components/app/goal-ring";
import { TransactionModal } from "@/components/app/transaction-modal";
import { CashflowChart } from "@/components/charts/cashflow-chart";
import { CategoryDonut } from "@/components/charts/category-donut";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  budgetRows,
  buildInsights,
  categoryBreakdown,
  monthlySeries,
  summarize,
} from "@/lib/finance";
import {
  formatCurrency,
  formatDate,
  formatPercent,
  monthKey,
  monthLabel,
  shiftMonth,
  toDate,
} from "@/lib/format";
import { getCategoryIcon } from "@/lib/icons";
import type { Insight } from "@/lib/types";
import { cn } from "@/lib/utils";

const insightStyles: Record<Insight["tone"], { color: string; icon: typeof Info }> = {
  positive: { color: "#34D399", icon: CheckCircle2 },
  warning: { color: "#FBBF24", icon: TriangleAlert },
  danger: { color: "#FB7185", icon: TriangleAlert },
  neutral: { color: "#60A5FA", icon: Info },
};

export default function DashboardPage() {
  const { data } = useApp();
  const [month, setMonth] = useState(monthKey());
  const [modalOpen, setModalOpen] = useState(false);

  const profile = data!.profile;
  const currency = profile.currency;
  const categories = data!.categories;
  const transactions = data!.transactions;
  const goals = data!.goals;

  const summary = useMemo(() => summarize(transactions, month), [transactions, month]);
  const previous = useMemo(
    () => summarize(transactions, shiftMonth(month, -1)),
    [transactions, month]
  );
  const series = useMemo(
    () => monthlySeries(transactions, 6, toDate(`${month}-01`)),
    [transactions, month]
  );
  const breakdown = useMemo(
    () => categoryBreakdown(transactions, categories, month),
    [transactions, categories, month]
  );
  const budgets = useMemo(
    () => budgetRows(categories, transactions, month).filter((row) => row.budget > 0),
    [categories, transactions, month]
  );
  const insights = useMemo(
    () => buildInsights(profile, categories, transactions, goals, month),
    [profile, categories, transactions, goals, month]
  );

  const categoryMap = useMemo(
    () => new Map(categories.map((category) => [category.id, category])),
    [categories]
  );

  const recent = useMemo(
    () =>
      transactions
        .filter((tx) => monthKey(tx.date) === month)
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, 6),
    [transactions, month]
  );

  const delta = (current: number, before: number) =>
    before > 0 ? ((current - before) / before) * 100 : null;

  const expenseDelta = delta(summary.expense, previous.expense);
  const incomeDelta = delta(summary.income, previous.income);
  const balanceDelta =
    previous.balance !== 0
      ? ((summary.balance - previous.balance) / Math.abs(previous.balance)) * 100
      : null;

  const spark = {
    income: series.map((point) => ({ value: point.income })),
    expense: series.map((point) => ({ value: point.expense })),
    balance: series.map((point) => ({ value: point.balance })),
    rate: series.map((point) => ({
      value: point.income > 0 ? ((point.income - point.expense) / point.income) * 100 : 0,
    })),
  };

  const totalExpense = breakdown.reduce((sum, item) => sum + item.total, 0);
  const donutData = breakdown.slice(0, 6).map((item) => ({
    name: item.category.name,
    value: Math.round(item.total * 100) / 100,
    color: item.category.color,
    percent: item.percent,
  }));

  const goal = goals
    .slice()
    .sort(
      (a, b) =>
        b.saved / Math.max(1, b.target) - a.saved / Math.max(1, a.target)
    )
    .find((item) => item.saved < item.target) ?? goals[0];

  const firstName = profile.name.split(" ")[0];
  const monthName = monthLabel(month, "long");

  const balanceMessage =
    summary.balance > 0
      ? `Sobraram ${formatCurrency(summary.balance, currency)} este mês — um ótimo sinal.`
      : summary.balance < 0
        ? `O mês está ${formatCurrency(Math.abs(summary.balance), currency)} no vermelho.`
        : "As contas fecharam no zero a zero. Vamos virar o jogo?";

  return (
    <div className="space-y-4">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="animate-fade-up">
          <p className="text-[10.5px] font-medium uppercase tracking-[0.16em] text-dim">
            Sua situação em {monthName}
          </p>
          <h2 className="mt-2 text-[26px] font-semibold leading-[1.15] tracking-[-0.03em] sm:text-[30px]">
            Olá, {firstName}.
            <span className="ml-1.5 font-normal text-muted">Aqui está o seu mês.</span>
          </h2>
          <p className="mt-1.5 text-[12.5px] text-muted">{balanceMessage}</p>
        </div>
        <div className="flex items-center gap-2 animate-fade-up delay-1">
          <MonthPicker value={month} onChange={setMonth} />
          <Button onClick={() => setModalOpen(true)} className="flex-1 sm:flex-none">
            <Plus className="size-4" /> Nova transação
          </Button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4 xl:gap-4">
        <KpiCard
          label="Saldo do mês"
          amount={summary.balance}
          format={(value) => formatCurrency(value, currency)}
          hint="Receitas menos despesas"
          icon={Wallet}
          color="#34D399"
          delta={balanceDelta}
          spark={spark.balance}
          sparkId="balance"
          index={0}
        />
        <KpiCard
          label="Receitas"
          amount={summary.income}
          format={(value) => formatCurrency(value, currency)}
          hint="Tudo o que entrou"
          icon={ArrowDownLeft}
          color="#60A5FA"
          delta={incomeDelta}
          spark={spark.income}
          sparkId="income"
          index={1}
        />
        <KpiCard
          label="Despesas"
          amount={summary.expense}
          format={(value) => formatCurrency(value, currency)}
          hint="Tudo o que saiu"
          icon={ArrowUpRight}
          color="#FB7185"
          delta={expenseDelta}
          invert
          spark={spark.expense}
          sparkId="expense"
          index={2}
        />
        <KpiCard
          label="Taxa de poupança"
          amount={summary.savingsRate}
          format={(value) => formatPercent(value)}
          hint={
            summary.savingsRate >= 20
              ? "Acima da meta de 20%"
              : "Meta ideal: 20% da renda"
          }
          icon={PiggyBank}
          color="#FBBF24"
          delta={
            previous.income > 0 ? summary.savingsRate - previous.savingsRate : null
          }
          spark={spark.rate}
          sparkId="rate"
          index={3}
        />
      </div>

      <div className="grid gap-3 lg:grid-cols-3 lg:gap-4">
        <section className="card animate-fade-up p-5 lg:col-span-2">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="text-[14px] font-semibold tracking-[-0.01em] text-text">
                Fluxo de caixa
              </h3>
              <p className="mt-0.5 text-[11px] text-dim">Últimos 6 meses</p>
            </div>
            <div className="flex items-center gap-4 text-[10.5px] text-muted">
              <span className="flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-mint" /> Receitas
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-coral" /> Despesas
              </span>
            </div>
          </div>
          <div className="mt-4">
            <CashflowChart data={series} currency={currency} />
          </div>
        </section>

        <section className="card animate-fade-up delay-1 p-5">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-[14px] font-semibold tracking-[-0.01em] text-text">
                Onde seu dinheiro foi
              </h3>
              <p className="mt-0.5 text-[11px] text-dim">Por categoria</p>
            </div>
            <Link
              href="/app/orcamento"
              className="flex items-center gap-0.5 text-[10.5px] text-dim transition hover:text-mint"
            >
              Detalhes <ChevronRight className="size-3" />
            </Link>
          </div>

          {donutData.length === 0 ? (
            <div className="flex h-[280px] flex-col items-center justify-center text-center">
              <div className="grid size-11 place-items-center rounded-xl bg-white/[0.04] text-dim">
                <PieChartIcon />
              </div>
              <p className="mt-3 text-[12.5px] font-medium text-muted">
                Nenhuma despesa em {monthName}
              </p>
              <button
                onClick={() => setModalOpen(true)}
                className="mt-2 text-[11.5px] text-mint hover:underline"
              >
                Registrar a primeira
              </button>
            </div>
          ) : (
            <>
              <CategoryDonut data={donutData} total={totalExpense} currency={currency} />
              <div className="mt-1 space-y-2">
                {breakdown.slice(0, 4).map((item) => (
                  <div key={item.category.id} className="flex items-center gap-2">
                    <span
                      className="size-1.5 shrink-0 rounded-full"
                      style={{ backgroundColor: item.category.color }}
                    />
                    <span className="min-w-0 flex-1 truncate text-[11.5px] text-muted">
                      {item.category.name}
                    </span>
                    <span className="font-mono text-[11px] text-text">
                      {formatCurrency(item.total, currency, { compact: true })}
                    </span>
                    <span className="w-9 text-right font-mono text-[10px] text-dim">
                      {formatPercent(item.percent)}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>
      </div>

      <div className="grid gap-3 lg:grid-cols-3 lg:gap-4">
        <section className="card animate-fade-up p-5 lg:col-span-2">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-[14px] font-semibold tracking-[-0.01em] text-text">
                Orçamento por categoria
              </h3>
              <p className="mt-0.5 text-[11px] text-dim">
                {budgets.length > 0
                  ? `${budgets.filter((row) => row.status === "over").length} de ${budgets.length} limites estourados`
                  : "Defina limites para cada área da sua vida"}
              </p>
            </div>
            <Link
              href="/app/orcamento"
              className="flex items-center gap-0.5 text-[10.5px] text-dim transition hover:text-mint"
            >
              Gerenciar <ChevronRight className="size-3" />
            </Link>
          </div>

          {budgets.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/[0.09] py-10 text-center">
              <Target className="size-5 text-dim" />
              <p className="mt-3 text-[12.5px] font-medium text-muted">Sem limites definidos ainda</p>
              <p className="mt-1 max-w-xs text-[11.5px] leading-relaxed text-dim">
                Um bom começo é limitar Moradia, Alimentação e Lazer.
              </p>
              <Link href="/app/orcamento" className="mt-3 text-[11.5px] font-medium text-mint hover:underline">
                Criar meu primeiro orçamento
              </Link>
            </div>
          ) : (
            <div className="mt-4 space-y-3.5">
              {budgets.slice(0, 5).map((row) => {
                const Icon = getCategoryIcon(row.category.icon);
                const color =
                  row.status === "over"
                    ? "#FB7185"
                    : row.status === "attention"
                      ? "#FBBF24"
                      : row.category.color;
                return (
                  <div key={row.category.id}>
                    <div className="mb-1.5 flex items-center gap-2">
                      <Icon className="size-3.5 text-dim" strokeWidth={1.9} />
                      <span className="text-[11.5px] font-medium text-muted">
                        {row.category.name}
                      </span>
                      <span className="ml-auto font-mono text-[10.5px] text-dim">
                        <span className="text-text">
                          {formatCurrency(row.spent, currency, { compact: true })}
                        </span>{" "}
                        / {formatCurrency(row.budget, currency, { compact: true })}
                      </span>
                      <span
                        className={cn(
                          "w-9 text-right font-mono text-[10px]",
                          row.status === "over" ? "text-coral" : "text-dim"
                        )}
                      >
                        {formatPercent(row.percent)}
                      </span>
                    </div>
                    <Progress value={row.percent} color={color} />
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="card animate-fade-up delay-1 flex flex-col p-5">
          <div className="flex items-center gap-2">
            <span className="grid size-7 place-items-center rounded-lg bg-mint/10 text-mint">
              <Sparkles className="size-3.5" />
            </span>
            <div>
              <h3 className="text-[14px] font-semibold tracking-[-0.01em] text-text">
                Insights para você
              </h3>
              <p className="text-[10.5px] text-dim">Gerados a partir dos seus dados</p>
            </div>
          </div>

          <div className="mt-4 space-y-2.5">
            {insights.slice(0, 3).map((insight) => {
              const style = insightStyles[insight.tone];
              const Icon = style.icon;
              return (
                <div
                  key={insight.id}
                  className="rounded-xl border border-white/[0.055] bg-white/[0.018] p-3 transition hover:border-white/[0.1] hover:bg-white/[0.03]"
                >
                  <div className="flex items-start gap-2">
                    <Icon className="mt-0.5 size-3.5 shrink-0" style={{ color: style.color }} />
                    <div>
                      <p className="text-[11.5px] font-medium leading-snug text-text">
                        {insight.title}
                      </p>
                      <p className="mt-1 text-[10.5px] leading-relaxed text-dim">{insight.text}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {insights.length === 0 && (
            <p className="mt-4 rounded-xl border border-dashed border-white/[0.09] p-4 text-center text-[11.5px] text-dim">
              Registre mais transações para receber insights personalizados.
            </p>
          )}
        </section>
      </div>

      <div className="grid gap-3 lg:grid-cols-3 lg:gap-4">
        <section className="card animate-fade-up p-5 lg:col-span-2">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-[14px] font-semibold tracking-[-0.01em] text-text">
                Transações recentes
              </h3>
              <p className="mt-0.5 text-[11px] text-dim">
                {summary.count} lançamentos em {monthName}
              </p>
            </div>
            <Link
              href="/app/transacoes"
              className="flex items-center gap-0.5 text-[10.5px] text-dim transition hover:text-mint"
            >
              Ver todas <ArrowRight className="size-3" />
            </Link>
          </div>

          {recent.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <Wallet className="size-5 text-dim" />
              <p className="mt-3 text-[12px] text-muted">Nada por aqui neste mês.</p>
              <button
                onClick={() => setModalOpen(true)}
                className="mt-2 text-[11.5px] font-medium text-mint hover:underline"
              >
                Adicionar transação
              </button>
            </div>
          ) : (
            <div className="mt-3 divide-y divide-white/[0.045]">
              {recent.map((tx) => {
                const category = categoryMap.get(tx.categoryId);
                return (
                  <div key={tx.id} className="flex items-center gap-3 py-2.5 first:pt-3">
                    <CategoryBadge category={category} />
                    <span className="ml-auto hidden text-[10.5px] text-dim sm:block">
                      {formatDate(tx.date)}
                    </span>
                    <span
                      className={cn(
                        "w-[104px] text-right font-mono text-[12px] font-medium",
                        tx.type === "income" ? "text-mint" : "text-text"
                      )}
                    >
                      {tx.type === "income" ? "+" : "−"}{" "}
                      {formatCurrency(tx.amount, currency)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="card animate-fade-up delay-1 p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-[14px] font-semibold tracking-[-0.01em] text-text">Suas metas</h3>
              <p className="mt-0.5 text-[11px] text-dim">Progresso dos seus planos</p>
            </div>
            <Link
              href="/app/metas"
              className="flex items-center gap-0.5 text-[10.5px] text-dim transition hover:text-mint"
            >
              Ver <ChevronRight className="size-3" />
            </Link>
          </div>

          {!goal ? (
            <div className="flex flex-col items-center py-8 text-center">
              <Target className="size-5 text-dim" />
              <p className="mt-3 text-[12px] text-muted">Nenhuma meta criada</p>
              <Link href="/app/metas" className="mt-2 text-[11.5px] font-medium text-mint hover:underline">
                Criar primeira meta
              </Link>
            </div>
          ) : (
            <div className="mt-4">
              <div className="flex items-center gap-3.5">
                <GoalRing
                  percent={(goal.saved / Math.max(1, goal.target)) * 100}
                  color={goal.color}
                  size={72}
                >
                  <span className="font-mono text-[12px] font-semibold text-text">
                    {formatPercent((goal.saved / Math.max(1, goal.target)) * 100)}
                  </span>
                </GoalRing>
                <div className="min-w-0">
                  <p className="truncate text-[12.5px] font-medium text-text">{goal.name}</p>
                  <p className="mt-1 font-mono text-[10.5px] text-dim">
                    {formatCurrency(goal.saved, currency, { compact: true })} de{" "}
                    {formatCurrency(goal.target, currency, { compact: true })}
                  </p>
                  <p className="mt-1 text-[10.5px] text-dim">
                    Faltam {formatCurrency(Math.max(0, goal.target - goal.saved), currency)}
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-2.5 border-t border-white/[0.05] pt-3">
                {goals
                  .filter((item) => item.id !== goal.id)
                  .slice(0, 2)
                  .map((item) => (
                    <div key={item.id} className="flex items-center gap-2">
                      <span
                        className="size-1.5 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="min-w-0 flex-1 truncate text-[11px] text-muted">
                        {item.name}
                      </span>
                      <span className="font-mono text-[10px] text-dim">
                        {formatPercent((item.saved / Math.max(1, item.target)) * 100)}
                      </span>
                    </div>
                  ))}
              </div>

              <Link href="/app/metas" className="mt-4 block">
                <Button variant="secondary" size="sm" className="w-full">
                  <TrendingUp className="size-3.5" /> Fazer um aporte
                </Button>
              </Link>
            </div>
          )}
        </section>
      </div>

      <TransactionModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}

function PieChartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-5" aria-hidden="true">
      <path
        d="M12 3a9 9 0 1 0 9 9h-9V3Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M15 3.5A9 9 0 0 1 20.5 9H15V3.5Z" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
