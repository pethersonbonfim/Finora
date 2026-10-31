"use client";

import { useMemo, useState } from "react";
import {
  CalendarClock,
  CheckCircle2,
  Pencil,
  Plus,
  Target,
  Trash2,
  TrendingUp,
} from "lucide-react";
import { useApp } from "@/components/app-provider";
import { GoalRing } from "@/components/app/goal-ring";
import { GoalModal } from "@/components/app/goal-modal";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/toast";
import { currencySymbol, formatCurrency, formatDate, formatPercent, monthsUntil } from "@/lib/format";
import type { Goal } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function GoalsPage() {
  const { data, addContribution, deleteGoal } = useApp();
  const { toast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Goal | null>(null);
  const [contributing, setContributing] = useState<Goal | null>(null);
  const [amount, setAmount] = useState("100");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<Goal | null>(null);

  const currency = data!.profile.currency;
  const symbol = currencySymbol(currency);
  const goals = data!.goals;

  const totalSaved = goals.reduce((sum, goal) => sum + goal.saved, 0);
  const totalTarget = goals.reduce((sum, goal) => sum + goal.target, 0);
  const overall = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;
  const completed = goals.filter((goal) => goal.saved >= goal.target).length;

  const suggestedMonthly = useMemo(
    () =>
      goals.reduce((sum, goal) => {
        const remaining = Math.max(0, goal.target - goal.saved);
        if (remaining === 0) return sum;
        const months = Math.max(1, monthsUntil(goal.deadline));
        return sum + remaining / months;
      }, 0),
    [goals]
  );

  function openNew() {
    setEditing(null);
    setModalOpen(true);
  }

  function openContribute(goal: Goal) {
    setContributing(goal);
    setAmount("100");
  }

  async function handleContribution(event: React.FormEvent) {
    event.preventDefault();
    if (!contributing) return;
    const value = Number(amount.replace(",", "."));
    if (!Number.isFinite(value) || value <= 0) {
      toast({ title: "Informe um valor maior que zero", tone: "error" });
      return;
    }
    setSaving(true);
    try {
      await addContribution(contributing.id, value);
      toast({
        title: "Aporte registrado",
        description: `${formatCurrency(value, currency)} em "${contributing.name}".`,
      });
      setContributing(null);
    } catch (error) {
      toast({
        title: "Não foi possível registrar",
        description: error instanceof Error ? error.message : "Tente novamente.",
        tone: "error",
      });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleting) return;
    try {
      await deleteGoal(deleting.id);
      toast({ title: "Meta removida", description: deleting.name });
      setDeleting(null);
    } catch (error) {
      toast({
        title: "Não foi possível remover",
        description: error instanceof Error ? error.message : "Tente novamente.",
        tone: "error",
      });
    }
  }

  const contributeValue = Number(amount.replace(",", "."));
  const contributingNewTotal = contributing
    ? Math.min(contributing.target, contributing.saved + (Number.isFinite(contributeValue) ? contributeValue : 0))
    : 0;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="animate-fade-up">
          <p className="text-[10.5px] font-medium uppercase tracking-[0.16em] text-dim">
            Seus planos
          </p>
          <h2 className="mt-2 text-[26px] font-semibold leading-[1.15] tracking-[-0.03em] sm:text-[30px]">
            Metas
          </h2>
          <p className="mt-1.5 text-[12.5px] text-muted">
            Transforme intenção em progresso, um aporte de cada vez.
          </p>
        </div>
        <Button onClick={openNew} className="animate-fade-up delay-1 w-full sm:w-auto">
          <Plus className="size-4" /> Nova meta
        </Button>
      </div>

      {goals.length === 0 ? (
        <div className="card animate-fade-up flex flex-col items-center px-6 py-16 text-center">
          <div className="grid size-14 place-items-center rounded-2xl border border-white/[0.07] bg-white/[0.025]">
            <Target className="size-6 text-dim" strokeWidth={1.6} />
          </div>
          <h3 className="mt-4 text-[15px] font-semibold text-text">
            Todo sonho merece um plano
          </h3>
          <p className="mt-1.5 max-w-sm text-[12px] leading-relaxed text-muted">
            Crie sua primeira meta — uma viagem, a reserva de emergência ou aquele notebook
            novo — e acompanhe cada passo.
          </p>
          <Button onClick={openNew} className="mt-5">
            <Plus className="size-3.5" /> Criar minha primeira meta
          </Button>
        </div>
      ) : (
        <>
          <section className="card animate-fade-up p-5">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-dim">
                  Guardado até agora
                </p>
                <p className="mt-1.5 font-mono text-[30px] font-semibold leading-none tracking-tight text-text">
                  {formatCurrency(totalSaved, currency)}
                </p>
                <p className="mt-1.5 text-[11px] text-dim">
                  de {formatCurrency(totalTarget, currency)} em {goals.length}{" "}
                  {goals.length === 1 ? "meta" : "metas"} · {completed} concluída
                  {completed === 1 ? "" : "s"}
                </p>
              </div>
              <div className="flex gap-7">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-dim">Progresso</p>
                  <p className="mt-1 font-mono text-[14px] font-medium text-mint">
                    {formatPercent(overall)}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-dim">
                    Aporte mensal sugerido
                  </p>
                  <p className="mt-1 font-mono text-[14px] font-medium text-text">
                    {formatCurrency(suggestedMonthly, currency)}
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-5">
              <Progress value={overall} color="#34D399" trackClassName="h-2" />
            </div>
          </section>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {goals.map((goal) => {
              const percent = (goal.saved / Math.max(1, goal.target)) * 100;
              const remaining = Math.max(0, goal.target - goal.saved);
              const done = goal.saved >= goal.target;
              const months = monthsUntil(goal.deadline);
              const monthly = remaining > 0 ? remaining / Math.max(1, months) : 0;

              return (
                <div
                  key={goal.id}
                  className={cn(
                    "card card-hover group flex flex-col p-5 animate-fade-up",
                    done && "border-mint/20 bg-mint/[0.015]"
                  )}
                >
                  <div className="flex items-start gap-4">
                    <GoalRing percent={percent} color={goal.color} size={82} stroke={7}>
                      <div className="text-center">
                        <p className="font-mono text-[13px] font-semibold leading-none text-text">
                          {formatPercent(percent)}
                        </p>
                        {done && <p className="mt-0.5 text-[8px] uppercase tracking-wider text-mint">feito</p>}
                      </div>
                    </GoalRing>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-1">
                        <h3 className="truncate text-[13px] font-semibold leading-snug text-text">
                          {goal.name}
                        </h3>
                        <div className="flex shrink-0 gap-0.5 opacity-0 transition group-hover:opacity-100 focus-within:opacity-100">
                          <button
                            onClick={() => {
                              setEditing(goal);
                              setModalOpen(true);
                            }}
                            aria-label={`Editar ${goal.name}`}
                            className="grid size-6 place-items-center rounded text-dim transition hover:bg-white/[0.07] hover:text-text"
                          >
                            <Pencil className="size-3" />
                          </button>
                          <button
                            onClick={() => setDeleting(goal)}
                            aria-label={`Excluir ${goal.name}`}
                            className="grid size-6 place-items-center rounded text-dim transition hover:bg-coral/10 hover:text-coral"
                          >
                            <Trash2 className="size-3" />
                          </button>
                        </div>
                      </div>

                      <p className="mt-1.5 font-mono text-[15px] font-semibold text-text">
                        {formatCurrency(goal.saved, currency)}
                      </p>
                      <p className="mt-0.5 font-mono text-[10px] text-dim">
                        de {formatCurrency(goal.target, currency)}
                      </p>
                      <p className="mt-2 flex items-center gap-1 text-[10px] text-dim">
                        <CalendarClock className="size-3" />
                        {formatDate(goal.deadline)}
                        {!done && (
                          <span className="text-dim/80">
                            · {months > 0 ? `${months} ${months === 1 ? "mês" : "meses"}` : "prazo encerrado"}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-1 flex-col justify-end">
                    {done ? (
                      <div className="flex items-center gap-2 rounded-lg border border-mint/15 bg-mint/[0.05] px-3 py-2 text-[11px] text-mint">
                        <CheckCircle2 className="size-3.5" />
                        Meta concluída. Que tal a próxima?
                      </div>
                    ) : (
                      <p className="text-[10.5px] leading-relaxed text-dim">
                        Guarde{" "}
                        <span className="font-mono text-muted">
                          {formatCurrency(monthly, currency)}
                        </span>{" "}
                        por mês para chegar a tempo.
                      </p>
                    )}

                    <div className="mt-3 flex gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="flex-1"
                        onClick={() => openContribute(goal)}
                      >
                        <Plus className="size-3" /> Aporte
                      </Button>
                      {!done && (
                        <span className="grid place-items-center rounded-lg border border-white/[0.06] px-2.5 font-mono text-[10px] text-dim">
                          falta {formatCurrency(remaining, currency, { compact: true })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <section className="card animate-fade-up flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-sky/10 text-sky">
                <TrendingUp className="size-4" />
              </span>
              <div>
                <h3 className="text-[13px] font-semibold tracking-[-0.01em] text-text">
                  Dica: automatize seus aportes
                </h3>
                <p className="mt-0.5 max-w-xl text-[11px] leading-relaxed text-dim">
                  Transferir o valor da meta no mesmo dia em que o salário cai é o jeito mais
                  fácil de manter a constância. Consistência vence intensidade.
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={openNew}>
              <Plus className="size-3.5" /> Adicionar outra meta
            </Button>
          </section>
        </>
      )}

      <GoalModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        initial={editing}
      />

      <Modal
        open={!!contributing}
        onClose={() => setContributing(null)}
        title="Adicionar aporte"
        description={
          contributing
            ? `Quanto você quer guardar em "${contributing.name}"?`
            : undefined
        }
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setContributing(null)} disabled={saving}>
              Cancelar
            </Button>
            <Button type="submit" form="contribution-form" loading={saving}>
              Guardar agora
            </Button>
          </>
        }
      >
        {contributing && (
          <form id="contribution-form" onSubmit={handleContribution} className="space-y-4">
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-muted">Progresso atual</span>
                <span className="font-mono text-text">
                  {formatCurrency(contributing.saved, currency)} /{" "}
                  {formatCurrency(contributing.target, currency)}
                </span>
              </div>
              <div className="mt-2.5">
                <Progress
                  value={(contributing.saved / Math.max(1, contributing.target)) * 100}
                  color={contributing.color}
                />
              </div>
              <p className="mt-2 text-[10px] text-dim">
                Depois do aporte:{" "}
                <span className="font-mono text-mint">
                  {formatCurrency(contributingNewTotal, currency)}
                </span>{" "}
                ({formatPercent((contributingNewTotal / Math.max(1, contributing.target)) * 100)})
              </p>
            </div>

            <div>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-mono text-[12px] text-dim">
                  {symbol}
                </span>
                <input
                  autoFocus
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  inputMode="decimal"
                  placeholder="0,00"
                  className="field h-12 pl-9 font-mono text-[15px]"
                />
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {[50, 100, 250, 500].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setAmount(String(value))}
                    className="rounded-md border border-white/[0.08] px-2.5 py-1 font-mono text-[10.5px] text-muted transition hover:border-mint/30 hover:text-mint"
                  >
                    {symbol} {value}
                  </button>
                ))}
              </div>
            </div>
          </form>
        )}
      </Modal>

      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        title="Excluir meta?"
        description={`"${deleting?.name ?? ""}" e todo o progresso registrado serão removidos. Essa ação não pode ser desfeita.`}
        confirmLabel="Excluir meta"
      />
    </div>
  );
}
