# finora. — seu dinheiro, finalmente sob controle

Assistente financeiro pessoal com dashboard, orçamento, metas e simulador de investimentos.
Design escuro sofisticado, gráficos reais e uma experiência pensada para dar clareza — sem julgar.

> **Modo demonstração:** o site funciona imediatamente, sem configurar nada. Os dados ficam no
> `localStorage` do navegador. Ao conectar o Supabase, o login real e a sincronização na nuvem
> são ativados automaticamente.

---

## ✨ O que está incluído

| Área | Recursos |
| --- | --- |
| **Landing page** | Hero animado, dashboard de prévia, bento de recursos, simulador em destaque, depoimentos, FAQ e CTA |
| **Login** | E-mail + senha (Supabase Auth), cadastro com confirmação de e-mail, rotas protegidas |
| **Visão geral** | KPIs com contagem animada, fluxo de caixa (6 meses), despesas por categoria, orçamento, insights automáticos, últimas transações e metas |
| **Transações** | CRUD completo, busca, filtros por mês e tipo, receitas/despesas recorrentes |
| **Orçamento** | Limites por categoria, barras de progresso, alertas de estouro, sugestão automática 50/30/20 |
| **Metas** | Progresso circular, aportes rápidos, prazo e aporte mensal necessário |
| **Investimentos** | Simulador de juros compostos, comparativos (Poupança, CDI, Tesouro, Ações), cenários salvos e conteúdo educativo |
| **Configurações** | Perfil, moeda (BRL/USD/EUR), renda mensal, exportação JSON, limpeza de dados e conexão do Supabase |
| **Demo** | Conta de exemplo completa com 6 meses de histórico, 3 metas e 2 simulações |

Tudo é **responsivo** (sidebar no desktop, barra inferior no celular), acessível por teclado e
respeita `prefers-reduced-motion`.

---

## 🧱 Stack

- **Next.js 16** (App Router, Turbopack, TypeScript)
- **Tailwind CSS 4** + design system próprio
- **Recharts 3** para gráficos
- **Motion** para microanimações
- **Supabase** (Auth + Postgres + RLS)
- **Vercel** para deploy gratuito

---

## 🚀 Rodar localmente

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

Sem variáveis de ambiente, o botão **“Ver demonstração”** e a rota `/app` abrem o painel com
dados de exemplo. Você pode navegar, criar transações, metas e simulações à vontade.

Para gerar a versão de produção:

```bash
npm run build
npm start
```

---

## ☁️ Conectar o Supabase (login real + nuvem)

### 1. Crie o projeto

1. Acesse [supabase.com](https://supabase.com) e crie um projeto gratuito.
2. No painel, abra **SQL Editor** → **New query**.
3. Cole todo o conteúdo de [`supabase/schema.sql`](./supabase/schema.sql) e clique em **Run**.
   Isso cria tabelas, índices, políticas de segurança (RLS) e o gatilho que gera perfil +
   categorias padrão para cada novo usuário.

### 2. Copie as credenciais

Em **Project Settings → API**, copie:

- `Project URL`
- `anon public key`

Crie o arquivo `.env.local` na raiz:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon
```

Reinicie o `npm run dev`. O modo demonstração continua funcionando, mas agora `/login` e
`/cadastro` criam contas reais.

### 3. Configure as URLs de autenticação

Em **Authentication → URL Configuration**:

- **Site URL:** `http://localhost:3000` (e depois o domínio da Vercel, em produção)
- **Redirect URLs:** `http://localhost:3000/auth/callback` e
  `https://seu-dominio.vercel.app/auth/callback`

O cadastro envia um e-mail de confirmação; o link retorna para `/auth/callback` e abre o painel.

> **Dica:** para testar sem confirmação de e-mail, desative “Confirm email” em
> Authentication → Providers → Email. Não recomendado em produção.

---

## ▲ Deploy gratuito na Vercel

1. Suba o projeto para um repositório no GitHub.
2. Em [vercel.com](https://vercel.com), importe o repositório.
3. Adicione as duas variáveis `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. Clique em **Deploy**.
5. Atualize a **Site URL** e as **Redirect URLs** no Supabase com o domínio da Vercel.

Custo: **R$ 0** nos planos gratuitos da Vercel e do Supabase.

---

## 🔐 Segurança

- **Row Level Security (RLS)** ativado em todas as tabelas: cada usuário só lê e escreve as
  próprias linhas, mesmo que manipule as requisições.
- A `anon key` é pública por design; quem protege os dados é o RLS.
- Nenhuma conexão bancária é solicitada. Todas as transações são inseridas manualmente.
- Exportação e exclusão de dados disponíveis em **Configurações**.

---

## 📁 Estrutura

```
src/
├─ app/
│  ├─ page.tsx                 # landing page
│  ├─ login/ · cadastro/       # autenticação
│  ├─ auth/callback/           # troca de código do Supabase
│  └─ app/                     # painel protegido
│     ├─ page.tsx              # visão geral
│     ├─ transacoes/
│     ├─ orcamento/
│     ├─ metas/
│     ├─ investimentos/
│     └─ configuracoes/
├─ components/
│  ├─ app-provider.tsx         # estado + persistência (nuvem/demo)
│  ├─ app-shell.tsx            # sidebar, topbar, navegação mobile
│  ├─ charts/                  # gráficos Recharts
│  ├─ ui/                      # botões, modal, toast, progresso…
│  └─ landing/                 # prévia do dashboard
├─ lib/
│  ├─ finance.ts               # cálculos, orçamento, juros compostos, insights
│  ├─ demo-data.ts             # 6 meses de dados de exemplo
│  ├─ format.ts                # moeda, datas, meses
│  └─ supabase/                # clientes browser/server
└─ proxy.ts                    # proteção de rotas + sessão
```

---

## ⚠️ Limites do plano gratuito

- O Supabase pausa projetos gratuitos após ~7 dias sem uso. Basta reativar no painel (ou criar um
  ping semanal com um cron gratuito).
- A Vercel tem limites generosos para uso pessoal; para um projeto desse porte, não há cobrança.
- As taxas de investimento são **ilustrativas** e editáveis. O Finora não faz recomendação de
  investimentos.

---

## 🧪 Conta de demonstração

Abra `/app` diretamente (ou clique em **Ver demonstração**). Você verá:

- Renda mensal de R$ 7.800 e 6 meses de transações
- 3 metas em andamento
- 2 simulações de investimento salvas
- Insights e orçamento calculados em tempo real

Para restaurar os dados originais: **Configurações → Restaurar demonstração**.

---

Feito com cuidado no Brasil. Se seus números ficarem mais claros, o objetivo foi cumprido.
