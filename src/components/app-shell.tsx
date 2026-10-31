"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowLeftRight,
  LayoutDashboard,
  LogOut,
  PieChart,
  Settings,
  Sparkles,
  Target,
  TrendingUp,
  TriangleAlert,
  RefreshCw,
} from "lucide-react";
import type { ReactNode } from "react";
import { Logo } from "@/components/logo";
import { useApp } from "@/components/app-provider";
import { ToastProvider } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { cn, initials } from "@/lib/utils";

const navigation = [
  { href: "/app", label: "Visão geral", icon: LayoutDashboard },
  { href: "/app/transacoes", label: "Transações", icon: ArrowLeftRight },
  { href: "/app/orcamento", label: "Orçamento", icon: PieChart },
  { href: "/app/metas", label: "Metas", icon: Target },
  { href: "/app/investimentos", label: "Investimentos", icon: TrendingUp },
  { href: "/app/configuracoes", label: "Configurações", icon: Settings },
];

const mobileNavigation = navigation.filter(
  (item) => item.href !== "/app/configuracoes"
);

const pageMeta: Record<string, { title: string; subtitle: string }> = {
  "/app": { title: "Visão geral", subtitle: "Um panorama claro do seu mês" },
  "/app/transacoes": { title: "Transações", subtitle: "Cada real registrado no lugar certo" },
  "/app/orcamento": { title: "Orçamento", subtitle: "Limites que trabalham a seu favor" },
  "/app/metas": { title: "Metas", subtitle: "Planos grandes começam com aportes pequenos" },
  "/app/investimentos": { title: "Investimentos", subtitle: "Veja o tempo trabalhar por você" },
  "/app/configuracoes": { title: "Configurações", subtitle: "Seu perfil, sua moeda, seus dados" },
};

function isActive(pathname: string, href: string) {
  if (href === "/app") return pathname === "/app";
  return pathname.startsWith(href);
}

function Skeleton() {
  return (
    <div className="mx-auto max-w-[1280px] animate-fade-in px-4 py-8 sm:px-6 lg:px-10">
      <div className="mb-8 space-y-3">
        <div className="skeleton h-7 w-56 rounded-lg" />
        <div className="skeleton h-4 w-80 rounded-md" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map((item) => (
          <div key={item} className="skeleton h-[132px] rounded-2xl" />
        ))}
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <div className="skeleton h-[340px] rounded-2xl lg:col-span-2" />
        <div className="skeleton h-[340px] rounded-2xl" />
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { data, mode, error, ready, isDemo, signOut, refresh } = useApp();
  const meta = pageMeta[pathname] ?? pageMeta["/app"];
  const firstName = data?.profile.name.split(" ")[0] ?? "";

  return (
    <ToastProvider>
      <div className="min-h-dvh">
        <aside className="fixed inset-y-0 left-0 z-40 hidden w-[248px] flex-col border-r border-white/[0.055] bg-[#090b0f]/80 backdrop-blur-2xl lg:flex">
          <div className="px-5 pb-7 pt-6">
            <Logo href="/app" />
          </div>

          <nav className="flex-1 space-y-1 px-3">
            <p className="px-3 pb-2 text-[10px] font-medium uppercase tracking-[0.16em] text-dim">
              Seu painel
            </p>
            {navigation.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] transition-all duration-200",
                    active
                      ? "bg-white/[0.07] text-text shadow-[inset_0_1px_0_rgba(255,255,255,0.045)]"
                      : "text-muted hover:bg-white/[0.035] hover:text-text"
                  )}
                >
                  <item.icon
                    className={cn(
                      "size-[17px] transition-colors",
                      active ? "text-mint" : "text-dim group-hover:text-muted"
                    )}
                    strokeWidth={1.8}
                  />
                  <span className="font-medium">{item.label}</span>
                  {active && (
                    <span className="ml-auto size-1.5 rounded-full bg-mint shadow-[0_0_10px_2px_rgba(52,211,153,0.5)]" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="p-3">
            {isDemo && (
              <Link
                href="/app/configuracoes"
                className="mb-3 flex items-center gap-2 rounded-xl border border-sand/15 bg-sand/[0.05] px-3 py-2.5 text-[11px] leading-snug text-sand/90 transition hover:bg-sand/[0.09]"
              >
                <Sparkles className="size-3.5 shrink-0" />
                Modo demonstração — dados locais
              </Link>
            )}
            <div className="card rounded-xl p-3">
              <div className="flex items-center gap-2.5">
                <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-mint/25 to-sky/15 text-[11px] font-semibold text-mint">
                  {initials(data?.profile.name ?? "Finora")}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[12px] font-medium text-text">
                    {data?.profile.name ?? "Carregando"}
                  </p>
                  <p className="text-[10px] text-dim">Plano gratuito</p>
                </div>
                {mode === "cloud" ? (
                  <button
                    onClick={() => void signOut()}
                    title="Sair da conta"
                    aria-label="Sair da conta"
                    className="grid size-7 place-items-center rounded-md text-dim transition hover:bg-white/[0.07] hover:text-coral"
                  >
                    <LogOut className="size-3.5" />
                  </button>
                ) : (
                  <Link
                    href="/login"
                    title="Criar minha conta"
                    aria-label="Criar minha conta"
                    className="grid size-7 place-items-center rounded-md text-dim transition hover:bg-white/[0.07] hover:text-mint"
                  >
                    <Sparkles className="size-3.5" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </aside>

        <div className="lg:pl-[248px]">
          <header className="sticky top-0 z-30 border-b border-white/[0.055] bg-canvas/75 backdrop-blur-2xl">
            <div className="mx-auto flex h-[64px] max-w-[1280px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-10">
              <div className="flex items-center gap-3 lg:hidden">
                <Logo href="/app" />
                {isDemo && (
                  <span className="rounded-full border border-sand/20 bg-sand/[0.07] px-2 py-0.5 text-[9.5px] font-medium uppercase tracking-wider text-sand">
                    demo
                  </span>
                )}
              </div>

              <div className="hidden lg:block">
                <h1 className="text-[17px] font-semibold leading-tight tracking-[-0.02em] text-text">
                  {meta.title}
                  {firstName && pathname === "/app" && (
                    <span className="ml-2 font-normal text-dim">· {firstName}</span>
                  )}
                </h1>
                <p className="mt-1 text-[11.5px] leading-none text-muted">{meta.subtitle}</p>
              </div>

              <div className="flex items-center gap-2">
                {isDemo && (
                  <span className="hidden items-center gap-1.5 rounded-full border border-sand/20 bg-sand/[0.06] px-2.5 py-1 text-[10.5px] font-medium text-sand sm:inline-flex">
                    <span className="size-1.5 rounded-full bg-sand" />
                    Demonstração
                  </span>
                )}
                <Link
                  href="/app/configuracoes"
                  aria-label="Configurações"
                  className="grid size-8 place-items-center rounded-lg text-muted transition hover:bg-white/[0.06] hover:text-text"
                >
                  <Settings className="size-4" />
                </Link>
                <div className="grid size-8 place-items-center rounded-lg bg-gradient-to-br from-mint/25 to-sky/15 text-[10.5px] font-semibold text-mint">
                  {initials(data?.profile.name ?? "F")}
                </div>
              </div>
            </div>
          </header>

          <main className="mx-auto max-w-[1280px] px-4 pb-28 pt-5 sm:px-6 lg:px-10 lg:pb-14 lg:pt-7">
            {isDemo && (
              <div className="mb-5 flex flex-wrap items-center gap-x-2 gap-y-1 rounded-xl border border-sand/15 bg-sand/[0.05] px-3.5 py-2.5 text-[11.5px] leading-relaxed text-sand/90">
                <Sparkles className="size-3.5 shrink-0" />
                <span>
                  Você está explorando uma conta de demonstração. Os dados ficam apenas neste
                  navegador.
                </span>
                <Link
                  href="/login"
                  className="font-medium text-sand underline decoration-sand/30 underline-offset-2 hover:decoration-sand"
                >
                  Criar minha conta grátis
                </Link>
              </div>
            )}

            {error ? (
              <div className="card mx-auto mt-10 max-w-xl p-8 text-center">
                <div className="mx-auto grid size-12 place-items-center rounded-xl bg-coral/10 text-coral">
                  <TriangleAlert className="size-5" />
                </div>
                <h2 className="mt-4 text-[16px] font-semibold">Não conseguimos carregar seus dados</h2>
                <p className="mx-auto mt-2 max-w-sm text-[12.5px] leading-relaxed text-muted">
                  {error}
                </p>
                <div className="mt-5 flex justify-center gap-2">
                  <Button variant="secondary" onClick={refresh}>
                    <RefreshCw className="size-3.5" /> Tentar novamente
                  </Button>
                  <Button variant="ghost" onClick={() => void signOut()}>
                    Sair
                  </Button>
                </div>
              </div>
            ) : !ready ? (
              <Skeleton />
            ) : (
              <div className="animate-fade-in">{children}</div>
            )}
          </main>
        </div>

        <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/[0.07] bg-[#090b0f]/92 pb-[env(safe-area-inset-bottom)] backdrop-blur-2xl lg:hidden">
          <div className="grid grid-cols-5">
            {mobileNavigation.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium tracking-[-0.005em] transition",
                    active ? "text-mint" : "text-dim hover:text-muted"
                  )}
                >
                  <item.icon className="size-[18px]" strokeWidth={active ? 2.1 : 1.8} />
                  {item.label === "Visão geral" ? "Início" : item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </ToastProvider>
  );
}
