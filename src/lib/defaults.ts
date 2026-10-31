import type { Category } from "./types";

export const DEFAULT_CATEGORIES: Omit<Category, "id">[] = [
  { name: "Moradia", icon: "home", color: "#34D399", kind: "expense", budget: 0 },
  { name: "Alimentação", icon: "utensils", color: "#FBBF24", kind: "expense", budget: 0 },
  { name: "Transporte", icon: "car", color: "#60A5FA", kind: "expense", budget: 0 },
  { name: "Lazer", icon: "popcorn", color: "#F472B6", kind: "expense", budget: 0 },
  { name: "Saúde", icon: "heart", color: "#A78BFA", kind: "expense", budget: 0 },
  { name: "Educação", icon: "book", color: "#22D3EE", kind: "expense", budget: 0 },
  { name: "Assinaturas", icon: "repeat", color: "#FB923C", kind: "expense", budget: 0 },
  { name: "Compras", icon: "shopping", color: "#94A3B8", kind: "expense", budget: 0 },
  { name: "Salário", icon: "briefcase", color: "#34D399", kind: "income", budget: 0 },
  { name: "Freelance", icon: "sparkles", color: "#22D3EE", kind: "income", budget: 0 },
];
