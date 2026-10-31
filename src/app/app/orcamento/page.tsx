"use client";

import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  Pencil,
  PieChart,
  Plus,
  Sparkles,
  Target,
  TriangleAlert,
} from "lucide-react";
import { useApp } from "@/components/app-provider";
import { MonthPicker } from "@/components/app/month-picker";
import { CategoryModal } from "@/components/app/category-modal";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useToast } from "@/components/ui/toast";
import { budgetRows, summarize } from "@/lib/finance";
import { formatCurrency, formatPercent, monthKey, monthLabel } from "@/lib/format";
import { getCategoryIcon } from "@/lib/icons";
import type { Category } from "@/lib/types";
import { cn } from "@/lib/utils";

const SUGGESTIONS: Record<string, number> = {
  Moradia: 0.3,
  Alimentação: 0.12,
  Transporte: 0.08,
  Lazer: 0.07,
  Saúde: 0.05,
  Educação: 0.05,
  Assinaturas: 0.03,
  Compras: 0.05,
  Outros: 0.05,
};

export default function BudgetPage() {
  const { data, updateCategory, deleteCategory } = useApp();
  const { toast } = useToast();
  const [month, setMonth] = useState(monthKey());
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState<Category | null>(null);
  const [suggestOpen, setSuggestOpen] = useState(false);
  const [applying, setApplying] = useState(false);

  const currency = data!.profile.currency;
  const summary = useMemo(() => summarize(data!.transactions, month), [data, month]);
  const rows = useMemo(
    () => budgetRows(data!.categories, data!.transactions, month),
    [data, month]
  );

  const withBudget = rows.filter((row) => row.budget > 0);
  const withoutBudget = rows.filter((row) => row.budget <= 0);

  const totalBudget = withBudget.reduce((sum, row) => sum + row.budget, 0);
  const totalSpent = withBudget.reduce((sum, row) => sum + row.spent, 0);
  const available = totalBudget - totalSpent;
  const overall = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
  const overCount = withBudget.filter((row) => row.status === "over").length;

  const income = data!.profile.monthlyIncome || summary.income;
  const suggestionBase = income > 0 ? income : summary.expense;

  function openNew() {
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(category: Category) {
    setEditing(category);
    setModalOpen(true);
  }

  async function handleDelete() {
    if (!deleting) return;
    try {
      await deleteCategory(deleting.id);
      toast({
        title: "Categoria excluída",
        description: "As transações antigas ficaram sem categoria.",
      });
      setDeleting(null);
    } catch (error) {
      toast({
        title: "Não foi possível excluir",
        description: error instanceof Error ? error.message : "Tente novamente.",
        tone: "error",
      });
    }
  }

  async function applySuggestion() {
    if (suggestionBase <= 0) {
      toast({
        title: "Informe sua renda primeiro",
        description: "Vá em Configurações e adicione sua renda mensal para receber uma sugestão.",
        tone: "error",
      });
      setSuggestOpen(false);
      return;
    }
    setApplying(true);
    try {
      const targets = data!.categories.filter(
        (category) => category.kind === "expense" && SUGGESTIONS[category.name] !== undefined
      );
      for (const category of targets) {
        const nextBudget = Math.round(suggestionBase * SUGGESTIONS[category.name]);
        await updateCategory(category.id, { budget: nextBudget });
      }
      toast({
        title: "Orçamento sugerido aplicado",
        description: `Limites calculados com base em ${formatCurrency(suggestionBase, currency)}.`,
      });
      setSuggestOpen(false);
    } catch (error) {
      toast({
        title: "Não foi possível aplicar",
        description: error instanceof Error ? error.message : "Tente novamente.",
        tone: "error",
      });
    } finally {
      setApplying(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="animate-fade-up">
          <p className="text-[10.5px] font-medium uppercase tracking-[0.16em] text-dim">
            Planejamento
          </p>
          <h2 className="mt-2 text-[26px] font-semibold leading-[1.15] tracking-[-0.03em] sm:text-[30px]">
            Orçamento
          </h2>
          <p className="mt-1.5 text-[12.5px] text-muted">
            Limites claros para {monthLabel(month, "long")} — sem culpa, com direção.
          </p>
        </div>
        <div className="flex animate-fade-up flex-wrap items-center gap-2 delay-1">
          <MonthPicker value={month} onChange={setMonth} />
          <Button variant="secondary" onClick={() => setSuggestOpen(true)} size="md">
            <Sparkles className="size-3.5" /> Sugerir limites
          </Button>
          <Button onClick={openNew}>
            <Plus className="size-4" /> Nova categoria
          </Button>
        </div>
      </div>

      {withBudget.length === 0 ? (
        <div className="card animate-fade-up flex flex-col items-center px-6 py-14 text-center">
          <div className="relative grid size-14 place-items-center rounded-2xl border border-white/[0.07] bg-white/[0.025]">
            <PieChart className="size-6 text-dim" strokeWidth={1.6} />
            <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-mint text-[#04130d]">
              <Plus className="size-3" strokeWidth={2.6} />
            </span>
          </div>
          <h3 className="mt-4 text-[15px] font-semibold text-text">
            Seu orçamento está em branco
          </h3>
          <p className="mt-1.5 max-w-sm text-[12px] leading-relaxed text-muted">
            Defina quanto quer gastar em cada área da vida. Você também pode usar nossa
            sugestão inteligente baseada em 50/30/20.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <Button onClick={() => setSuggestOpen(true)}>
              <Sparkles className="size-3.5" /> Criar orçamento automático
            </Button>
            <Button variant="secondary" onClick={openNew}>
              <Plus className="size-3.5" /> Definir manualmente
            </Button>
          </div>
        </div>
      ) : (
        <>
          <section className="card animate-fade-up p-5">
            <div className="flex flex-wrap items-end justify-between gap-5">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-dim">
                  Planejado para o mês
                </p>
                <p className="mt-1.5 font-mono text-[30px] font-semibold leading-none tracking-tight text-text">
                  {formatCurrency(totalBudget, currency)}
                </p>
                <p className="mt-1.5 text-[11px] text-dim">
                  {withBudget.length} categorias com limite ativo
                </p>
              </div>
              <div className="flex gap-7">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-dim">Gasto</p>
                  <p className="mt-1 font-mono text-[14px] font-medium text-text">
                    {formatCurrency(totalSpent, currency)}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-dim">Disponível</p>
                  <p
                    className={cn(
                      "mt-1 font-mono text-[14px] font-medium",
                      available >= 0 ? "text-mint" : "text-coral"
                    )}
                  >
                    {formatCurrency(available, currency)}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-dim">Utilizado</p>
                  <p className="mt-1 font-mono text-[14px] font-medium text-text">
                    {formatPercent(overall)}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5">
              <Progress
                value={overall}
                color={
                  overCount > 0 ? "#FB7185" : overall >= 80 ? "#FBBF24" : "#34D399"
                }
                trackClassName="h-2"
              />
              <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 text-[10.5px]">
                <span className="text-dim">
                  {overall >= 100
                    ? "Você atingiu o limite total do mês."
                    : `Ainda dá para gastar ${formatCurrency(Math.max(0, available), currency)} dentro do plano.`}
                </span>
                {overCount > 0 ? (
                  <span className="flex items-center gap-1.5 text-coral">
                    <TriangleAlert className="size-3" />
                    {overCount} {overCount === 1 ? "categoria estourou" : "categorias estouraram"}
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-mint">
                    <Target className="size-3" /> Tudo sob controle
                  </span>
                )}
              </div>
            </div>
          </section>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {withBudget.map((row) => {
              const Icon = getCategoryIcon(row.category.icon);
              const color =
                row.status === "over"
                  ? "#FB7185"
                  : row.status === "attention"
                    ? "#FBBF24"
                    : row.category.color;

              return (
                <div
                  key={row.category.id}
                  className={cn(
                    "card card-hover group p-4 animate-fade-up",
                    row.status === "over" && "border-coral/20 bg-coral/[0.02]"
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <span
                        className="grid size-8 shrink-0 place-items-center rounded-lg"
                        style={{ backgroundColor: `${row.category.color}14`, color: row.category.color }}
                      >
                        <Icon className="size-4" strokeWidth={1.8} />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-[12.5px] font-medium text-text">
                          {row.category.name}
                        </p>
                        <p className="text-[10px] text-dim">
                          {row.status === "over"
                            ? "Acima do limite"
                            : row.status === "attention"
                              ? "Perto do limite"
                              : "Dentro do plano"}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => openEdit(row.category)}
                      aria-label={`Editar ${row.category.name}`}
                      className="grid size-7 place-items-center rounded-md text-dim opacity-0 transition hover:bg-white/[0.07] hover:text-text group-hover:opacity-100 focus:opacity-100"
                    >
                      <Pencil className="size-3" />
                    </button>
                  </div>

                  <div className="mt-4 flex items-baseline justify-between">
                    <span className="font-mono text-[18px] font-semibold tracking-tight text-text">
                      {formatCurrency(row.spent, currency)}
                    </span>
                    <span className="font-mono text-[10.5px] text-dim">
                      de {formatCurrency(row.budget, currency, { compact: true })}
                    </span>
                  </div>

                  <Progress value={row.percent} color={color} trackClassName="mt-2.5" />

                  <div className="mt-2.5 flex items-center justify-between text-[10.5px]">
                    <span style={{ color: row.remaining < 0 ? "#FB7185" : "#8d949e" }}>
                      {row.remaining >= 0
                        ? `${formatCurrency(row.remaining, currency)} disponíveis`
                        : `${formatCurrency(Math.abs(row.remaining), currency)} acima`}
                    </span>
                    <span className="font-mono text-dim">{formatPercent(row.percent)}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {withoutBudget.length > 0 && (
            <section className="card animate-fade-up p-5">
              <div className="flex items-start gap-2">
                <ArrowUpRight className="mt-0.5 size-4 text-dim" />
                <div>
                  <h3 className="text-[13.5px] font-semibold tracking-[-0.01em] text-text">Categorias sem limite</h3>
                  <p className="mt-0.5 text-[11px] text-dim">
                    Elas ainda contam no seu saldo, mas não têm teto definido.
                  </p>
                </div>
              </div>
              <div className="mt-3 divide-y divide-white/[0.04]">
                {withoutBudget.map((row) => {
                  const Icon = getCategoryIcon(row.category.icon);
                  return (
                    <div key={row.category.id} className="flex items-center gap-3 py-2.5">
                      <span
                        className="grid size-7 place-items-center rounded-md"
                        style={{
                          backgroundColor: `${row.category.color}12`,
                          color: row.category.color,
                        }}
                      >
                        <Icon className="size-3.5" strokeWidth={1.8} />
                      </span>
                      <span className="text-[12px] text-muted">{row.category.name}</span>
                      <span className="ml-auto font-mono text-[11px] text-dim">
                        {formatCurrency(row.spent, currency)}
                      </span>
                      <button
                        onClick={() => openEdit(row.category)}
                        className="rounded-md border border-white/[0.08] px-2 py-1 text-[10.5px] text-muted transition hover:border-mint/30 hover:text-mint"
                      >
                        Definir limite
                      </button>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </>
      )}

      <section className="card animate-fade-up p-5">
        <div className="flex items-center gap-2">
          <Target className="size-4 text-mint" />
          <h3 className="text-[13.5px] font-semibold tracking-[-0.01em] text-text">A regra 50/30/20</h3>
        </div>
        <p className="mt-1 text-[11px] text-dim">
          Um ponto de partida simples para dividir o que você ganha.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {[
            { pct: 50, label: "Essenciais", desc: "Moradia, alimentação, transporte e contas fixas", color: "#34D399" },
            { pct: 30, label: "Estilo de vida", desc: "Lazer, compras e assinaturas", color: "#60A5FA" },
            { pct: 20, label: "Futuro", desc: "Investimentos, reserva e metas", color: "#FBBF24" },
          ].map((item) => (
            <div key={item.label} className="rounded-xl border border-white/[0.055] bg-white/[0.018] p-3.5">
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-[18px] font-semibold" style={{ color: item.color }}>
                  {item.pct}%
                </span>
                {suggestionBase > 0 && (
                  <span className="font-mono text-[10.5px] text-dim">
                    {formatCurrency((suggestionBase * item.pct) / 100, currency, { compact: true })}
                  </span>
                )}
              </div>
              <p className="mt-1.5 text-[11.5px] font-medium text-text">{item.label}</p>
              <p className="mt-0.5 text-[10px] leading-relaxed text-dim">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <CategoryModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        initial={editing}
        onRequestDelete={(category) => {
          setModalOpen(false);
          setEditing(null);
          setDeleting(category);
        }}
      />

      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        title="Excluir categoria?"
        description={`"${deleting?.name ?? ""}" será removida. As transações antigas continuarão no histórico, mas sem categoria.`}
        confirmLabel="Excluir categoria"
      />

      <ConfirmDialog
        open={suggestOpen}
        onClose={() => setSuggestOpen(false)}
        onConfirm={applySuggestion}
        title="Aplicar orçamento sugerido?"
        description={`Vamos distribuir ${formatCurrency(suggestionBase, currency)} entre suas categorias com base na regra 50/30/20. Você pode ajustar cada limite depois.`}
        confirmLabel="Aplicar sugestão"
      >
        {applying && (
          <p className="text-[11.5px] text-muted">Calculando os melhores limites...</p>
        )}
        {suggestionBase <= 0 && (
          <p className="text-[11.5px] text-coral">
            Cadastre sua renda em Configurações para usar esta sugestão.
          </p>
        )}
      </ConfirmDialog>
    </div>
  );
}
