import Link from "next/link";
import type { ReactNode } from "react";
import { Star } from "lucide-react";
import { Logo } from "@/components/logo";

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-[1fr_1.05fr]">
      <div className="flex flex-col px-5 py-6 sm:px-10 lg:px-14 xl:px-20">
        <Logo />
        <div className="flex flex-1 items-center py-10">
          <div className="mx-auto w-full max-w-[380px]">{children}</div>
        </div>
        <p className="text-[10px] text-dim">
          © 2026 Finora · Feito para dar clareza, não julgamento.
        </p>
      </div>

      <aside className="relative hidden overflow-hidden border-l border-white/[0.06] lg:flex">
        <div className="absolute inset-0 bg-[radial-gradient(900px_600px_at_70%_0%,rgba(52,211,153,0.13),transparent_60%),radial-gradient(700px_500px_at_10%_100%,rgba(96,165,250,0.09),transparent_65%)]" />
        <div className="grid-bg absolute inset-0 opacity-50" />

        <div className="relative z-10 flex w-full flex-col justify-center px-12 py-14 xl:px-20">
          <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-mint">
            Clareza financeira
          </p>
          <h2 className="mt-4 max-w-md text-[30px] font-semibold leading-[1.15] tracking-tight text-text xl:text-[34px]">
            Não é sobre ganhar mais.
            <span className="block text-gradient">É sobre enxergar melhor.</span>
          </h2>
          <p className="mt-4 max-w-sm text-[12.5px] leading-relaxed text-muted">
            Quando você vê para onde cada real vai, as decisões ficam simples — e o futuro
            deixa de ser um susto.
          </p>

          <div className="relative mt-10 max-w-[420px]">
            <div className="card noise relative -rotate-[1.4deg] p-5 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.9)]">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.14em] text-dim">Resumo do mês</p>
                  <p className="mt-1.5 font-mono text-[24px] font-semibold tracking-tight text-text">
                    R$ 8.420,00
                  </p>
                </div>
                <span className="rounded-md bg-mint/10 px-2 py-1 font-mono text-[10px] font-medium text-mint">
                  +18,4%
                </span>
              </div>

              <div className="mt-5 flex h-24 items-end gap-2">
                {[46, 62, 52, 78, 68, 92, 74].map((height, index) => (
                  <div key={index} className="flex-1">
                    <div
                      className="w-full rounded-t-[3px]"
                      style={{
                        height: `${height}%`,
                        background:
                          index === 5
                            ? "linear-gradient(180deg,#6ee7b7,#34d399)"
                            : "linear-gradient(180deg,rgba(52,211,153,0.45),rgba(52,211,153,0.06))",
                      }}
                    />
                  </div>
                ))}
              </div>

              <div className="mt-5 space-y-2.5 border-t border-white/[0.06] pt-4">
                {[
                  { name: "Moradia", value: "R$ 2.280", color: "#34D399" },
                  { name: "Alimentação", value: "R$ 980", color: "#FBBF24" },
                  { name: "Lazer", value: "R$ 420", color: "#F472B6" },
                ].map((row) => (
                  <div key={row.name} className="flex items-center gap-2.5">
                    <span
                      className="size-1.5 rounded-full"
                      style={{ backgroundColor: row.color }}
                    />
                    <span className="text-[11px] text-muted">{row.name}</span>
                    <span className="ml-auto font-mono text-[10.5px] text-text">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card absolute -right-5 -top-7 flex items-center gap-2.5 rounded-xl px-3 py-2.5 shadow-2xl">
              <span className="grid size-7 place-items-center rounded-lg bg-mint/10 text-[10px] font-semibold text-mint">
                68%
              </span>
              <div>
                <p className="text-[9.5px] uppercase tracking-wider text-dim">Meta</p>
                <p className="text-[10.5px] font-medium text-text">Reserva pronta</p>
              </div>
            </div>

            <div className="card absolute -bottom-6 -left-4 rounded-xl px-3 py-2.5 shadow-2xl">
              <p className="text-[9.5px] uppercase tracking-wider text-dim">Taxa de poupança</p>
              <p className="mt-0.5 font-mono text-[13px] font-semibold text-mint">23,5%</p>
            </div>
          </div>

          <div className="mt-14 flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-mint/30 to-sky/20 text-[11px] font-semibold text-mint">
              MC
            </div>
            <div>
              <div className="flex gap-0.5 text-sand">
                {[0, 1, 2, 3, 4].map((star) => (
                  <Star key={star} className="size-3 fill-current" />
                ))}
              </div>
              <p className="mt-1 max-w-xs text-[10.5px] leading-relaxed text-muted">
                “Finalmente entendi para onde meu salário ia. Em dois meses quitei o cartão.”
              </p>
              <p className="mt-0.5 text-[9.5px] text-dim">Marina C. · usando o Finora</p>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
