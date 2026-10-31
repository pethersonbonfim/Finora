import Link from "next/link";
import {
  ArrowRight,
  Check,
  ChevronDown,
  LayoutDashboard,
  LineChart,
  ListPlus,
  LockKeyhole,
  PieChart,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Wallet,
  Zap,
} from "lucide-react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { HeroPreview } from "@/components/landing/hero-preview";

const navLinks = [
  { href: "#recursos", label: "Recursos" },
  { href: "#como-funciona", label: "Como funciona" },
  { href: "#investimentos", label: "Investimentos" },
  { href: "#faq", label: "Dúvidas" },
];

const stats = [
  { value: "R$ 12,4 mi", label: "organizados por nossos usuários" },
  { value: "+2.400", label: "pessoas com mais clareza" },
  { value: "4,9/5", label: "avaliação média" },
  { value: "100%", label: "gratuito, para sempre" },
];

const testimonials = [
  {
    name: "Marina Costa",
    role: "Designer · São Paulo",
    initials: "MC",
    color: "#34D399",
    quote:
      "Eu ganhava bem e nunca sobrava nada. Em dois meses usando o Finora quitei o cartão e comecei minha reserva. Ver os gráficos muda tudo.",
  },
  {
    name: "Rafael Lima",
    role: "Professor · Belo Horizonte",
    initials: "RL",
    color: "#60A5FA",
    quote:
      "O simulador de investimentos foi o que me conquistou. Coloquei R$ 300 por mês e vi o quanto isso vira em 20 anos. Abriu meus olhos.",
  },
  {
    name: "Camila Souza",
    role: "Empreendedora · Recife",
    initials: "CS",
    color: "#A78BFA",
    quote:
      "Finalmente um app bonito que não me faz sentir culpada. Os insights são gentis e certeiros. Meu marido também usa — cada um com sua conta.",
  },
];

const faqs = [
  {
    q: "O Finora é realmente grátis?",
    a: "Sim. O plano gratuito inclui dashboard completo, transações ilimitadas, orçamento, metas e simulador de investimentos. Sem cartão de crédito, sem período de teste e sem anúncios.",
  },
  {
    q: "Meus dados financeiros estão seguros?",
    a: "Sim. Cada conta é isolada por políticas de segurança no banco de dados (Row Level Security), então ninguém além de você acessa seus lançamentos. Você pode exportar tudo em JSON ou apagar quando quiser.",
  },
  {
    q: "Preciso conectar minha conta bancária?",
    a: "Não. Você registra suas receitas e despesas manualmente — leva segundos e mantém você consciente do que gasta. Nada de acesso ao seu banco.",
  },
  {
    q: "Funciona no celular?",
    a: "Sim, o painel foi desenhado para funcionar perfeitamente em celular, tablet e computador. A navegação muda para uma barra inferior no celular.",
  },
  {
    q: "Posso testar antes de criar uma conta?",
    a: "Pode. A demonstração abre o painel com dados de exemplo, sem pedir cadastro. Tudo o que você fizer fica salvo apenas no seu navegador.",
  },
];

function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
}: {
  eyebrow: string;
  title: React.ReactNode;
  description?: string;
  align?: "center" | "left";
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-xl"}>
      <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.025] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-mint">
        <Sparkles className="size-3" /> {eyebrow}
      </span>
      <h2 className="mt-4 text-[28px] font-semibold leading-[1.15] tracking-tight text-text sm:text-[36px]">
        {title}
      </h2>
      {description && (
        <p className="mt-3 text-[13px] leading-relaxed text-muted sm:text-[13.5px]">
          {description}
        </p>
      )}
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="overflow-x-hidden">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.055] bg-canvas/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-5 sm:px-8">
          <Logo />

          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-2 text-[12.5px] font-medium text-muted transition hover:bg-white/[0.04] hover:text-text"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/login" className="hidden sm:block">
              <Button variant="ghost" size="sm">
                Entrar
              </Button>
            </Link>
            <Link href="/cadastro">
              <Button size="sm">
                Começar grátis <ArrowRight className="size-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section className="relative overflow-hidden pb-10 pt-32 sm:pb-16 sm:pt-40">
          <div className="grid-bg absolute inset-x-0 top-0 h-[620px] opacity-70" />
          <div className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-[500px] max-w-4xl bg-[radial-gradient(50%_50%_at_50%_0%,rgba(52,211,153,0.16),transparent_75%)] blur-2xl" />

          <div className="relative mx-auto max-w-7xl px-5 text-center sm:px-8">
            <Link
              href="/app"
              className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-white/[0.09] bg-white/[0.035] py-1 pl-1 pr-3 text-[11px] text-muted transition hover:border-mint/25 hover:bg-mint/[0.05] hover:text-text"
            >
              <span className="rounded-full bg-mint/12 px-2 py-0.5 text-[9.5px] font-semibold uppercase tracking-wider text-mint">
                Novo
              </span>
              Insights automáticos com base nos seus gastos
              <ArrowRight className="size-3 text-dim" />
            </Link>

            <h1 className="animate-fade-up delay-1 mx-auto mt-6 max-w-4xl text-[38px] font-semibold leading-[1.04] tracking-[-0.03em] text-text sm:text-[58px] lg:text-[68px]">
              Seu dinheiro, finalmente
              <span className="text-gradient block">sob controle.</span>
            </h1>

            <p className="animate-fade-up delay-2 mx-auto mt-5 max-w-xl text-[13.5px] leading-relaxed text-muted sm:text-[15px]">
              O assistente financeiro que transforma salário, gastos e metas em um plano claro.
              Gráficos bonitos, decisões simples e zero julgamento.
            </p>

            <div className="animate-fade-up delay-3 mt-7 flex flex-col items-center justify-center gap-2.5 sm:flex-row">
              <Link href="/cadastro" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto">
                  Começar grátis <ArrowRight className="size-4" />
                </Button>
              </Link>
              <Link href="/app" className="w-full sm:w-auto">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  <LayoutDashboard className="size-4" /> Ver demonstração
                </Button>
              </Link>
            </div>

            <div className="animate-fade-up delay-4 mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-5">
              <div className="flex items-center gap-2.5">
                <div className="flex -space-x-2">
                  {[
                    { initials: "MC", color: "from-mint/40 to-mint/10 text-mint" },
                    { initials: "RL", color: "from-sky/40 to-sky/10 text-sky" },
                    { initials: "CS", color: "from-violet/40 to-violet/10 text-violet" },
                    { initials: "JP", color: "from-sand/40 to-sand/10 text-sand" },
                  ].map((avatar) => (
                    <span
                      key={avatar.initials}
                      className={`grid size-7 place-items-center rounded-full border border-canvas bg-gradient-to-br text-[8.5px] font-semibold ${avatar.color}`}
                    >
                      {avatar.initials}
                    </span>
                  ))}
                </div>
                <div className="text-left">
                  <div className="flex gap-0.5 text-sand">
                    {[0, 1, 2, 3, 4].map((star) => (
                      <Star key={star} className="size-2.5 fill-current" />
                    ))}
                  </div>
                  <p className="mt-0.5 text-[10px] text-dim">
                    4,9/5 · +2.400 pessoas com mais clareza
                  </p>
                </div>
              </div>
              <span className="hidden h-7 w-px bg-white/[0.08] sm:block" />
              <p className="flex items-center gap-1.5 text-[10px] text-dim">
                <LockKeyhole className="size-3" /> Sem cartão · dados criptografados
              </p>
            </div>

            <div className="animate-fade-up delay-5 mt-14 sm:mt-16">
              <HeroPreview />
            </div>
          </div>
        </section>

        {/* STATS */}
        <section className="border-y border-white/[0.055] bg-white/[0.012]">
          <div className="mx-auto grid max-w-6xl grid-cols-2 divide-y divide-white/[0.055] px-5 sm:grid-cols-4 sm:divide-x sm:divide-y-0 sm:px-8">
            {stats.map((stat) => (
              <div key={stat.label} className="px-4 py-7 text-center">
                <p className="font-mono text-[20px] font-semibold tracking-tight text-text sm:text-[24px]">
                  {stat.value}
                </p>
                <p className="mt-1 text-[10px] leading-snug text-dim">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FEATURES */}
        <section id="recursos" className="scroll-mt-24 px-5 py-20 sm:px-8 sm:py-28">
          <div className="mx-auto max-w-6xl">
            <SectionHeading
              eyebrow="Tudo em um só lugar"
              title={
                <>
                  A clareza que o seu salário
                  <span className="text-muted"> merece.</span>
                </>
              }
              description="Sem planilhas confusas, sem sete apps diferentes. Um painel só seu, que mostra o presente e ilumina o futuro."
            />

            <div className="mt-12 grid gap-4 lg:grid-cols-3">
              {/* dashboard */}
              <div className="card card-hover relative overflow-hidden p-6 lg:col-span-2">
                <div className="flex items-center gap-2.5">
                  <span className="grid size-8 place-items-center rounded-lg bg-mint/10 text-mint">
                    <LayoutDashboard className="size-4" />
                  </span>
                  <h3 className="text-[14px] font-semibold text-text">
                    Um painel que fala a sua língua
                  </h3>
                </div>
                <p className="mt-2 max-w-md text-[11.5px] leading-relaxed text-muted">
                  Saldo, receitas, despesas e taxa de poupança em cards claros. Compare meses e
                  entenda sua evolução em segundos.
                </p>

                <div className="mt-6 flex items-end gap-2 sm:gap-3">
                  {[38, 55, 44, 70, 58, 88, 72].map((height, index) => (
                    <div key={index} className="flex-1">
                      <div className="relative flex h-[96px] items-end overflow-hidden rounded-md bg-white/[0.02]">
                        <div
                          className="w-full rounded-t-[4px]"
                          style={{
                            height: `${height}%`,
                            background:
                              index === 5
                                ? "linear-gradient(180deg,#a7f3d0,#34d399)"
                                : "linear-gradient(180deg,rgba(52,211,153,0.5),rgba(52,211,153,0.08))",
                          }}
                        />
                      </div>
                      <p className="mt-1.5 text-center text-[8.5px] text-dim">
                        {["Jul", "Ago", "Set", "Out", "Nov", "Dez", "Jan"][index]}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex items-center gap-4 border-t border-white/[0.05] pt-3 text-[9.5px] text-dim">
                  <span className="flex items-center gap-1.5">
                    <span className="size-1.5 rounded-full bg-mint" /> Receitas
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="size-1.5 rounded-full bg-coral" /> Despesas
                  </span>
                  <span className="ml-auto font-mono text-muted">Julho — Janeiro</span>
                </div>
              </div>

              {/* budget */}
              <div className="card card-hover p-6">
                <div className="flex items-center gap-2.5">
                  <span className="grid size-8 place-items-center rounded-lg bg-sand/10 text-sand">
                    <PieChart className="size-4" />
                  </span>
                  <h3 className="text-[14px] font-semibold text-text">Orçamento sem culpa</h3>
                </div>
                <p className="mt-2 text-[11.5px] leading-relaxed text-muted">
                  Defina limites por categoria e receba um aviso antes de estourar — não depois.
                </p>

                <div className="mt-6 space-y-4">
                  {[
                    { name: "Moradia", pct: 72, color: "#34D399" },
                    { name: "Alimentação", pct: 54, color: "#FBBF24" },
                    { name: "Lazer", pct: 92, color: "#FB7185" },
                  ].map((row) => (
                    <div key={row.name}>
                      <div className="mb-1.5 flex justify-between text-[10px]">
                        <span className="text-muted">{row.name}</span>
                        <span className="font-mono text-dim">{row.pct}%</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${row.pct}%`, backgroundColor: row.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* goals */}
              <div className="card card-hover p-6">
                <div className="flex items-center gap-2.5">
                  <span className="grid size-8 place-items-center rounded-lg bg-violet/10 text-violet">
                    <Target className="size-4" />
                  </span>
                  <h3 className="text-[14px] font-semibold text-text">Metas que saem do papel</h3>
                </div>
                <p className="mt-2 text-[11.5px] leading-relaxed text-muted">
                  Crie objetivos, registre aportes e veja cada passo virar progresso real.
                </p>

                <div className="mt-6 flex items-center gap-4">
                  <div
                    className="relative grid size-[84px] shrink-0 place-items-center rounded-full"
                    style={{
                      background:
                        "conic-gradient(#34D399 0% 68%, rgba(255,255,255,0.06) 68% 100%)",
                    }}
                  >
                    <div className="grid size-[66px] place-items-center rounded-full bg-[#0c0f13]">
                      <div className="text-center">
                        <p className="font-mono text-[13.5px] font-semibold tracking-[-0.01em] text-text">68%</p>
                        <p className="text-[7.5px] uppercase tracking-wider text-dim">da meta</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-[11.5px] font-medium text-text">Reserva de emergência</p>
                    <p className="mt-1 font-mono text-[10px] text-dim">R$ 12.400 / R$ 18.000</p>
                    <p className="mt-2 inline-flex items-center gap-1 rounded-md bg-mint/[0.07] px-1.5 py-0.5 text-[8.5px] text-mint">
                      <Check className="size-2.5" /> 4 meses adiantada
                    </p>
                  </div>
                </div>
              </div>

              {/* investment */}
              <div className="card card-hover p-6">
                <div className="flex items-center gap-2.5">
                  <span className="grid size-8 place-items-center rounded-lg bg-sky/10 text-sky">
                    <TrendingUp className="size-4" />
                  </span>
                  <h3 className="text-[14px] font-semibold text-text">
                    Veja o tempo trabalhar por você
                  </h3>
                </div>
                <p className="mt-2 text-[11.5px] leading-relaxed text-muted">
                  Simule aportes e juros compostos com gráficos que mostram o efeito bola de neve.
                </p>

                <div className="relative mt-5">
                  <svg
                    viewBox="0 0 300 110"
                    className="w-full"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <defs>
                      <linearGradient id="featureInvest" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#34D399" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#34D399" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0 98 C30 94 55 90 85 80 C115 70 140 66 170 52 C200 38 235 30 265 18 C282 11 292 8 300 6 L300 110 L0 110 Z"
                      fill="url(#featureInvest)"
                    />
                    <path
                      d="M0 98 C30 94 55 90 85 80 C115 70 140 66 170 52 C200 38 235 30 265 18 C282 11 292 8 300 6"
                      fill="none"
                      stroke="#34D399"
                      strokeWidth="1.8"
                    />
                    <path
                      d="M0 104 C40 102 70 100 110 96 C160 90 210 86 300 78"
                      fill="none"
                      stroke="#60A5FA"
                      strokeWidth="1.4"
                      strokeDasharray="4 4"
                      opacity="0.7"
                    />
                  </svg>
                  <span className="absolute -top-1 right-0 rounded-md border border-mint/20 bg-mint/[0.08] px-2 py-1 font-mono text-[9px] text-mint">
                    R$ 1,83 mi em 30 anos
                  </span>
                </div>
              </div>

              {/* privacy */}
              <div className="card card-hover p-6">
                <div className="flex items-center gap-2.5">
                  <span className="grid size-8 place-items-center rounded-lg bg-mint/10 text-mint">
                    <ShieldCheck className="size-4" />
                  </span>
                  <h3 className="text-[14px] font-semibold text-text">Privacidade de verdade</h3>
                </div>
                <p className="mt-2 text-[11.5px] leading-relaxed text-muted">
                  Seus números são só seus. Sem vender dados, sem acesso à sua conta bancária.
                </p>

                <div className="mt-5 space-y-2.5">
                  {[
                    "Criptografia em repouso e em trânsito",
                    "Cada conta isolada por RLS",
                    "Exporte ou apague quando quiser",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-[10px] text-muted">
                      <span className="grid size-4 shrink-0 place-items-center rounded-full bg-mint/10 text-mint">
                        <Check className="size-2.5" strokeWidth={3} />
                      </span>
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* insights */}
              <div className="card card-hover p-6">
                <div className="flex items-center gap-2.5">
                  <span className="grid size-8 place-items-center rounded-lg bg-sand/10 text-sand">
                    <Zap className="size-4" />
                  </span>
                  <h3 className="text-[14px] font-semibold text-text">Insights que ajudam</h3>
                </div>
                <p className="mt-2 text-[11.5px] leading-relaxed text-muted">
                  Observações gentis e acionáveis, geradas a partir dos seus próprios hábitos.
                </p>

                <div className="mt-5 space-y-2">
                  {[
                    { tone: "#34D399", text: "Você guardou 23,5% da renda. Excelente ritmo." },
                    { tone: "#FBBF24", text: "Delivery subiu 18% este mês. Vale um olhar." },
                    { tone: "#60A5FA", text: "Faltam R$ 5.600 para a sua reserva." },
                  ].map((insight) => (
                    <div
                      key={insight.text}
                      className="flex items-start gap-2 rounded-lg border border-white/[0.05] bg-white/[0.015] p-2.5"
                    >
                      <span
                        className="mt-1 size-1.5 shrink-0 rounded-full"
                        style={{ backgroundColor: insight.tone }}
                      />
                      <p className="text-[9.5px] leading-relaxed text-dim">{insight.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section
          id="como-funciona"
          className="scroll-mt-24 border-t border-white/[0.055] px-5 py-20 sm:px-8 sm:py-28"
        >
          <div className="mx-auto max-w-6xl">
            <SectionHeading
              eyebrow="Simples de verdade"
              title="Três passos. Menos de dois minutos."
              description="Você não precisa entender de finanças para começar. Só precisa saber quanto ganha."
            />

            <div className="mt-12 grid gap-4 md:grid-cols-3">
              {[
                {
                  step: "01",
                  icon: Wallet,
                  color: "#34D399",
                  title: "Conte quanto você ganha",
                  text: "Informe sua renda mensal. Usamos isso para calcular sua taxa de poupança e sugerir limites realistas.",
                },
                {
                  step: "02",
                  icon: ListPlus,
                  color: "#60A5FA",
                  title: "Registre seus gastos",
                  text: "Adicione despesas em segundos, com categoria e data. O painel se atualiza na hora — sem planilha.",
                },
                {
                  step: "03",
                  icon: LineChart,
                  color: "#FBBF24",
                  title: "Siga o plano",
                  text: "Acompanhe gráficos, metas e insights. Ajuste o que precisar e veja seu dinheiro ganhar direção.",
                },
              ].map((item) => (
                <div key={item.step} className="card relative p-6">
                  <span className="absolute right-5 top-5 font-mono text-[24px] font-semibold text-white/[0.045]">
                    {item.step}
                  </span>
                  <span
                    className="grid size-10 place-items-center rounded-xl"
                    style={{ backgroundColor: `${item.color}12`, color: item.color }}
                  >
                    <item.icon className="size-5" strokeWidth={1.8} />
                  </span>
                  <h3 className="mt-4 text-[14px] font-semibold text-text">{item.title}</h3>
                  <p className="mt-1.5 text-[11.5px] leading-relaxed text-muted">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* INVESTMENTS */}
        <section
          id="investimentos"
          className="scroll-mt-24 px-5 pb-20 sm:px-8 sm:pb-28"
        >
          <div className="mx-auto max-w-6xl rounded-3xl border border-white/[0.07] bg-[linear-gradient(150deg,rgba(52,211,153,0.06),rgba(10,12,16,0.6)_45%,rgba(96,165,250,0.05))] p-6 sm:p-10 lg:p-14">
            <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-mint/15 bg-mint/[0.06] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-mint">
                  <TrendingUp className="size-3" /> Juros compostos
                </span>
                <h2 className="mt-4 text-[28px] font-semibold leading-[1.15] tracking-tight text-text sm:text-[38px]">
                  O tempo é o seu maior
                  <span className="text-gradient block">ativo financeiro.</span>
                </h2>
                <p className="mt-4 max-w-md text-[12.5px] leading-relaxed text-muted sm:text-[13px]">
                  Ajuste aporte, taxa e prazo. O Finora mostra exatamente quanto vem do seu bolso
                  e quanto vem dos juros — com uma curva que finalmente faz sentido.
                </p>

                <div className="mt-6 space-y-3">
                  {[
                    "Aporte inicial e mensal editáveis",
                    "Comparação com poupança, CDI e Tesouro",
                    "Cenários salvos para decidir com calma",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2.5 text-[12px] text-muted">
                      <span className="grid size-4.5 place-items-center rounded-full bg-mint/10 text-mint">
                        <Check className="size-2.5" strokeWidth={3} />
                      </span>
                      {item}
                    </div>
                  ))}
                </div>

                <Link href="/app/investimentos" className="mt-8 inline-block">
                  <Button>
                    Simular agora <ArrowRight className="size-4" />
                  </Button>
                </Link>
              </div>

              <div className="relative">
                <div className="card relative overflow-hidden p-5 sm:p-6">
                  <div className="pointer-events-none absolute -right-16 -top-20 size-56 rounded-full bg-mint/15 blur-3xl" />
                  <div className="relative">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-[9.5px] uppercase tracking-[0.14em] text-dim">
                          Aposentadoria aos 60
                        </p>
                        <p className="mt-1.5 font-mono text-[26px] font-semibold tracking-tight text-text sm:text-[30px]">
                          R$ 1.832.400
                        </p>
                      </div>
                      <span className="rounded-md border border-mint/20 bg-mint/[0.08] px-2 py-1 font-mono text-[9px] text-mint">
                        30 anos
                      </span>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3 border-y border-white/[0.055] py-3">
                      <div>
                        <p className="text-[8.5px] uppercase tracking-wider text-dim">Você investe</p>
                        <p className="mt-1 font-mono text-[12px] font-medium text-sky">R$ 293.000</p>
                      </div>
                      <div>
                        <p className="text-[8.5px] uppercase tracking-wider text-dim">Juros trabalham</p>
                        <p className="mt-1 font-mono text-[12px] font-medium text-mint">R$ 1.539.400</p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <svg
                        viewBox="0 0 340 130"
                        className="w-full"
                        preserveAspectRatio="none"
                        aria-hidden="true"
                      >
                        <defs>
                          <linearGradient id="ctaInvested" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.22" />
                            <stop offset="100%" stopColor="#60A5FA" stopOpacity="0" />
                          </linearGradient>
                          <linearGradient id="ctaTotal" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#34D399" stopOpacity="0.32" />
                            <stop offset="100%" stopColor="#34D399" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        <path
                          d="M0 122 C40 120 70 118 110 110 C150 102 190 92 340 58 L340 130 L0 130 Z"
                          fill="url(#ctaInvested)"
                        />
                        <path
                          d="M0 122 C40 120 70 118 110 110 C150 102 190 92 340 58"
                          fill="none"
                          stroke="#60A5FA"
                          strokeWidth="1.5"
                        />
                        <path
                          d="M0 124 C40 118 70 110 110 94 C150 76 190 56 240 36 C275 22 310 13 340 8 L340 130 L0 130 Z"
                          fill="url(#ctaTotal)"
                        />
                        <path
                          d="M0 124 C40 118 70 110 110 94 C150 76 190 56 240 36 C275 22 310 13 340 8"
                          fill="none"
                          stroke="#34D399"
                          strokeWidth="2"
                        />
                      </svg>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-[9px] text-dim">
                      <span className="flex items-center gap-1.5">
                        <span className="size-1.5 rounded-full bg-mint" /> Com juros
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="size-1.5 rounded-full bg-sky" /> Investido
                      </span>
                      <span className="font-mono">R$ 800/mês · 10,5% a.a.</span>
                    </div>
                  </div>
                </div>

                <div className="card absolute -bottom-5 -right-2 rounded-xl px-3 py-2 shadow-2xl sm:-right-5">
                  <p className="text-[8.5px] uppercase tracking-wider text-dim">Juros por mês no fim</p>
                  <p className="mt-0.5 font-mono text-[12px] font-semibold text-mint">~ R$ 14.800</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="border-t border-white/[0.055] px-5 py-20 sm:px-8 sm:py-28">
          <div className="mx-auto max-w-6xl">
            <SectionHeading
              eyebrow="Histórias reais"
              title="Quem usa, sente a diferença."
              description="Não vendemos milagre. Vendemos clareza — e ela muda decisões."
            />

            <div className="mt-12 grid gap-4 md:grid-cols-3">
              {testimonials.map((item) => (
                <figure key={item.name} className="card card-hover flex flex-col p-6">
                  <div className="flex gap-0.5 text-sand">
                    {[0, 1, 2, 3, 4].map((star) => (
                      <Star key={star} className="size-3 fill-current" />
                    ))}
                  </div>
                  <blockquote className="mt-4 flex-1 text-[12px] leading-relaxed text-muted">
                    “{item.quote}”
                  </blockquote>
                  <figcaption className="mt-5 flex items-center gap-2.5 border-t border-white/[0.05] pt-4">
                    <span
                      className="grid size-8 place-items-center rounded-full text-[10px] font-semibold"
                      style={{ backgroundColor: `${item.color}16`, color: item.color }}
                    >
                      {item.initials}
                    </span>
                    <div>
                      <p className="text-[11.5px] font-medium text-text">{item.name}</p>
                      <p className="text-[9.5px] text-dim">{item.role}</p>
                    </div>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="scroll-mt-24 px-5 py-20 sm:px-8 sm:py-24">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <div>
              <SectionHeading
                eyebrow="Dúvidas"
                title="Perguntas frequentes"
                description="Se algo ainda não estiver claro, é só perguntar. Respondemos de verdade."
                align="left"
              />
              <a
                href="mailto:contato@finora.app"
                className="mt-5 inline-flex items-center gap-1.5 text-[12px] font-medium text-mint transition hover:text-mint-soft"
              >
                Falar com a gente <ArrowRight className="size-3.5" />
              </a>
            </div>

            <div className="space-y-2.5">
              {faqs.map((faq) => (
                <details
                  key={faq.q}
                  className="card group overflow-hidden rounded-xl px-4 py-3.5 [&_summary::-webkit-details-marker]:hidden"
                >
                  <summary className="flex cursor-pointer list-none items-center gap-3">
                    <span className="text-[12.5px] font-medium text-text">{faq.q}</span>
                    <ChevronDown className="ml-auto size-4 shrink-0 text-dim transition-transform duration-300 group-open:rotate-180" />
                  </summary>
                  <p className="mt-3 pr-6 text-[11.5px] leading-relaxed text-muted">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="px-5 pb-20 sm:px-8 sm:pb-28">
          <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-white/[0.09] bg-[linear-gradient(140deg,rgba(52,211,153,0.1),rgba(10,12,16,0.7)_50%,rgba(96,165,250,0.08))] px-6 py-14 text-center sm:px-12 sm:py-20">
            <div className="pointer-events-none absolute inset-x-0 -top-24 mx-auto h-64 w-2/3 rounded-full bg-mint/15 blur-3xl" />
            <div className="relative">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.1] bg-white/[0.04] px-2.5 py-1 text-[10px] font-medium text-mint">
                <Sparkles className="size-3" /> Seu próximo mês pode ser diferente
              </span>
              <h2 className="mx-auto mt-5 max-w-2xl text-[30px] font-semibold leading-[1.1] tracking-tight text-text sm:text-[42px]">
                Pare de adivinhar.
                <span className="text-gradient block">Comece a enxergar.</span>
              </h2>
              <p className="mx-auto mt-4 max-w-md text-[12.5px] leading-relaxed text-muted sm:text-[13px]">
                Crie sua conta gratuita e tenha o primeiro retrato claro do seu dinheiro em menos
                de dois minutos.
              </p>
              <div className="mt-7 flex flex-col items-center justify-center gap-2.5 sm:flex-row">
                <Link href="/cadastro" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto">
                    Criar minha conta grátis <ArrowRight className="size-4" />
                  </Button>
                </Link>
                <Link href="/app" className="w-full sm:w-auto">
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                    Explorar demonstração
                  </Button>
                </Link>
              </div>
              <p className="mt-4 text-[10px] text-dim">
                Sem cartão de crédito · Sem anúncios · Cancele quando quiser (se algum dia quiser)
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/[0.055] px-5 py-12 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr]">
            <div>
              <Logo />
              <p className="mt-3 max-w-xs text-[11px] leading-relaxed text-dim">
                Seu assistente financeiro pessoal. Clareza, não julgamento — para você decidir
                melhor com o dinheiro que já tem.
              </p>
              <p className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-white/[0.06] bg-white/[0.02] px-2.5 py-1 text-[9.5px] text-dim">
                <ShieldCheck className="size-3 text-mint" /> Seus dados são seus. Sempre.
              </p>
            </div>

            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-dim">Produto</p>
              <div className="mt-3 space-y-2">
                {[
                  { href: "#recursos", label: "Recursos" },
                  { href: "#investimentos", label: "Simulador" },
                  { href: "/app", label: "Demonstração" },
                  { href: "/cadastro", label: "Criar conta" },
                ].map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="block text-[11.5px] text-muted transition hover:text-text"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-dim">Suporte</p>
              <div className="mt-3 space-y-2">
                <Link href="/login" className="block text-[11.5px] text-muted transition hover:text-text">
                  Entrar
                </Link>
                <a
                  href="mailto:contato@finora.app"
                  className="block text-[11.5px] text-muted transition hover:text-text"
                >
                  contato@finora.app
                </a>
                <a
                  href="#faq"
                  className="block text-[11.5px] text-muted transition hover:text-text"
                >
                  Perguntas frequentes
                </a>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/[0.055] pt-6 sm:flex-row">
            <p className="text-[10px] text-dim">
              © 2026 Finora. Feito com cuidado no Brasil.
            </p>
            <p className="text-[10px] text-dim">
              Este site não faz recomendações de investimento. Rentabilidades passadas não
              garantem resultados futuros.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
