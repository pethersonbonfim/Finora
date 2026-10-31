"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertTriangle, ArrowRight, Eye, EyeOff, Lock, Mail, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";

function friendlyError(message: string) {
  if (/invalid login credentials/i.test(message))
    return "E-mail ou senha incorretos. Confira os dados e tente novamente.";
  if (/email not confirmed/i.test(message))
    return "Seu e-mail ainda não foi confirmado. Confira sua caixa de entrada.";
  if (/rate limit|too many/i.test(message))
    return "Muitas tentativas em pouco tempo. Aguarde um instante e tente de novo.";
  return message;
}

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    setLoading(true);
    setError(null);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (signInError) {
      setError(friendlyError(signInError.message));
      setLoading(false);
      return;
    }

    router.replace("/app");
    router.refresh();
  }

  return (
    <div className="animate-fade-up">
      <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-[10px] font-medium text-muted">
        <span className="size-1.5 rounded-full bg-mint pulse-dot" />
        Bem-vindo de volta
      </span>
      <h1 className="mt-4 text-[26px] font-semibold leading-tight tracking-tight text-text">
        Entre na sua conta
      </h1>
      <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted">
        Continue de onde parou. Seus dados estão esperando por você.
      </p>

      {!isSupabaseConfigured && (
        <div className="mt-5 rounded-xl border border-sand/20 bg-sand/[0.05] p-3.5">
          <p className="flex items-center gap-1.5 text-[11.5px] font-medium text-sand">
            <AlertTriangle className="size-3.5" /> Login na nuvem ainda não configurado
          </p>
          <p className="mt-1 text-[10.5px] leading-relaxed text-sand/80">
            Conecte o Supabase para criar sua conta real. Enquanto isso, explore tudo no modo
            demonstração.
          </p>
        </div>
      )}

      {error && (
        <div className="mt-5 flex items-start gap-2 rounded-xl border border-coral/20 bg-coral/[0.06] px-3.5 py-3">
          <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-coral" />
          <p className="text-[11.5px] leading-relaxed text-coral">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="email" className="mb-1.5 block text-[12px] font-medium text-muted">
            E-mail
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-dim" />
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="voce@email.com"
              disabled={!isSupabaseConfigured}
              className="field h-11 pl-10"
            />
          </div>
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor="password" className="text-[12px] font-medium text-muted">
              Senha
            </label>
            <span className="text-[10px] text-dim">mínimo de 6 caracteres</span>
          </div>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-dim" />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              disabled={!isSupabaseConfigured}
              className="field h-11 px-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-dim transition hover:text-muted"
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          size="lg"
          loading={loading}
          disabled={!isSupabaseConfigured}
          className="w-full"
        >
          Entrar <ArrowRight className="size-4" />
        </Button>
      </form>

      <div className="my-5 flex items-center gap-3">
        <span className="h-px flex-1 bg-white/[0.07]" />
        <span className="text-[10px] uppercase tracking-wider text-dim">ou</span>
        <span className="h-px flex-1 bg-white/[0.07]" />
      </div>

      <Link href="/app" className="block">
        <Button variant="secondary" size="lg" className="w-full">
          <Sparkles className="size-4" /> Explorar demonstração
        </Button>
      </Link>

      <p className="mt-6 text-center text-[12px] text-muted">
        Ainda não tem conta?{" "}
        <Link href="/cadastro" className="font-medium text-mint transition hover:text-mint-soft">
          Criar conta grátis
        </Link>
      </p>

      <p className="mt-8 text-center text-[10px] leading-relaxed text-dim">
        Ao entrar, você concorda com nossos termos de uso e política de privacidade.
        <br />
        Seus dados financeiros são privados e criptografados.
      </p>
    </div>
  );
}
