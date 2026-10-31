import { AppProvider } from "@/components/app-provider";
import { AppShell } from "@/components/app-shell";

export const metadata = {
  title: "Seu painel",
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <AppShell>{children}</AppShell>
    </AppProvider>
  );
}
