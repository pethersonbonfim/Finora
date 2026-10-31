"use client";

import { useMemo, useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  CalendarDays,
  Pencil,
  Plus,
  Search,
  Trash2,
  Wallet,
} from "lucide-react";
import { useApp } from "@/components/app-provider";
import { MonthPicker } from "@/components/app/month-picker";
import { CategoryBadge } from "@/components/app/category-badge";
import { TransactionModal } from "@/components/app/transaction-modal";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useToast } from "@/components/ui/toast";
import { summarize } from "@/lib/finance";
import { formatCurrency, formatDate, monthKey, monthLabel } from "@/lib/format";
import type { Transaction, TxType } from "@/lib/types";
import { cn } from "@/lib/utils";

type Filter = "all" | TxType;

const filters: { key: Filter; label: string }[] = [
  { key: "all", label: "Todas" },
  { key: "income", label: "Receitas" },
  { key: "expense", label: "Despesas" },
];

export default function TransactionsPage() {
  const { data, deleteTransaction } = useApp();
  const { toast } = useToast();
  const [month, setMonth] = useState(monthKey());
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [deleting, setDeleting] = useState<Transaction | null>(null);

  const currency = data!.profile.currency;
  const categories = data!.categories;
  const categoryMap = useMemo(
    () => new Map(categories.map((category) => [category.id, category])),
    [categories]
  );

  const summary = useMemo(() => summarize(data!.transactions, month), [data, month]);

  const rows = useMemo(() => {
    const term = search.trim().toLowerCase();
    return data!.transactions
      .filter((tx) => monthKey(tx.date) === month)
      .filter((tx) => (filter === "all" ? true : tx.type === filter))
      .filter((tx) => {
        if (!term) return true;
        const category = categoryMap.get(tx.categoryId);
        return (
          tx.description.toLowerCase().includes(term) ||
          (category?.name.toLowerCase().includes(term) ?? false)
        );
      })
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [data, month, filter, search, categoryMap]);

  const hasAny = data!.transactions.length > 0;

  async function handleDelete() {
    if (!deleting) return;
    try {
      await deleteTransaction(deleting.id);
      toast({ title: "Transação excluída", description: deleting.description });
      setDeleting(null);
    } catch (error) {
      toast({
        title: "Não foi possível excluir",
        description: error instanceof Error ? error.message : "Tente novamente.",
        tone: "error",
      });
    }
  }

  function openNew() {
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(tx: Transaction) {
    setEditing(tx);
    setModalOpen(true);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="animate-fade-up">
          <p className="text-[10.5px] font-medium uppercase tracking-[0.16em] text-dim">
            Seu histórico
          </p>
          <h2 className="mt-2 text-[26px] font-semibold leading-[1.15] tracking-[-0.03em] sm:text-[30px]">
            Transações
          </h2>
          <p className="mt-1.5 text-[12.5px] text-muted">
            {summary.count} {summary.count === 1 ? "lançamento" : "lançamentos"} em{" "}
            {monthLabel(month, "long")}.
          </p>
        </div>
        <Button onClick={openNew} className="animate-fade-up delay-1 w-full sm:w-auto">
          <Plus className="size-4" /> Nova transação
        </Button>
      </div>

      <div className="card animate-fade-up divide-y divide-white/[0.05] sm:grid sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        <div className="flex items-center gap-3 p-4">
          <span className="grid size-9 place-items-center rounded-lg bg-sky/10 text-sky">
            <ArrowDownLeft className="size-4" />
          </span>
          <div>
            <p className="text-[10.5px] uppercase tracking-wider text-dim">Receitas</p>
            <p className="mt-0.5 font-mono text-[15px] font-semibold text-text">
              {formatCurrency(summary.income, currency)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4">
          <span className="grid size-9 place-items-center rounded-lg bg-coral/10 text-coral">
            <ArrowUpRight className="size-4" />
          </span>
          <div>
            <p className="text-[10.5px] uppercase tracking-wider text-dim">Despesas</p>
            <p className="mt-0.5 font-mono text-[15px] font-semibold text-text">
              {formatCurrency(summary.expense, currency)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4">
          <span className="grid size-9 place-items-center rounded-lg bg-mint/10 text-mint">
            <Wallet className="size-4" />
          </span>
          <div>
            <p className="text-[10.5px] uppercase tracking-wider text-dim">Saldo</p>
            <p
              className={cn(
                "mt-0.5 font-mono text-[15px] font-semibold",
                summary.balance >= 0 ? "text-mint" : "text-coral"
              )}
            >
              {formatCurrency(summary.balance, currency)}
            </p>
          </div>
        </div>
      </div>

      <div className="card animate-fade-up delay-1 overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-white/[0.05] p-4 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-dim" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por descrição ou categoria..."
              className="field h-9 py-0 pl-9 text-[12px]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 rounded-lg border border-white/[0.07] bg-black/20 p-1">
              {filters.map((item) => (
                <button
                  key={item.key}
                  onClick={() => setFilter(item.key)}
                  className={cn(
                    "rounded-md px-2.5 py-1 text-[11px] font-medium transition",
                    filter === item.key
                      ? "bg-white/[0.08] text-text shadow-sm"
                      : "text-dim hover:text-muted"
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <MonthPicker value={month} onChange={setMonth} />
          </div>
        </div>

        {rows.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="relative grid size-14 place-items-center rounded-2xl border border-white/[0.07] bg-white/[0.025]">
              <CalendarDays className="size-6 text-dim" strokeWidth={1.6} />
              <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-mint text-[#04130d]">
                <Plus className="size-3" strokeWidth={2.6} />
              </span>
            </div>
            <h3 className="mt-4 text-[14px] font-semibold text-text">
              {hasAny ? "Nada encontrado por aqui" : "Seu histórico começa agora"}
            </h3>
            <p className="mt-1.5 max-w-xs text-[12px] leading-relaxed text-muted">
              {hasAny
                ? "Ajuste a busca, o mês ou o filtro para encontrar o que procura."
                : "Registre sua primeira receita ou despesa e veja o painel ganhar vida."}
            </p>
            {!hasAny && (
              <Button onClick={openNew} className="mt-4" size="sm">
                <Plus className="size-3.5" /> Adicionar transação
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="hidden grid-cols-[92px_1fr_170px_128px_72px] gap-3 border-b border-white/[0.05] px-4 py-2.5 text-[10px] font-medium uppercase tracking-[0.12em] text-dim sm:grid">
              <span>Data</span>
              <span>Descrição</span>
              <span>Categoria</span>
              <span className="text-right">Valor</span>
              <span />
            </div>

            <div className="divide-y divide-white/[0.04]">
              {rows.map((tx) => {
                const category = categoryMap.get(tx.categoryId);
                return (
                  <div
                    key={tx.id}
                    className="group grid grid-cols-[1fr_auto] items-center gap-3 px-4 py-3 transition hover:bg-white/[0.02] sm:grid-cols-[92px_1fr_170px_128px_72px]"
                  >
                    <span className="hidden font-mono text-[11px] text-dim sm:block">
                      {formatDate(tx.date)}
                    </span>

                    <div className="flex min-w-0 items-center gap-2.5">
                      <span
                        className="grid size-7 shrink-0 place-items-center rounded-md sm:hidden"
                        style={{
                          backgroundColor: `${category?.color ?? "#5c636d"}14`,
                          color: category?.color ?? "#5c636d",
                        }}
                      >
                        <span className="text-[10px] font-semibold">
                          {tx.description[0]?.toUpperCase()}
                        </span>
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-[12.5px] font-medium text-text">
                          {tx.description}
                        </p>
                        <p className="mt-0.5 flex items-center gap-1.5 text-[10.5px] text-dim sm:hidden">
                          {formatDate(tx.date)} · {category?.name ?? "Sem categoria"}
                        </p>
                        <p className="mt-0.5 hidden items-center gap-1.5 text-[10px] text-dim sm:flex">
                          {tx.recurring && (
                            <span className="rounded border border-white/[0.08] px-1.5 py-px text-[9px] uppercase tracking-wide text-dim">
                              fixa
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    <span className="hidden sm:block">
                      <CategoryBadge category={category} size="sm" />
                    </span>

                    <span
                      className={cn(
                        "text-right font-mono text-[12px] font-medium",
                        tx.type === "income" ? "text-mint" : "text-text"
                      )}
                    >
                      {tx.type === "income" ? "+" : "−"} {formatCurrency(tx.amount, currency)}
                    </span>

                    <div className="flex justify-end gap-0.5 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100">
                      <button
                        onClick={() => openEdit(tx)}
                        aria-label={`Editar ${tx.description}`}
                        className="grid size-7 place-items-center rounded-md text-dim transition hover:bg-white/[0.07] hover:text-text"
                      >
                        <Pencil className="size-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleting(tx)}
                        aria-label={`Excluir ${tx.description}`}
                        className="grid size-7 place-items-center rounded-md text-dim transition hover:bg-coral/10 hover:text-coral"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between border-t border-white/[0.05] px-4 py-3">
              <p className="text-[10.5px] text-dim">
                {rows.length} {rows.length === 1 ? "resultado" : "resultados"}
              </p>
              <p className="font-mono text-[10.5px] text-dim">
                Saldo filtrado:{" "}
                <span
                  className={cn(
                    "font-medium",
                    rows.reduce((sum, tx) => sum + (tx.type === "income" ? tx.amount : -tx.amount), 0) >= 0
                      ? "text-mint"
                      : "text-coral"
                  )}
                >
                  {formatCurrency(
                    rows.reduce(
                      (sum, tx) => sum + (tx.type === "income" ? tx.amount : -tx.amount),
                      0
                    ),
                    currency
                  )}
                </span>
              </p>
            </div>
          </>
        )}
      </div>

      <TransactionModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        initial={editing}
      />

      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        title="Excluir transação?"
        description={`"${deleting?.description ?? ""}" será removida do seu histórico. Essa ação não pode ser desfeita.`}
        confirmLabel="Excluir"
      />
    </div>
  );
}
