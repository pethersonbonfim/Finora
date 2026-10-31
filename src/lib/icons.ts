import {
  Briefcase,
  BookOpen,
  Bus,
  Car,
  Coffee,
  CreditCard,
  Dumbbell,
  Gift,
  GraduationCap,
  HeartPulse,
  Home,
  Landmark,
  PiggyBank,
  Plane,
  Popcorn,
  Repeat,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Utensils,
  Wallet,
  type LucideIcon,
} from "lucide-react";

export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  home: Home,
  utensils: Utensils,
  car: Car,
  popcorn: Popcorn,
  heart: HeartPulse,
  book: BookOpen,
  graduation: GraduationCap,
  repeat: Repeat,
  wallet: Wallet,
  briefcase: Briefcase,
  sparkles: Sparkles,
  piggy: PiggyBank,
  shopping: ShoppingBag,
  plane: Plane,
  gift: Gift,
  coffee: Coffee,
  gym: Dumbbell,
  bus: Bus,
  phone: Smartphone,
  bank: Landmark,
  card: CreditCard,
};

export const ICON_OPTIONS = Object.keys(CATEGORY_ICONS);

export function getCategoryIcon(name: string): LucideIcon {
  return CATEGORY_ICONS[name] ?? Wallet;
}

export const COLOR_PALETTE = [
  "#34D399",
  "#22D3EE",
  "#60A5FA",
  "#A78BFA",
  "#F472B6",
  "#FB7185",
  "#FB923C",
  "#FBBF24",
  "#A3E635",
  "#94A3B8",
];
