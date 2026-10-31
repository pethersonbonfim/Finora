"use client";

import { useEffect, useState } from "react";
import { ArrowDownLeft, ArrowUpRight, Check } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form";
import { useApp } from "@/components/app-provider";
import { useToast } from "@/components/ui/toast";
import { currencySymbol, todayISO } from "@/lib/format";
import type { Transaction, TxType } from "@/lib/types";
import { cn } from "@/lib/utils";

export function TransactionModal({
  open,
  onClose,
  initial,
  defaultType = "expense",
}: {
  open: boolean;
  onClose: () => void;
  initial?: Transaction | null;
  defaultType?: TxType;
}) {
  const { data, addTransaction, updateTransaction } = useApp();
  const { toast } = useToast();
  const [type, setType] = useState<TxType>(defaultType);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [date, setDate] = useState(todayISO());
  const [recurring, setRecurring] = useState(false);
  const [saving, setSaving] = useState(false);

  const categories = (data?.categories ?? []).filter((category) => category.kind === type);
  const symbol = currencySymbol(data?.profile.currency ?? "BRL");

  useEffect(() => {
    if (!open) return;
    if (initial) {
      setType(initial.type);
      setDescription(initial.description);
      setAmount(String(initial.amount));
      setCategoryId(initial.categoryId);
      setDate(initial.date);
      setRecurring(initial.recurring);
    } else {
      setType(defaultType);
      setDescription("");
      setAmount("");
      setDate(todayISO());
      setRecurring(false);
      const first = data?.categories.find((category) => category.kind === defaultType);
      setCategoryId(first?.id ?? "");
    }
  }, [open, initial, defaultType, data]);

  function handleTypeChange(next: TxType) {
    setType(next);
    const first = data?.categories.find((category) => category.kind === next);
    setCategoryId(first?.id ?? "");
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const parsedAmount = Number(amount.replace(",", "."));

    if (!description.trim()) {
      toast({ title: "Dê um nome para a transação", tone: "error" });
      return;
    }
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      toast({ title: "Informe um valor maior que zero", tone: "error" });
      return;
    }
    if (!categoryId) {
      toast({ title: "Escolha uma categoria", tone: "error" });
      return;
    }

    const payload = {
      description: description.trim(),
      amount: Math.round(parsedAmount * 100) / 100,
      type,
      categoryId,
      date,
      recurring,
    };

    setSaving(true);
    try {
      if (initial) {
        await updateTransaction(initial.id, payload);
        toast({ title: "Transação atualizada", description: payload.description });
      } else {
        await addTransaction(payload);
        toast({
          title: type === "income" ? "Receita registrada" : "Despesa registrada",
          description: payload.description,
        });
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
      title={initial ? "Editar transação" : "Nova transação"}
      description="Registre em segundos e mantenha seu panorama sempre atualizado."
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={saving}>
            Cancelar
          </Button>
          <Button type="submit" form="transaction-form" loading={saving}>
            {initial ? "Salvar alterações" : "Adicionar transação"}
          </Button>
        </>
      }
    >
      <form id="transaction-form" onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-1 rounded-xl border border-white/[0.07] bg-black/25 p-1">
          <button
            type="button"
            onClick={() => handleTypeChange("expense")}
            className={cn(
              "flex items-center justify-center gap-1.5 rounded-lg py-2 text-[12px] font-medium transition",
              type === "expense"
                ? "bg-coral/12 text-coral shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
                : "text-dim hover:text-muted"
            )}
          >
            <ArrowUpRight className="size-3.5" /> Despesa
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange("income")}
            className={cn(
              "flex items-center justify-center gap-1.5 rounded-lg py-2 text-[12px] font-medium transition",
              type === "income"
                ? "bg-mint/12 text-mint shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
                : "text-dim hover:text-muted"
            )}
          >
            <ArrowDownLeft className="size-3.5" /> Receita
          </button>
        </div>

        <FormField label="Descrição">
          <input
            autoFocus
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder={type === "expense" ? "Ex.: Mercado do mês" : "Ex.: Salário"}
            className="field"
            maxLength={80}
          />
        </FormField>

        <div className="grid grid-cols-2 gap-3">
          <FormField label="Valor">
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-mono text-[12px] text-dim">
                {symbol}
              </span>
              <input
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                inputMode="decimal"
                placeholder="0,00"
                className="field pl-9 font-mono"
              />
            </div>
          </FormField>
          <FormField label="Data">
            <input
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              className="field"
            />
          </FormField>
        </div>

        <FormField label="Categoria">
          <select
            value={categoryId}
            onChange={(event) => setCategoryId(event.target.value)}
            className="field"
          >
            <option value="">Selecione...</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </FormField>

        <button
          type="button"
          onClick={() => setRecurring((value) => !value)}
          className="flex w-full items-center justify-between rounded-xl border border-white/[0.07] bg-white/[0.02] px-3.5 py-3 text-left transition hover:bg-white/[0.04]"
        >
          <span>
            <span className="block text-[12.5px] font-medium text-text">Transação recorrente</span>
            <span className="mt-0.5 block text-[11px] text-dim">
              Marque gastos fixos como aluguel e assinaturas
            </span>
          </span>
          <span
            className={cn(
              "relative h-5 w-9 shrink-0 rounded-full transition",
              recurring ? "bg-mint" : "bg-white/10"
            )}
          >
            <span
              className={cn(
                "absolute top-0.5 grid size-4 place-items-center rounded-full bg-[#07100c] transition-all",
                recurring ? "left-[18px]" : "left-0.5"
              )}
            >
              {recurring && <Check className="size-2.5 text-mint" strokeWidth={3} />}
            </span>
          </span>
        </button>
      </form>
    </Modal>
  );
}
