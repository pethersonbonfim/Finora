export type TxType = "income" | "expense";

export interface Profile {
  id: string;
  name: string;
  email: string;
  currency: string;
  monthlyIncome: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  kind: TxType;
  budget: number;
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TxType;
  categoryId: string;
  date: string; // YYYY-MM-DD
  recurring: boolean;
}

export interface Goal {
  id: string;
  name: string;
  target: number;
  saved: number;
  deadline: string; // YYYY-MM-DD
  color: string;
}

export interface Simulation {
  id: string;
  name: string;
  initial: number;
  monthly: number;
  rate: number;
  months: number;
}

export interface AppData {
  profile: Profile;
  categories: Category[];
  transactions: Transaction[];
  goals: Goal[];
  simulations: Simulation[];
}

export type InsightTone = "positive" | "warning" | "danger" | "neutral";

export interface Insight {
  id: string;
  tone: InsightTone;
  title: string;
  text: string;
}
