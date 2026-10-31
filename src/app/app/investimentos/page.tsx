"use client";

import { useMemo, useState } from "react";
import {
  BookOpen,
  Coins,
  Landmark,
  Loader2,
  PiggyBank,
  Plus,
  Save,
  ShieldCheck,
  Sparkles,
  Trash2,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { useApp } from "@/components/app-provider";
import { InvestmentChart } from "@/components/charts/investment-chart";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { FormField } from "@/components/ui/form";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { CountUp } from "@/components/ui/count-up";
import { useToast } from "@/components/ui/toast";
import { simulateInvestment } from "@/lib/finance";
import { formatCurrency, formatPercent } from "@/lib/format";
import type { Simulation } from "@/lib/types";
import { cn } from "@/lib/utils";

const PRESETS = [
  { name: "Poupança", rate: 6.17 },
  { name: "CDI", rate: 10.65 },
  { name: "Tesouro IPCA+", rate: 11.3 },
  { name: "Ações (média)", rate: 12 },
];

const education = [
  {
    icon: ShieldCheck,
    color: "#34D399",
    title: "Reserva de emergência",
    text: "Antes de investir, guarde de 3 a 6 meses do seu custo de vida em algo líquido e seguro, como o Tesouro Selic.",
  },
  {
    icon: Landmark,
    color: "#60A5FA",
    title: "Renda fixa não é tudo igual",
    text: "Tesouro, CDB e LCI têm riscos, prazos e impostos diferentes. Compare o rendimento líquido, não só o bruto.",
  },
  {
    icon: Coins,
    color: "#FBBF24",
    title: "Diversificar é proteger",
    text: "Não coloque tudo em um único ativo. Distribuir entre renda fixa e variável reduz o impacto de qualquer tropeço.",
  },
];

export default function InvestmentsPage() {
  const { data, addSimulation, deleteSimulation } = useApp();
  const { toast } = useToast();
  const currency = data!.profile.currency;

  const [initial, setInitial] = useState(5000);
  const [monthly, setMonthly] = useState(800);
  const [rate, setRate] = useState(10.5);
  const [years, setYears] = useState(10);

  const [saveOpen, setSaveOpen] = useState(false);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<Simulation | null>(null);

  const months = years * 12;
  const result = useMemo(
    () => simulateInvestment(initial, monthly, rate, months),
    [initial, monthly, rate, months]
  );

  const interestShare = result.final > 0 ? (result.interest / result.final) * 100 : 0;

  function loadSimulation(simulation: Simulation) {
    setInitial(simulation.initial);
    setMonthly(simulation.monthly);
    setRate(simulation.rate);
    setYears(Math.max(1, Math.round(simulation.months / 12)));
    toast({
      title: "Simulação carregada",
      description: simulation.name,
      tone: "info",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSave(event: React.FormEvent) {
    event.preventDefault();
    if (!name.trim()) {
      toast({ title: "Dê um nome para a simulação", tone: "error" });
      return;
    }
    setSaving(true);
    try {
      await addSimulation({ name: name.trim(), initial, monthly, rate, months });
      toast({ title: "Simulação salva", description: name.trim() });
      setSaveOpen(false);
      setName("");
    } catch (error) {
      toast({
        title: "Não foi possível salvar",
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
      await deleteSimulation(deleting.id);
      toast({ title: "Simulação removida", description: deleting.name });
      setDeleting(null);
    } catch (error) {
      toast({
        title: "Não foi possível remover",
        description: error instanceof Error ? error.message : "Tente novamente.",
        tone: "error",
      });
    }
  }

  function openSave() {
    setName(
      `Plano de ${years} ${years === 1 ? "ano" : "anos"} · ${formatCurrency(monthly, currency)}/mês`
    );
    setSaveOpen(true);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="animate-fade-up">
          <p className="text-[10.5px] font-medium uppercase tracking-[0.16em] text-dim">
            Seu futuro
          </p>
          <h2 className="mt-2 text-[26px] font-semibold leading-[1.15] tracking-[-0.03em] sm:text-[30px]">
            Investimentos
          </h2>
          <p className="mt-1.5 text-[12.5px] text-muted">
            Descubra o que o tempo e a constância podem fazer pelo seu dinheiro.
          </p>
        </div>
        <Button variant="secondary" onClick={openSave} className="animate-fade-up delay-1 w-full sm:w-auto">
          <Save className="size-4" /> Salvar simulação
        </Button>
      </div>

      <div className="grid gap-3 lg:grid-cols-[360px_1fr] lg:gap-4">
        <section className="card animate-fade-up h-fit p-5 lg:sticky lg:top-[84px]">
          <div className="flex items-center gap-2">
            <span className="grid size-7 place-items-center rounded-lg bg-mint/10 text-mint">
              <Sparkles className="size-3.5" />
            </span>
            <h3 className="text-[13.5px] font-semibold tracking-[-0.01em] text-text">Simulador</h3>
          </div>

          <div className="mt-5 space-y-5">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[11.5px] text-muted">Aporte inicial</span>
                <span className="font-mono text-[11.5px] font-medium text-text">
                  {formatCurrency(initial, currency)}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={50000}
                step={500}
                value={initial}
                onChange={(event) => setInitial(Number(event.target.value))}
                className="range"
                aria-label="Aporte inicial"
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[11.5px] text-muted">Aporte mensal</span>
                <span className="font-mono text-[11.5px] font-medium text-text">
                  {formatCurrency(monthly, currency)}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={5000}
                step={50}
                value={monthly}
                onChange={(event) => setMonthly(Number(event.target.value))}
                className="range"
                aria-label="Aporte mensal"
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[11.5px] text-muted">Rentabilidade anual</span>
                <span className="font-mono text-[11.5px] font-medium text-text">
                  {formatPercent(rate, 1)}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={20}
                step={0.1}
                value={rate}
                onChange={(event) => setRate(Number(event.target.value))}
                className="range"
                aria-label="Rentabilidade anual"
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[11.5px] text-muted">Prazo</span>
                <span className="font-mono text-[11.5px] font-medium text-text">
                  {years} {years === 1 ? "ano" : "anos"}
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={35}
                step={1}
                value={years}
                onChange={(event) => setYears(Number(event.target.value))}
                className="range"
                aria-label="Prazo em anos"
              />
            </div>
          </div>

          <div className="mt-6 border-t border-white/[0.055] pt-4">
            <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.14em] text-dim">
              Comparar com
            </p>
            <div className="flex flex-wrap gap-1.5">
              {PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => setRate(preset.rate)}
                  className={cn(
                    "rounded-md border px-2.5 py-1.5 text-[10.5px] font-medium transition",
                    rate === preset.rate
                      ? "border-mint/35 bg-mint/10 text-mint"
                      : "border-white/[0.08] text-dim hover:border-white/[0.16] hover:text-muted"
                  )}
                >
                  {preset.name}
                </button>
              ))}
            </div>
            <p className="mt-3 text-[9.5px] leading-relaxed text-dim">
              Taxas anuais apenas ilustrativas, baseadas em médias históricas. Não representam
              garantia de rentabilidade futura.
            </p>
          </div>
        </section>

        <div className="space-y-3 lg:space-y-4">
          <section className="card relative animate-fade-up overflow-hidden p-5 sm:p-6">
            <div
              className="pointer-events-none absolute -right-16 -top-24 size-64 rounded-full opacity-40 blur-3xl"
              style={{ background: "radial-gradient(circle, rgba(52,211,153,0.22), transparent 70%)" }}
            />
            <div className="relative">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-dim">
                    Montante em {years} {years === 1 ? "ano" : "anos"}
                  </p>
                  <p className="mt-2 font-mono text-[32px] font-semibold leading-none tracking-tight text-text sm:text-[38px]">
                    <CountUp value={result.final} format={(value) => formatCurrency(value, currency)} />
                  </p>
                  <p className="mt-2 max-w-md text-[11.5px] leading-relaxed text-muted">
                    {result.interest > result.invested
                      ? "Os juros já superam tudo o que você aportou. Esse é o poder do tempo."
                      : "A constância faz o efeito bola de neve acelerar. Continue aportando."}
                  </p>
                </div>
                <span className="rounded-full border border-mint/20 bg-mint/[0.07] px-2.5 py-1 font-mono text-[10px] text-mint">
                  +{formatPercent(interestShare)} em juros
                </span>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3 border-t border-white/[0.055] pt-4">
                <div>
                  <p className="text-[9.5px] uppercase tracking-wider text-dim">Investido</p>
                  <p className="mt-1 font-mono text-[13px] font-medium text-text">
                    {formatCurrency(result.invested, currency)}
                  </p>
                </div>
                <div>
                  <p className="text-[9.5px] uppercase tracking-wider text-dim">Juros</p>
                  <p className="mt-1 font-mono text-[13px] font-medium text-mint">
                    +{formatCurrency(result.interest, currency)}
                  </p>
                </div>
                <div>
                  <p className="text-[9.5px] uppercase tracking-wider text-dim">Aporte mensal</p>
                  <p className="mt-1 font-mono text-[13px] font-medium text-text">
                    {formatCurrency(monthly, currency)}
                  </p>
                </div>
              </div>

              <div className="mt-4 border-t border-white/[0.055] pt-4">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-[11.5px] font-medium text-muted">Evolução do patrimônio</h3>
                  <div className="flex items-center gap-3 text-[10px] text-dim">
                    <span className="flex items-center gap-1.5">
                      <span className="size-1.5 rounded-full bg-mint" /> Com juros
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="size-1.5 rounded-full bg-sky" /> Investido
                    </span>
                  </div>
                </div>
                <InvestmentChart data={result.points} currency={currency} />
              </div>
            </div>
          </section>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="card animate-fade-up flex items-start gap-3 p-4">
              <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-sky/10 text-sky">
                <Wallet className="size-4" />
              </span>
              <div>
                <p className="text-[11.5px] font-medium text-text">Total que sai do seu bolso</p>
                <p className="mt-1 font-mono text-[14px] font-semibold text-text">
                  {formatCurrency(result.invested, currency)}
                </p>
                <p className="mt-1 text-[10px] leading-relaxed text-dim">
                  {formatCurrency(initial, currency)} hoje + {formatCurrency(monthly, currency)} por{" "}
                  {months} meses.
                </p>
              </div>
            </div>
            <div className="card animate-fade-up flex items-start gap-3 p-4">
              <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-mint/10 text-mint">
                <TrendingUp className="size-4" />
              </span>
              <div>
                <p className="text-[11.5px] font-medium text-text">Rendimento estimado</p>
                <p className="mt-1 font-mono text-[14px] font-semibold text-mint">
                  {formatCurrency(result.interest, currency)}
                </p>
                <p className="mt-1 text-[10px] leading-relaxed text-dim">
                  Equivalente a{" "}
                  {formatPercent((Math.pow(result.final / Math.max(1, result.invested), 1 / Math.max(1, years)) - 1) * 100, 1)}{" "}
                  ao ano sobre o total aportado.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="card animate-fade-up p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="grid size-7 place-items-center rounded-lg bg-white/[0.04] text-muted">
              <PiggyBank className="size-3.5" />
            </span>
            <div>
              <h3 className="text-[13.5px] font-semibold tracking-[-0.01em] text-text">Simulações salvas</h3>
              <p className="text-[10.5px] text-dim">Seus planos para consultar quando quiser</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={openSave}>
            <Plus className="size-3.5" /> Salvar atual
          </Button>
        </div>

        {data!.simulations.length === 0 ? (
          <div className="mt-4 flex flex-col items-center rounded-xl border border-dashed border-white/[0.09] py-8 text-center">
            <Sparkles className="size-4 text-dim" />
            <p className="mt-2 text-[11.5px] text-muted">
              Salve uma simulação para comparar cenários depois.
            </p>
          </div>
        ) : (
          <div className="mt-4 grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
            {data!.simulations.map((simulation) => {
              const preview = simulateInvestment(
                simulation.initial,
                simulation.monthly,
                simulation.rate,
                simulation.months
              );
              return (
                <div
                  key={simulation.id}
                  className="group rounded-xl border border-white/[0.06] bg-white/[0.018] p-3.5 transition hover:border-white/[0.12] hover:bg-white/[0.03]"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-[12px] font-medium text-text">{simulation.name}</p>
                      <p className="mt-0.5 font-mono text-[10px] text-dim">
                        {formatCurrency(simulation.monthly, currency)}/mês ·{" "}
                        {Math.round(simulation.months / 12)} anos · {formatPercent(simulation.rate, 1)}
                      </p>
                    </div>
                    <button
                      onClick={() => setDeleting(simulation)}
                      aria-label={`Excluir ${simulation.name}`}
                      className="grid size-6 shrink-0 place-items-center rounded text-dim opacity-0 transition hover:bg-coral/10 hover:text-coral group-hover:opacity-100 focus:opacity-100"
                    >
                      <Trash2 className="size-3" />
                    </button>
                  </div>
                  <div className="mt-3 flex items-end justify-between gap-2">
                    <div>
                      <p className="text-[9px] uppercase tracking-wider text-dim">Montante</p>
                      <p className="mt-0.5 font-mono text-[15px] font-semibold text-mint">
                        {formatCurrency(preview.final, currency, { compact: true })}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => loadSimulation(simulation)}>
                      Carregar
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="animate-fade-up">
        <div className="mb-3 flex items-center gap-2">
          <BookOpen className="size-4 text-dim" />
          <h3 className="text-[13px] font-semibold tracking-[-0.01em] text-text">Aprenda em 1 minuto</h3>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {education.map((item) => (
            <div key={item.title} className="card p-4">
              <span
                className="grid size-8 place-items-center rounded-lg"
                style={{ backgroundColor: `${item.color}12`, color: item.color }}
              >
                <item.icon className="size-4" strokeWidth={1.9} />
              </span>
              <p className="mt-3 text-[12px] font-medium text-text">{item.title}</p>
              <p className="mt-1 text-[10.5px] leading-relaxed text-dim">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <Modal
        open={saveOpen}
        onClose={() => setSaveOpen(false)}
        title="Salvar simulação"
        description="Dê um nome para encontrar este cenário depois."
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setSaveOpen(false)} disabled={saving}>
              Cancelar
            </Button>
            <Button type="submit" form="save-simulation-form" loading={saving}>
              <Save className="size-3.5" /> Salvar
            </Button>
          </>
        }
      >
        <form id="save-simulation-form" onSubmit={handleSave} className="space-y-4">
          <FormField label="Nome da simulação">
            <input
              autoFocus
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="field"
              maxLength={48}
              placeholder="Ex.: Aposentadoria aos 50"
            />
          </FormField>
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-muted">Montante estimado</span>
              <span className="font-mono font-medium text-mint">
                {formatCurrency(result.final, currency)}
              </span>
            </div>
            <div className="mt-1.5 flex items-center justify-between text-[10.5px] text-dim">
              <span>
                {formatCurrency(monthly, currency)}/mês por {years} anos
              </span>
              <span>{formatPercent(rate, 1)} a.a.</span>
            </div>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        title="Excluir simulação?"
        description={`"${deleting?.name ?? ""}" será removida dos seus cenários salvos.`}
        confirmLabel="Excluir"
      />

      {saving && (
        <span className="sr-only">
          <Loader2 className="animate-spin" /> Salvando
        </span>
      )}
    </div>
  );
}
