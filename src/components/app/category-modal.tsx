"use client";

import { useEffect, useState } from "react";
import { Check, Trash2 } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form";
import { useApp } from "@/components/app-provider";
import { useToast } from "@/components/ui/toast";
import { currencySymbol, formatCurrency } from "@/lib/format";
import { getCategoryIcon, ICON_OPTIONS, COLOR_PALETTE } from "@/lib/icons";
import type { Category, TxType } from "@/lib/types";
import { cn } from "@/lib/utils";

export function CategoryModal({
  open,
  onClose,
  initial,
  defaultKind = "expense",
  onRequestDelete,
}: {
  open: boolean;
  onClose: () => void;
  initial?: Category | null;
  defaultKind?: TxType;
  onRequestDelete?: (category: Category) => void;
}) {
  const { data, addCategory, updateCategory } = useApp();
  const { toast } = useToast();
  const currency = data?.profile.currency ?? "BRL";
  const symbol = currencySymbol(currency);
  const [name, setName] = useState("");
  const [kind, setKind] = useState<TxType>(defaultKind);
  const [icon, setIcon] = useState("wallet");
  const [color, setColor] = useState(COLOR_PALETTE[0]);
  const [budget, setBudget] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (initial) {
      setName(initial.name);
      setKind(initial.kind);
      setIcon(initial.icon);
      setColor(initial.color);
      setBudget(initial.budget > 0 ? String(initial.budget) : "");
    } else {
      setName("");
      setKind(defaultKind);
      setIcon(defaultKind === "income" ? "briefcase" : "wallet");
      setColor(COLOR_PALETTE[0]);
      setBudget("");
    }
  }, [open, initial, defaultKind]);

  const PreviewIcon = getCategoryIcon(icon);
  const budgetValue = Number(budget.replace(",", "."));

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!name.trim()) {
      toast({ title: "Dê um nome para a categoria", tone: "error" });
      return;
    }

    const payload = {
      name: name.trim(),
      kind,
      icon,
      color,
      budget: kind === "expense" && Number.isFinite(budgetValue) ? budgetValue : 0,
    };

    setSaving(true);
    try {
      if (initial) {
        await updateCategory(initial.id, payload);
        toast({ title: "Categoria atualizada", description: payload.name });
      } else {
        await addCategory(payload);
        toast({ title: "Categoria criada", description: payload.name });
      }
      onClose();
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

  const expenseKinds = (data?.categories ?? []).filter(
    (category) => category.kind === "expense"
  ).length;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initial ? "Editar categoria" : "Nova categoria"}
      description={
        initial
          ? "Ajuste o limite, o nome ou a aparência da categoria."
          : "Crie uma categoria que faça sentido para a sua vida."
      }
      footer={
        <>
          {initial && onRequestDelete && (
            <Button
              variant="ghost"
              className="mr-auto text-coral hover:bg-coral/10 hover:text-coral"
              onClick={() => onRequestDelete(initial)}
              disabled={saving || expenseKinds <= 1}
              title={
                expenseKinds <= 1 ? "Mantenha ao menos uma categoria de despesa" : undefined
              }
            >
              <Trash2 className="size-3.5" /> Excluir
            </Button>
          )}
          <Button variant="ghost" onClick={onClose} disabled={saving}>
            Cancelar
          </Button>
          <Button type="submit" form="category-form" loading={saving}>
            {initial ? "Salvar" : "Criar categoria"}
          </Button>
        </>
      }
    >
      <form id="category-form" onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] p-3">
          <span
            className="grid size-10 place-items-center rounded-xl"
            style={{ backgroundColor: `${color}16`, color }}
          >
            <PreviewIcon className="size-5" strokeWidth={1.8} />
          </span>
          <div className="min-w-0">
            <p className="truncate text-[13px] font-medium text-text">
              {name.trim() || "Sua nova categoria"}
            </p>
            <p className="text-[10.5px] text-dim">
              {kind === "expense"
                ? budgetValue > 0
                  ? `Limite de ${formatCurrency(budgetValue, currency)} por mês`
                  : "Sem limite definido"
                : "Categoria de receita"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-1 rounded-xl border border-white/[0.07] bg-black/25 p-1">
          <button
            type="button"
            onClick={() => setKind("expense")}
            className={cn(
              "rounded-lg py-1.5 text-[11.5px] font-medium transition",
              kind === "expense" ? "bg-white/[0.08] text-text" : "text-dim hover:text-muted"
            )}
          >
            Despesa
          </button>
          <button
            type="button"
            onClick={() => setKind("income")}
            className={cn(
              "rounded-lg py-1.5 text-[11.5px] font-medium transition",
              kind === "income" ? "bg-white/[0.08] text-text" : "text-dim hover:text-muted"
            )}
          >
            Receita
          </button>
        </div>

        <FormField label="Nome">
          <input
            autoFocus
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Ex.: Pets, Viagens, Moradia"
            className="field"
            maxLength={32}
          />
        </FormField>

        {kind === "expense" && (
          <FormField label="Limite mensal" hint="Deixe em branco para definir depois.">
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-mono text-[12px] text-dim">
                {symbol}
              </span>
              <input
                value={budget}
                onChange={(event) => setBudget(event.target.value)}
                inputMode="decimal"
                placeholder="0,00"
                className="field pl-9 font-mono"
              />
            </div>
          </FormField>
        )}

        <FormField label="Ícone">
          <div className="grid grid-cols-7 gap-1.5">
            {ICON_OPTIONS.slice(0, 21).map((option) => {
              const Icon = getCategoryIcon(option);
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => setIcon(option)}
                  aria-label={option}
                  className={cn(
                    "grid aspect-square place-items-center rounded-lg border transition",
                    icon === option
                      ? "border-mint/40 bg-mint/10 text-mint"
                      : "border-transparent bg-white/[0.03] text-dim hover:bg-white/[0.06] hover:text-muted"
                  )}
                >
                  <Icon className="size-4" strokeWidth={1.8} />
                </button>
              );
            })}
          </div>
        </FormField>

        <FormField label="Cor">
          <div className="flex flex-wrap gap-2">
            {COLOR_PALETTE.map((option) => (
              <button
                key={option}
                type="button"
                aria-label={`Cor ${option}`}
                onClick={() => setColor(option)}
                className={cn(
                  "grid size-7 place-items-center rounded-full transition hover:scale-110",
                  color === option && "ring-2 ring-white/40 ring-offset-2 ring-offset-[#0f1115]"
                )}
                style={{ backgroundColor: option }}
              >
                {color === option && <Check className="size-3.5 text-black/70" strokeWidth={3} />}
              </button>
            ))}
          </div>
        </FormField>
      </form>
    </Modal>
  );
}
