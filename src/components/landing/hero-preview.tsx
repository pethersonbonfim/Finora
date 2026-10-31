"use client";

import {
  Area,
  AreaChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
} from "recharts";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Sparkles,
  Target,
  Wallet,
} from "lucide-react";

const series = [
  { month: "Jul", receitas: 7800, despesas: 6120 },
  { month: "Ago", receitas: 7800, despesas: 5740 },
  { month: "Set", receitas: 8650, despesas: 6390 },
  { month: "Out", receitas: 7800, despesas: 5520 },
  { month: "Nov", receitas: 9200, despesas: 6180 },
  { month: "Dez", receitas: 7800, despesas: 5958 },
];

const donut = [
  { name: "Moradia", value: 2280, color: "#34D399" },
  { name: "Alimentação", value: 1480, color: "#FBBF24" },
  { name: "Transporte", value: 420, color: "#60A5FA" },
  { name: "Lazer", value: 380, color: "#F472B6" },
  { name: "Outros", value: 640, color: "#A78BFA" },
];

const kpis = [
  {
    label: "Saldo do mês",
    value: "R$ 1.842",
    icon: Wallet,
    color: "#34D399",
    delta: "+12,4%",
  },
  {
    label: "Receitas",
    value: "R$ 7.800",
    icon: ArrowDownLeft,
    color: "#60A5FA",
    delta: "+4,1%",
  },
  {
    label: "Despesas",
    value: "R$ 5.958",
    icon: ArrowUpRight,
    color: "#FB7185",
    delta: "−8,2%",
  },
];

export function HeroPreview() {
  return (
    <div className="relative mx-auto max-w-5xl">
      <div className="pointer-events-none absolute -inset-x-16 -top-10 bottom-0 rounded-[40px] bg-[radial-gradient(60%_60%_at_50%_40%,rgba(52,211,153,0.13),transparent_70%)] blur-2xl" />

      <div className="group relative [perspective:1800px]">
        <div className="relative transition-transform duration-700 ease-out lg:[transform:rotateX(5deg)] lg:group-hover:[transform:rotateX(0deg)]">
          <div className="card rounded-2xl border-white/[0.09] bg-[#0b0d11]/95 p-2 shadow-[0_60px_120px_-50px_rgba(0,0,0,0.95)]">
            <div className="overflow-hidden rounded-xl border border-white/[0.055] bg-[#07090c]">
              <div className="flex h-9 items-center gap-2 border-b border-white/[0.05] px-3.5">
                <div className="flex gap-1.5">
                  <span className="size-2 rounded-full bg-white/10" />
                  <span className="size-2 rounded-full bg-white/10" />
                  <span className="size-2 rounded-full bg-white/10" />
                </div>
                <div className="ml-3 flex items-center gap-1.5 text-[10px] text-dim">
                  <span className="font-medium text-muted">finora</span>
                  <span>/</span>
                  <span className="font-medium text-muted">Visão geral</span>
                </div>
                <span className="ml-auto rounded-md border border-white/[0.07] bg-white/[0.03] px-2 py-0.5 text-[9.5px] text-dim">
                  Dezembro 2026
                </span>
              </div>

              <div className="p-3.5 sm:p-4">
                <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
                  {kpis.map((kpi) => (
                    <div
                      key={kpi.label}
                      className="rounded-lg border border-white/[0.055] bg-white/[0.018] p-2.5 sm:p-3"
                    >
                      <div className="flex items-center gap-1.5">
                        <span
                          className="grid size-5 place-items-center rounded-md"
                          style={{ backgroundColor: `${kpi.color}14`, color: kpi.color }}
                        >
                          <kpi.icon className="size-2.5" strokeWidth={2} />
                        </span>
                        <span className="truncate text-[8.5px] text-dim sm:text-[9.5px]">
                          {kpi.label}
                        </span>
                      </div>
                      <p className="mt-2 font-mono text-[12px] font-semibold tracking-tight text-text sm:text-[15px]">
                        {kpi.value}
                      </p>
                      <p
                        className={`mt-0.5 font-mono text-[8px] ${
                          kpi.label === "Despesas" ? "text-mint" : "text-mint"
                        }`}
                      >
                        {kpi.delta} vs. mês anterior
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-2.5 grid gap-2.5 sm:grid-cols-[1fr_215px]">
                  <div className="rounded-lg border border-white/[0.055] bg-white/[0.012] p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[9.5px] font-medium text-muted">
                        Fluxo de caixa
                      </span>
                      <div className="flex items-center gap-2.5 text-[8px] text-dim">
                        <span className="flex items-center gap-1">
                          <span className="size-1 rounded-full bg-mint" /> Receitas
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="size-1 rounded-full bg-coral" /> Despesas
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 h-[138px] sm:h-[152px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={series}
                          margin={{ top: 6, right: 2, left: 2, bottom: 0 }}
                        >
                          <defs>
                            <linearGradient id="heroIncome" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#34D399" stopOpacity={0.35} />
                              <stop offset="100%" stopColor="#34D399" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="heroExpense" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#FB7185" stopOpacity={0.22} />
                              <stop offset="100%" stopColor="#FB7185" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <Area
                            type="monotone"
                            dataKey="receitas"
                            stroke="#34D399"
                            strokeWidth={1.6}
                            fill="url(#heroIncome)"
                            isAnimationActive={false}
                          />
                          <Area
                            type="monotone"
                            dataKey="despesas"
                            stroke="#FB7185"
                            strokeWidth={1.6}
                            fill="url(#heroExpense)"
                            isAnimationActive={false}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="hidden flex-col gap-2.5 sm:flex">
                    <div className="flex flex-1 items-center gap-2.5 rounded-lg border border-white/[0.055] bg-white/[0.012] p-3">
                      <div className="relative size-[86px] shrink-0">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={donut}
                              dataKey="value"
                              innerRadius={28}
                              outerRadius={41}
                              paddingAngle={2}
                              cornerRadius={3}
                              stroke="none"
                              startAngle={90}
                              endAngle={-270}
                              isAnimationActive={false}
                            >
                              {donut.map((entry) => (
                                <Cell key={entry.name} fill={entry.color} />
                              ))}
                            </Pie>
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 grid place-items-center">
                          <span className="font-mono text-[9px] font-medium text-text">R$ 5,2k</span>
                        </div>
                      </div>
                      <div className="min-w-0 flex-1 space-y-1">
                        {donut.slice(0, 3).map((item) => (
                          <div key={item.name} className="flex items-center gap-1.5">
                            <span
                              className="size-1 shrink-0 rounded-full"
                              style={{ backgroundColor: item.color }}
                            />
                            <span className="truncate text-[8px] text-dim">{item.name}</span>
                            <span className="ml-auto font-mono text-[8px] text-muted">
                              {Math.round((item.value / 5200) * 100)}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-lg border border-white/[0.055] bg-white/[0.012] p-2.5">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="size-2.5 text-mint" />
                        <span className="text-[8px] font-medium text-muted">Insight</span>
                      </div>
                      <p className="mt-1 text-[8px] leading-relaxed text-dim">
                        Você guardou <span className="text-mint">23,5%</span> da renda. Melhor que
                        no mês passado.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-2.5 hidden items-center gap-2 rounded-lg border border-white/[0.055] bg-white/[0.012] px-3 py-2 md:flex">
                  <span className="grid size-5 place-items-center rounded-md bg-mint/10 text-mint">
                    <Target className="size-2.5" />
                  </span>
                  <span className="text-[8.5px] text-muted">Reserva de emergência</span>
                  <span className="ml-auto h-1 w-24 overflow-hidden rounded-full bg-white/[0.06]">
                    <span className="block h-full w-[68%] rounded-full bg-mint" />
                  </span>
                  <span className="font-mono text-[8px] text-dim">68%</span>
                  <span className="ml-2 text-[8px] text-dim">R$ 12.400 de R$ 18.000</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card absolute -right-3 top-10 hidden items-center gap-2.5 rounded-xl px-3.5 py-2.5 shadow-2xl xl:flex">
          <span className="grid size-8 place-items-center rounded-lg bg-mint/10 text-[10px] font-semibold text-mint">
            68%
          </span>
          <div>
            <p className="text-[9px] uppercase tracking-wider text-dim">Meta</p>
            <p className="text-[10.5px] font-medium text-text">Reserva de emergência</p>
          </div>
        </div>

        <div className="card absolute -left-4 bottom-12 hidden rounded-xl px-3.5 py-2.5 shadow-2xl xl:block">
          <p className="text-[9px] uppercase tracking-wider text-dim">Economia no mês</p>
          <p className="mt-0.5 font-mono text-[14px] font-semibold text-mint">+ R$ 1.842</p>
        </div>
      </div>
    </div>
  );
}
