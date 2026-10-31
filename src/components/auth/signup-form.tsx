"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";

function friendlyError(message: string) {
  if (/already registered|already exists/i.test(message))
    return "Este e-mail já tem uma conta. Tente entrar em vez de criar outra.";
  if (/password should be at least/i.test(message))
    return "A senha precisa ter pelo menos 6 caracteres.";
  if (/rate limit|too many/i.test(message))
    return "Muitas tentativas em pouco tempo. Aguarde um instante e tente de novo.";
  return message;
}

export function SignupForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    setLoading(true);
    setError(null);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { name: name.trim() },
        emailRedirectTo:
          typeof window !== "undefined" ? `${window.location.origin}/auth/callback` : undefined,
      },
    });

    if (signUpError) {
      setError(friendlyError(signUpError.message));
      setLoading(false);
      return;
    }

    if (data.session) {
      router.replace("/app");
      router.refresh();
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  if (success) {
    return (
      <div className="animate-fade-up text-center">
        <div className="mx-auto grid size-14 place-items-center rounded-2xl border border-mint/20 bg-mint/[0.08] text-mint">
          <CheckCircle2 className="size-6" />
        </div>
        <h1 className="mt-5 text-[24px] font-semibold tracking-tight text-text">
          Conta criada com sucesso
        </h1>
        <p className="mt-2 text-[12.5px] leading-relaxed text-muted">
          Enviamos um link de confirmação para{" "}
          <span className="font-medium text-text">{email}</span>. Abra o e-mail e clique no link
          para ativar sua conta.
        </p>
        <div className="mt-6 rounded-xl border border-white/[0.07] bg-white/[0.02] p-3.5 text-left">
          <p className="text-[10px] font-medium uppercase tracking-wider text-dim">Não recebeu?</p>
          <p className="mt-1 text-[11px] leading-relaxed text-muted">
            Confira a pasta de spam ou promoções. O link expira em 24 horas.
          </p>
        </div>
        <Link href="/login" className="mt-6 block">
          <Button variant="secondary" className="w-full">
            Voltar para o login
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-up">
      <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-[10px] font-medium text-muted">
        <span className="size-1.5 rounded-full bg-mint pulse-dot" />
        100% gratuito, sem cartão
      </span>
      <h1 className="mt-4 text-[26px] font-semibold leading-tight tracking-tight text-text">
        Crie sua conta
      </h1>
      <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted">
        Leva menos de um minuto para começar a enxergar seu dinheiro com clareza.
      </p>

      {!isSupabaseConfigured && (
        <div className="mt-5 rounded-xl border border-sand/20 bg-sand/[0.05] p-3.5">
          <p className="flex items-center gap-1.5 text-[11.5px] font-medium text-sand">
            <AlertTriangle className="size-3.5" /> Cadastro na nuvem ainda não configurado
          </p>
          <p className="mt-1 text-[10.5px] leading-relaxed text-sand/80">
            Conecte o Supabase para criar contas reais. Enquanto isso, explore o painel no modo
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
          <label htmlFor="name" className="mb-1.5 block text-[12px] font-medium text-muted">
            Como podemos te chamar?
          </label>
          <div className="relative">
            <User className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-dim" />
            <input
              id="name"
              autoComplete="name"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Seu primeiro nome"
              disabled={!isSupabaseConfigured}
              className="field h-11 pl-10"
              maxLength={60}
            />
          </div>
        </div>

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
              Crie uma senha
            </label>
            <span className="text-[10px] text-dim">mínimo de 6 caracteres</span>
          </div>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-dim" />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              minLength={6}
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
          {password.length > 0 && (
            <div className="mt-1.5 flex gap-1">
              {[0, 1, 2, 3].map((index) => (
                <span
                  key={index}
                  className={`h-0.5 flex-1 rounded-full transition-colors ${
                    password.length > index * 2 + 2
                      ? password.length >= 10
                        ? "bg-mint"
                        : "bg-sand"
                      : "bg-white/10"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        <Button
          type="submit"
          size="lg"
          loading={loading}
          disabled={!isSupabaseConfigured}
          className="w-full"
        >
          Criar minha conta <ArrowRight className="size-4" />
        </Button>
      </form>

      <div className="my-5 flex items-center gap-3">
        <span className="h-px flex-1 bg-white/[0.07]" />
        <span className="text-[10px] uppercase tracking-wider text-dim">ou</span>
        <span className="h-px flex-1 bg-white/[0.07]" />
      </div>

      <Link href="/app" className="block">
        <Button variant="secondary" size="lg" className="w-full">
          Ver o painel em demonstração
        </Button>
      </Link>

      <p className="mt-6 text-center text-[12px] text-muted">
        Já tem uma conta?{" "}
        <Link href="/login" className="font-medium text-mint transition hover:text-mint-soft">
          Entrar
        </Link>
      </p>

      <p className="mt-8 text-center text-[10px] leading-relaxed text-dim">
        Ao criar sua conta, você concorda com nossos termos de uso e política de privacidade.
        <br />
        Nunca compartilhamos seus dados financeiros.
      </p>
    </div>
  );
}
