import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Finora — seu dinheiro, finalmente sob controle",
    template: "%s · Finora",
  },
  description:
    "O assistente financeiro pessoal que transforma seu salário em clareza: orçamento, metas, investimentos e gráficos bonitos em um só lugar. Grátis.",
  keywords: [
    "finanças pessoais",
    "controle financeiro",
    "orçamento",
    "investimentos",
    "juros compostos",
    "app financeiro",
  ],
  authors: [{ name: "Finora" }],
  openGraph: {
    title: "Finora — seu dinheiro, finalmente sob controle",
    description:
      "Orçamento, metas e investimentos com uma clareza que você nunca teve. Grátis para começar.",
    type: "website",
    locale: "pt_BR",
  },
};

export const viewport: Viewport = {
  themeColor: "#07080a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="min-h-dvh font-sans text-text antialiased">{children}</body>
    </html>
  );
}
