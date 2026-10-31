"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Check,
  Cloud,
  Copy,
  Database,
  Download,
  LogOut,
  Mail,
  ShieldCheck,
  Sparkles,
  Trash2,
  User,
  Wallet,
} from "lucide-react";
import { useApp } from "@/components/app-provider";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useToast } from "@/components/ui/toast";
import { CURRENCIES, formatCurrency } from "@/lib/format";
import { initials } from "@/lib/utils";

const ENV_SNIPPET = `NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon`;

export default function SettingsPage() {
  const {
    data,
    mode,
    isDemo,
    configured,
    updateProfile,
    signOut,
    resetDemo,
    clearData,
    exportData,
  } = useApp();
  const { toast } = useToast();

  const profile = data!.profile;
  const [name, setName] = useState(profile.name);
  const [income, setIncome] = useState(
    profile.monthlyIncome > 0 ? String(profile.monthlyIncome) : ""
  );
  const [currency, setCurrency] = useState(profile.currency);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [clearOpen, setClearOpen] = useState(false);

  useEffect(() => {
    setName(profile.name);
    setIncome(profile.monthlyIncome > 0 ? String(profile.monthlyIncome) : "");
    setCurrency(profile.currency);
  }, [profile.name, profile.monthlyIncome, profile.currency]);

  const incomeValue = Number(income.replace(",", "."));

  async function handleSave(event: React.FormEvent) {
    event.preventDefault();
    if (!name.trim()) {
      toast({ title: "Informe seu nome", tone: "error" });
      return;
    }
    setSaving(true);
    try {
      await updateProfile({
        name: name.trim(),
        currency,
        monthlyIncome: Number.isFinite(incomeValue) ? Math.max(0, incomeValue) : 0,
      });
      toast({
        title: "Perfil atualizado",
        description: "Suas preferências já estão valendo em todo o painel.",
      });
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

  function handleExport() {
    const payload = exportData();
    if (!payload) return;
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `finora-dados-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    toast({
      title: "Backup exportado",
      description: "O arquivo JSON foi baixado com todos os seus dados.",
    });
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(ENV_SNIPPET);
      setCopied(true);
      toast({ title: "Variáveis copiadas", tone: "info" });
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      toast({ title: "Não foi possível copiar", tone: "error" });
    }
  }

  async function handleClear() {
    try {
      await clearData();
      toast({
        title: "Dados apagados",
        description: "Transações, metas e simulações foram removidas.",
      });
      setClearOpen(false);
    } catch (error) {
      toast({
        title: "Não foi possível apagar",
        description: error instanceof Error ? error.message : "Tente novamente.",
        tone: "error",
      });
    }
  }

  return (
    <div className="space-y-4">
      <div className="animate-fade-up">
        <p className="text-[10.5px] font-medium uppercase tracking-[0.16em] text-dim">
          Sua conta
        </p>
        <h2 className="mt-2 text-[26px] font-semibold leading-[1.15] tracking-[-0.03em] sm:text-[30px]">
          Configurações
        </h2>
        <p className="mt-1.5 text-[12.5px] text-muted">
          Ajuste o Finora para que ele fale a sua língua.
        </p>
      </div>

      <div className="grid gap-3 lg:grid-cols-3 lg:gap-4">
        <div className="space-y-3 lg:col-span-2 lg:space-y-4">
          <form onSubmit={handleSave} className="card animate-fade-up p-5">
            <div className="flex items-center gap-2">
              <span className="grid size-7 place-items-center rounded-lg bg-mint/10 text-mint">
                <User className="size-3.5" />
              </span>
              <div>
                <h3 className="text-[13.5px] font-semibold tracking-[-0.01em] text-text">Perfil</h3>
                <p className="text-[10.5px] text-dim">Como você aparece e como calculamos tudo</p>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-3.5">
              <div className="grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-mint/25 to-sky/15 text-[17px] font-semibold text-mint">
                {initials(name || "Finora")}
              </div>
              <div>
                <p className="text-[13px] font-medium text-text">{name || "Seu nome"}</p>
                <p className="mt-0.5 flex items-center gap-1 text-[10.5px] text-dim">
                  {mode === "cloud" ? (
                    <>
                      <Cloud className="size-3" /> Sincronizado na nuvem
                    </>
                  ) : (
                    <>
                      <Sparkles className="size-3" /> Modo demonstração local
                    </>
                  )}
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <FormField label="Nome">
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="field"
                  maxLength={60}
                  placeholder="Seu nome"
                />
              </FormField>

              <FormField label="E-mail" hint="O e-mail está vinculado ao seu login.">
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-dim" />
                  <input
                    value={profile.email}
                    readOnly
                    className="field cursor-not-allowed pl-9 text-muted"
                  />
                </div>
              </FormField>

              <FormField label="Moeda">
                <select
                  value={currency}
                  onChange={(event) => setCurrency(event.target.value)}
                  className="field"
                >
                  {CURRENCIES.map((item) => (
                    <option key={item.code} value={item.code}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField
                label="Renda mensal"
                hint="Usada na taxa de poupança e nas sugestões de orçamento."
              >
                <div className="relative">
                  <Wallet className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-dim" />
                  <input
                    value={income}
                    onChange={(event) => setIncome(event.target.value)}
                    inputMode="decimal"
                    placeholder="0,00"
                    className="field pl-9 font-mono"
                  />
                </div>
              </FormField>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.055] pt-4">
              <p className="text-[10.5px] text-dim">
                {Number.isFinite(incomeValue) && incomeValue > 0
                  ? `Renda de ${formatCurrency(incomeValue, currency)} por mês.`
                  : "Informe sua renda para desbloquear sugestões personalizadas."}
              </p>
              <Button type="submit" loading={saving} size="sm">
                Salvar alterações
              </Button>
            </div>
          </form>

          <section className="card animate-fade-up p-5">
            <div className="flex items-center gap-2">
              <span className="grid size-7 place-items-center rounded-lg bg-sky/10 text-sky">
                <ShieldCheck className="size-3.5" />
              </span>
              <div>
                <h3 className="text-[13.5px] font-semibold tracking-[-0.01em] text-text">Dados e privacidade</h3>
                <p className="text-[10.5px] text-dim">Você é dono dos seus números</p>
              </div>
            </div>

            <div className="mt-4 divide-y divide-white/[0.05]">
              <div className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div>
                  <p className="text-[12px] font-medium text-text">Exportar meus dados</p>
                  <p className="mt-0.5 text-[10.5px] text-dim">
                    Baixe um backup completo em JSON, a qualquer momento.
                  </p>
                </div>
                <Button variant="secondary" size="sm" onClick={handleExport}>
                  <Download className="size-3.5" /> Exportar
                </Button>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div>
                  <p className="text-[12px] font-medium text-text">Apagar lançamentos e metas</p>
                  <p className="mt-0.5 text-[10.5px] text-dim">
                    Mantém seu perfil e categorias, mas zera o histórico.
                  </p>
                </div>
                <Button variant="danger" size="sm" onClick={() => setClearOpen(true)}>
                  <Trash2 className="size-3.5" /> Apagar dados
                </Button>
              </div>

              {isDemo && (
                <div className="flex flex-wrap items-center justify-between gap-3 py-3">
                  <div>
                    <p className="text-[12px] font-medium text-text">Restaurar demonstração</p>
                    <p className="mt-0.5 text-[10.5px] text-dim">
                      Volte aos dados de exemplo originais para explorar de novo.
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      resetDemo();
                      toast({ title: "Demonstração restaurada", tone: "info" });
                    }}
                  >
                    Restaurar
                  </Button>
                </div>
              )}
            </div>
          </section>

          {!configured && (
            <section className="card animate-fade-up p-5">
              <div className="flex items-start gap-2.5">
                <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-violet/10 text-violet">
                  <Database className="size-4" />
                </span>
                <div>
                  <h3 className="text-[13.5px] font-semibold tracking-[-0.01em] text-text">Conecte o banco na nuvem</h3>
                  <p className="mt-0.5 text-[10.5px] leading-relaxed text-dim">
                    O site está pronto e funcionando em modo local. Para login real e dados
                    sincronizados entre dispositivos, conecte um projeto Supabase gratuito.
                  </p>
                </div>
              </div>

              <ol className="mt-4 space-y-2.5 text-[11.5px] leading-relaxed text-muted">
                <li className="flex gap-2.5">
                  <span className="grid size-5 shrink-0 place-items-center rounded-md bg-white/[0.06] font-mono text-[9.5px] text-dim">
                    1
                  </span>
                  Crie um projeto gratuito em supabase.com e abra o SQL Editor.
                </li>
                <li className="flex gap-2.5">
                  <span className="grid size-5 shrink-0 place-items-center rounded-md bg-white/[0.06] font-mono text-[9.5px] text-dim">
                    2
                  </span>
                  Rode o arquivo <code className="text-mint">supabase/schema.sql</code> deste
                  projeto.
                </li>
                <li className="flex gap-2.5">
                  <span className="grid size-5 shrink-0 place-items-center rounded-md bg-white/[0.06] font-mono text-[9.5px] text-dim">
                    3
                  </span>
                  Copie a URL e a chave anon em Project Settings → API e cole no{" "}
                  <code className="text-mint">.env.local</code>.
                </li>
              </ol>

              <div className="relative mt-3">
                <pre className="overflow-x-auto rounded-xl border border-white/[0.06] bg-black/40 p-3.5 pr-11 font-mono text-[10.5px] leading-relaxed text-muted">
                  {ENV_SNIPPET}
                </pre>
                <button
                  onClick={handleCopy}
                  aria-label="Copiar variáveis"
                  className="absolute right-2.5 top-2.5 grid size-7 place-items-center rounded-md border border-white/[0.08] bg-white/[0.04] text-dim transition hover:text-mint"
                >
                  {copied ? <Check className="size-3.5 text-mint" /> : <Copy className="size-3.5" />}
                </button>
              </div>

              <p className="mt-3 text-[10.5px] leading-relaxed text-dim">
                Reinicie o servidor depois de salvar o arquivo. O modo demonstração continua
                disponível enquanto o banco não estiver configurado.
              </p>
            </section>
          )}
        </div>

        <div className="space-y-3 lg:space-y-4">
          <section className="card animate-fade-up p-5">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-[13.5px] font-semibold tracking-[-0.01em] text-text">Sua conta</h3>
              <span
                className={`rounded-full border px-2 py-0.5 text-[9.5px] font-medium uppercase tracking-wider ${
                  mode === "cloud"
                    ? "border-mint/20 bg-mint/[0.07] text-mint"
                    : "border-sand/20 bg-sand/[0.07] text-sand"
                }`}
              >
                {mode === "cloud" ? "nuvem" : "demo"}
              </span>
            </div>

            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-2.5">
                <Mail className="size-3.5 text-dim" />
                <span className="truncate text-[11.5px] text-muted">
                  {profile.email || "sem e-mail"}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="size-3.5 text-dim" />
                <span className="text-[11.5px] text-muted">
                  {mode === "cloud"
                    ? "Dados protegidos por RLS, só você acessa"
                    : "Dados salvos apenas neste navegador"}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Cloud className="size-3.5 text-dim" />
                <span className="text-[11.5px] text-muted">
                  {mode === "cloud"
                    ? "Sincronização automática entre dispositivos"
                    : "Nenhum dado sai deste dispositivo"}
                </span>
              </div>
            </div>

            <div className="mt-4 border-t border-white/[0.055] pt-4">
              {mode === "cloud" ? (
                <Button variant="secondary" size="sm" className="w-full" onClick={() => void signOut()}>
                  <LogOut className="size-3.5" /> Sair da conta
                </Button>
              ) : (
                <Link href="/cadastro" className="block">
                  <Button size="sm" className="w-full">
                    <Sparkles className="size-3.5" /> Criar minha conta grátis
                  </Button>
                </Link>
              )}
            </div>
          </section>

          <section className="card animate-fade-up p-5">
            <h3 className="text-[13.5px] font-semibold tracking-[-0.01em] text-text">Sobre o Finora</h3>
            <p className="mt-2 text-[11px] leading-relaxed text-dim">
              Um assistente financeiro pessoal feito para dar clareza, não para julgar. Seus
              dados são seus — e continuarão sendo.
            </p>
            <div className="mt-4 space-y-2 border-t border-white/[0.055] pt-3 text-[10.5px] text-dim">
              <div className="flex justify-between">
                <span>Versão</span>
                <span className="font-mono text-muted">1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span>Plano</span>
                <span className="text-muted">Gratuito para sempre</span>
              </div>
              <div className="flex justify-between">
                <span>Idioma</span>
                <span className="text-muted">Português (BR)</span>
              </div>
            </div>
          </section>
        </div>
      </div>

      <ConfirmDialog
        open={clearOpen}
        onClose={() => setClearOpen(false)}
        onConfirm={handleClear}
        title="Apagar todos os seus dados?"
        description="Todas as transações, metas e simulações serão removidas permanentemente. Seu perfil e suas categorias continuam. Considere exportar um backup antes."
        confirmLabel="Apagar tudo"
      />
    </div>
  );
}
