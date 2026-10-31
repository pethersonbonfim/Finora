import { addMonthsISO } from "./format";
import type { AppData, Category, Goal, Simulation, Transaction } from "./types";

function seeded(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

function jitter(seed: number, min: number, max: number) {
  return Math.round((min + seeded(seed) * (max - min)) * 100) / 100;
}

function iso(year: number, monthIndex: number, day: number) {
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const safeDay = Math.min(day, daysInMonth);
  return `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(safeDay).padStart(2, "0")}`;
}

const categories: Category[] = [
  { id: "cat-home", name: "Moradia", icon: "home", color: "#34D399", kind: "expense", budget: 3200 },
  { id: "cat-food", name: "Alimentação", icon: "utensils", color: "#FBBF24", kind: "expense", budget: 1500 },
  { id: "cat-transport", name: "Transporte", icon: "car", color: "#60A5FA", kind: "expense", budget: 600 },
  { id: "cat-fun", name: "Lazer", icon: "popcorn", color: "#F472B6", kind: "expense", budget: 550 },
  { id: "cat-health", name: "Saúde", icon: "heart", color: "#A78BFA", kind: "expense", budget: 350 },
  { id: "cat-study", name: "Educação", icon: "book", color: "#22D3EE", kind: "expense", budget: 300 },
  { id: "cat-subs", name: "Assinaturas", icon: "repeat", color: "#FB923C", kind: "expense", budget: 250 },
  { id: "cat-shop", name: "Compras", icon: "shopping", color: "#94A3B8", kind: "expense", budget: 400 },
  { id: "cat-salary", name: "Salário", icon: "briefcase", color: "#34D399", kind: "income", budget: 0 },
  { id: "cat-freelance", name: "Freelance", icon: "sparkles", color: "#22D3EE", kind: "income", budget: 0 },
];

export function createDemoData(): AppData {
  const transactions: Transaction[] = [];
  const now = new Date();
  let seq = 0;

  const push = (
    description: string,
    amount: number,
    type: Transaction["type"],
    categoryId: string,
    date: string,
    recurring = false
  ) => {
    transactions.push({
      id: `demo-tx-${++seq}`,
      description,
      amount: Math.round(amount * 100) / 100,
      type,
      categoryId,
      date,
      recurring,
    });
  };

  for (let offset = 5; offset >= 0; offset--) {
    const base = new Date(now.getFullYear(), now.getMonth() - offset, 1);
    const year = base.getFullYear();
    const monthIndex = base.getMonth();
    const isCurrent = offset === 0;
    const maxDay = isCurrent ? now.getDate() : 31;

    const day = (d: number) => iso(year, monthIndex, d);

    const add = (
      description: string,
      amount: number,
      type: Transaction["type"],
      categoryId: string,
      d: number,
      recurring = false
    ) => {
      if (d > maxDay) return;
      push(description, amount, type, categoryId, day(d), recurring);
    };

    add("Salário", 7800, "income", "cat-salary", 5, true);
    add("Projeto freelance", 850 + Math.round(seeded(offset + 3) * 700), "income", "cat-freelance", 20);

    add("Aluguel", 2280, "expense", "cat-home", 8, true);
    add("Condomínio", 480, "expense", "cat-home", 10, true);
    add("Conta de luz", jitter(offset + 1, 148, 212), "expense", "cat-home", 12);
    add("Água", jitter(offset + 2, 62, 96), "expense", "cat-home", 14);
    add("Internet fibra", 99.9, "expense", "cat-home", 15, true);

    add("Mercado", jitter(offset + 10, 310, 420), "expense", "cat-food", 3);
    add("Mercado", jitter(offset + 11, 290, 440), "expense", "cat-food", 10);
    add("Mercado", jitter(offset + 12, 320, 460), "expense", "cat-food", 17);
    add("Mercado", jitter(offset + 13, 260, 390), "expense", "cat-food", 24);
    add("Delivery", jitter(offset + 14, 68, 134), "expense", "cat-food", 7);
    add("Delivery", jitter(offset + 15, 54, 118), "expense", "cat-food", 21);
    add("Restaurante", jitter(offset + 16, 88, 156), "expense", "cat-food", 27);

    add("Combustível", jitter(offset + 20, 168, 224), "expense", "cat-transport", 9);
    add("Combustível", jitter(offset + 21, 150, 210), "expense", "cat-transport", 23);
    add("Uber", jitter(offset + 22, 58, 118), "expense", "cat-transport", 18);

    add("Academia", 119.9, "expense", "cat-health", 2, true);
    add("Farmácia", jitter(offset + 30, 62, 142), "expense", "cat-health", 16);

    add("Curso online", 89.9, "expense", "cat-study", 11, true);

    add("Streaming", 55.9, "expense", "cat-subs", 6, true);
    add("Spotify", 21.9, "expense", "cat-subs", 6, true);
    add("iCloud", 12.9, "expense", "cat-subs", 6, true);

    add("Cinema", jitter(offset + 40, 84, 148), "expense", "cat-fun", 22);
    add("Bar com amigos", jitter(offset + 41, 96, 180), "expense", "cat-fun", 28);

    add("Compras diversas", jitter(offset + 50, 120, 260), "expense", "cat-shop", 19);
  }

  const goals: Goal[] = [
    {
      id: "demo-goal-1",
      name: "Reserva de emergência",
      target: 30000,
      saved: 12400,
      deadline: addMonthsISO(10),
      color: "#34D399",
    },
    {
      id: "demo-goal-2",
      name: "Viagem para a Europa",
      target: 18000,
      saved: 5250,
      deadline: addMonthsISO(14),
      color: "#60A5FA",
    },
    {
      id: "demo-goal-3",
      name: "Notebook novo",
      target: 8000,
      saved: 3100,
      deadline: addMonthsISO(6),
      color: "#A78BFA",
    },
  ];

  const simulations: Simulation[] = [
    {
      id: "demo-sim-1",
      name: "Aposentadoria tranquila",
      initial: 5000,
      monthly: 800,
      rate: 10.5,
      months: 300,
    },
    {
      id: "demo-sim-2",
      name: "Reserva turbinada",
      initial: 2000,
      monthly: 500,
      rate: 9,
      months: 60,
    },
  ];

  return {
    profile: {
      id: "demo-user",
      name: "Lucas Andrade",
      email: "lucas@finora.app",
      currency: "BRL",
      monthlyIncome: 7800,
    },
    categories,
    transactions: transactions.sort((a, b) => b.date.localeCompare(a.date)),
    goals,
    simulations,
  };
}

export const DEMO_STORAGE_KEY = "finora.demo.v1";
