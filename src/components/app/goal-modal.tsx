"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form";
import { useApp } from "@/components/app-provider";
import { useToast } from "@/components/ui/toast";
import { addMonthsISO, currencySymbol, formatCurrency } from "@/lib/format";
import { COLOR_PALETTE } from "@/lib/icons";
import type { Goal } from "@/lib/types";
import { cn } from "@/lib/utils";

export function GoalModal({
  open,
  onClose,
  initial,
}: {
  open: boolean;
  onClose: () => void;
  initial?: Goal | null;
}) {
  const { data, addGoal, updateGoal } = useApp();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [saved, setSaved] = useState("");
  const [deadline, setDeadline] = useState(addMonthsISO(12));
  const [color, setColor] = useState("#34D399");
  const [saving, setSaving] = useState(false);

  const currency = data?.profile.currency ?? "BRL";
  const symbol = currencySymbol(currency);

  useEffect(() => {
    if (!open) return;
    if (initial) {
      setName(initial.name);
      setTarget(String(initial.target));
      setSaved(String(initial.saved));
      setDeadline(initial.deadline);
      setColor(initial.color);
    } else {
      setName("");
      setTarget("");
      setSaved("");
      setDeadline(addMonthsISO(12));
      setColor(COLOR_PALETTE[0]);
    }
  }, [open, initial]);

  const targetValue = Number(target.replace(",", "."));
  const savedValue = Number(saved.replace(",", "."));

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!name.trim()) {
      toast({ title: "Dê um nome para a sua meta", tone: "error" });
      return;
    }
    if (!Number.isFinite(targetValue) || targetValue <= 0) {
      toast({ title: "Informe um valor-alvo maior que zero", tone: "error" });
      return;
    }
    if (!deadline) {
      toast({ title: "Escolha um prazo para a meta", tone: "error" });
      return;
    }

    const payload = {
      name: name.trim(),
      target: targetValue,
      saved: Number.isFinite(savedValue) ? Math.max(0, savedValue) : 0,
      deadline,
      color,
    };

    setSaving(true);
    try {
      if (initial) {
        await updateGoal(initial.id, payload);
        toast({ title: "Meta atualizada", description: payload.name });
      } else {
        await addGoal(payload);
        toast({ title: "Meta criada", description: payload.name });
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

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initial ? "Editar meta" : "Nova meta"}
      description="Dê um nome ao seu próximo sonho e transforme-o em números."
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={saving}>
            Cancelar
          </Button>
          <Button type="submit" form="goal-form" loading={saving}>
            {initial ? "Salvar alterações" : "Criar meta"}
          </Button>
        </>
      }
    >
      <form id="goal-form" onSubmit={handleSubmit} className="space-y-4">
        <FormField label="Nome da meta">
          <input
            autoFocus
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Ex.: Reserva de emergência"
            className="field"
            maxLength={48}
          />
        </FormField>

        <div className="grid grid-cols-2 gap-3">
          <FormField label="Valor-alvo">
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-mono text-[12px] text-dim">
                {symbol}
              </span>
              <input
                value={target}
                onChange={(event) => setTarget(event.target.value)}
                inputMode="decimal"
                placeholder="0,00"
                className="field pl-9 font-mono"
              />
            </div>
          </FormField>
          <FormField label="Já tenho guardado">
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-mono text-[12px] text-dim">
                {symbol}
              </span>
              <input
                value={saved}
                onChange={(event) => setSaved(event.target.value)}
                inputMode="decimal"
                placeholder="0,00"
                className="field pl-9 font-mono"
              />
            </div>
          </FormField>
        </div>

        <FormField label="Prazo desejado">
          <input
            type="date"
            value={deadline}
            onChange={(event) => setDeadline(event.target.value)}
            className="field"
          />
        </FormField>

        <FormField label="Cor da meta">
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

        {targetValue > 0 && (
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-3.5 py-3">
            <p className="text-[10px] uppercase tracking-wider text-dim">Seu objetivo</p>
            <p className="mt-1 text-[12px] leading-relaxed text-muted">
              Guardar{" "}
              <span className="font-mono font-medium text-text">
                {formatCurrency(targetValue, currency)}
              </span>{" "}
              até{" "}
              <span className="text-text">
                {new Date(`${deadline}T12:00:00`).toLocaleDateString("pt-BR", {
                  month: "long",
                  year: "numeric",
                })}
              </span>
              .
            </p>
          </div>
        )}
      </form>
    </Modal>
  );
}
