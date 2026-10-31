"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { createDemoData, DEMO_STORAGE_KEY } from "@/lib/demo-data";
import { DEFAULT_CATEGORIES } from "@/lib/defaults";
import {
  getSupabaseBrowserClient,
  isSupabaseConfigured,
} from "@/lib/supabase/client";
import type {
  AppData,
  Category,
  Goal,
  Profile,
  Simulation,
  Transaction,
} from "@/lib/types";
import { uid } from "@/lib/utils";

type Mode = "loading" | "demo" | "cloud";

type TransactionInput = Omit<Transaction, "id">;
type CategoryInput = Omit<Category, "id">;
type GoalInput = Omit<Goal, "id">;
type SimulationInput = Omit<Simulation, "id">;

interface AppContextValue {
  data: AppData | null;
  mode: Mode;
  isDemo: boolean;
  configured: boolean;
  error: string | null;
  ready: boolean;
  signOut: () => Promise<void>;
  refresh: () => void;
  addTransaction: (input: TransactionInput) => Promise<void>;
  updateTransaction: (id: string, patch: Partial<TransactionInput>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  addCategory: (input: CategoryInput) => Promise<void>;
  updateCategory: (id: string, patch: Partial<CategoryInput>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  addGoal: (input: GoalInput) => Promise<void>;
  updateGoal: (id: string, patch: Partial<GoalInput>) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  addContribution: (goalId: string, amount: number) => Promise<void>;
  addSimulation: (input: SimulationInput) => Promise<void>;
  deleteSimulation: (id: string) => Promise<void>;
  updateProfile: (patch: Partial<Omit<Profile, "id" | "email">>) => Promise<void>;
  resetDemo: () => void;
  clearData: () => Promise<void>;
  exportData: () => AppData | null;
}

const AppContext = createContext<AppContextValue | null>(null);

const FRIENDLY_SCHEMA_ERROR =
  "Seu banco de dados ainda não está configurado. Rode o arquivo supabase/schema.sql no SQL Editor do Supabase e recarregue a página.";

function isMissingTable(error: { code?: string; message?: string } | null) {
  if (!error) return false;
  return (
    error.code === "42P01" ||
    error.code === "PGRST205" ||
    !!error.message?.toLowerCase().includes("does not exist")
  );
}

function mapCategory(row: Record<string, unknown>): Category {
  return {
    id: String(row.id),
    name: String(row.name ?? "Categoria"),
    icon: String(row.icon ?? "wallet"),
    color: String(row.color ?? "#34D399"),
    kind: row.kind === "income" ? "income" : "expense",
    budget: Number(row.monthly_budget ?? 0),
  };
}

function mapTransaction(row: Record<string, unknown>): Transaction {
  return {
    id: String(row.id),
    description: String(row.description ?? ""),
    amount: Number(row.amount ?? 0),
    type: row.type === "income" ? "income" : "expense",
    categoryId: row.category_id ? String(row.category_id) : "",
    date: String(row.date ?? "").slice(0, 10),
    recurring: Boolean(row.recurring),
  };
}

function mapGoal(row: Record<string, unknown>): Goal {
  return {
    id: String(row.id),
    name: String(row.name ?? "Meta"),
    target: Number(row.target_amount ?? 0),
    saved: Number(row.saved_amount ?? 0),
    deadline: String(row.deadline ?? "").slice(0, 10),
    color: String(row.color ?? "#34D399"),
  };
}

function mapSimulation(row: Record<string, unknown>): Simulation {
  return {
    id: String(row.id),
    name: String(row.name ?? "Simulação"),
    initial: Number(row.initial_amount ?? 0),
    monthly: Number(row.monthly_contribution ?? 0),
    rate: Number(row.annual_rate ?? 0),
    months: Number(row.months ?? 0),
  };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();
  const [data, setData] = useState<AppData | null>(null);
  const [mode, setMode] = useState<Mode>(isSupabaseConfigured ? "loading" : "demo");
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);
  const userRef = useRef<User | null>(null);
  const supabaseRef = useRef<SupabaseClient | null>(supabase);

  const loadDemo = useCallback(() => {
    try {
      const stored = window.localStorage.getItem(DEMO_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as AppData;
        if (parsed && parsed.profile && Array.isArray(parsed.transactions)) {
          setData(parsed);
          setMode("demo");
          return;
        }
      }
    } catch {
      // Corrupted storage — fall back to a fresh demo.
    }
    const fresh = createDemoData();
    setData(fresh);
    setMode("demo");
  }, []);

  const loadCloud = useCallback(
    async (client: SupabaseClient, user: User) => {
      const [profileRes, categoriesRes, transactionsRes, goalsRes, simulationsRes] =
        await Promise.all([
          client.from("profiles").select("*").eq("id", user.id).maybeSingle(),
          client.from("categories").select("*").order("created_at", { ascending: true }),
          client.from("transactions").select("*").order("date", { ascending: false }),
          client.from("goals").select("*").order("created_at", { ascending: true }),
          client.from("simulations").select("*").order("created_at", { ascending: false }),
        ]);

      const firstError =
        profileRes.error ??
        categoriesRes.error ??
        transactionsRes.error ??
        goalsRes.error ??
        simulationsRes.error;

      if (firstError) {
        setError(isMissingTable(firstError) ? FRIENDLY_SCHEMA_ERROR : firstError.message);
        setMode("cloud");
        setData(null);
        return;
      }

      let categories = (categoriesRes.data ?? []).map(mapCategory);

      if (categories.length === 0) {
        const { data: inserted, error: insertError } = await client
          .from("categories")
          .insert(
            DEFAULT_CATEGORIES.map((category) => ({
              user_id: user.id,
              name: category.name,
              icon: category.icon,
              color: category.color,
              kind: category.kind,
              monthly_budget: category.budget,
            }))
          )
          .select();
        if (insertError) {
          setError(insertError.message);
        } else if (inserted) {
          categories = inserted.map((row) => mapCategory(row as Record<string, unknown>));
        }
      }

      let profile: Profile;
      if (!profileRes.data) {
        const fallbackName =
          (user.user_metadata?.name as string | undefined)?.trim() ||
          user.email?.split("@")[0] ||
          "Você";
        const { data: created, error: createError } = await client
          .from("profiles")
          .upsert({
            id: user.id,
            name: fallbackName,
            currency: "BRL",
            monthly_income: 0,
          })
          .select()
          .single();
        if (createError) {
          setError(isMissingTable(createError) ? FRIENDLY_SCHEMA_ERROR : createError.message);
          setMode("cloud");
          setData(null);
          return;
        }
        profile = {
          id: user.id,
          name: String(created.name ?? fallbackName),
          email: user.email ?? "",
          currency: String(created.currency ?? "BRL"),
          monthlyIncome: Number(created.monthly_income ?? 0),
        };
      } else {
        profile = {
          id: user.id,
          name: String(profileRes.data.name ?? "Você"),
          email: user.email ?? "",
          currency: String(profileRes.data.currency ?? "BRL"),
          monthlyIncome: Number(profileRes.data.monthly_income ?? 0),
        };
      }

      setData({
        profile,
        categories,
        transactions: (transactionsRes.data ?? []).map(mapTransaction),
        goals: (goalsRes.data ?? []).map(mapGoal),
        simulations: (simulationsRes.data ?? []).map(mapSimulation),
      });
      setError(null);
      setMode("cloud");
    },
    []
  );

  useEffect(() => {
    const client = supabaseRef.current;
    if (!client) {
      loadDemo();
      return;
    }

    let active = true;

    client.auth.getUser().then(({ data: authData }) => {
      if (!active) return;
      if (!authData.user) {
        router.replace("/login");
        return;
      }
      userRef.current = authData.user;
      loadCloud(client, authData.user);
    });

    const { data: listener } = client.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        userRef.current = null;
        router.replace("/login");
      }
      if (event === "SIGNED_IN" && userRef.current === null) {
        setTick((value) => value + 1);
      }
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, [loadCloud, loadDemo, router, tick]);

  // Keep demo data in the browser between visits.
  useEffect(() => {
    if (mode !== "demo" || !data) return;
    try {
      window.localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(data));
    } catch {
      // Storage might be full or blocked — demo still works in memory.
    }
  }, [data, mode]);

  const requireClient = useCallback(() => {
    const client = supabaseRef.current;
    const user = userRef.current;
    if (!client || !user) throw new Error("Sessão expirada. Entre novamente.");
    return { client, user };
  }, []);

  const addTransaction = useCallback(
    async (input: TransactionInput) => {
      if (mode === "demo" || !supabaseRef.current) {
        setData((current) =>
          current
            ? {
                ...current,
                transactions: [
                  { ...input, id: uid() },
                  ...current.transactions,
                ].sort((a, b) => b.date.localeCompare(a.date)),
              }
            : current
        );
        return;
      }
      const { client, user } = requireClient();
      const { data: row, error: insertError } = await client
        .from("transactions")
        .insert({
          user_id: user.id,
          description: input.description,
          amount: input.amount,
          type: input.type,
          category_id: input.categoryId || null,
          date: input.date,
          recurring: input.recurring,
        })
        .select()
        .single();
      if (insertError) throw new Error(insertError.message);
      setData((current) =>
        current
          ? {
              ...current,
              transactions: [mapTransaction(row), ...current.transactions].sort((a, b) =>
                b.date.localeCompare(a.date)
              ),
            }
          : current
      );
    },
    [mode, requireClient]
  );

  const updateTransaction = useCallback(
    async (id: string, patch: Partial<TransactionInput>) => {
      if (mode === "demo" || !supabaseRef.current) {
        setData((current) =>
          current
            ? {
                ...current,
                transactions: current.transactions
                  .map((tx) => (tx.id === id ? { ...tx, ...patch } : tx))
                  .sort((a, b) => b.date.localeCompare(a.date)),
              }
            : current
        );
        return;
      }
      const { client } = requireClient();
      const payload: Record<string, unknown> = {};
      if (patch.description !== undefined) payload.description = patch.description;
      if (patch.amount !== undefined) payload.amount = patch.amount;
      if (patch.type !== undefined) payload.type = patch.type;
      if (patch.categoryId !== undefined) payload.category_id = patch.categoryId || null;
      if (patch.date !== undefined) payload.date = patch.date;
      if (patch.recurring !== undefined) payload.recurring = patch.recurring;

      const { error: updateError } = await client
        .from("transactions")
        .update(payload)
        .eq("id", id);
      if (updateError) throw new Error(updateError.message);
      setData((current) =>
        current
          ? {
              ...current,
              transactions: current.transactions
                .map((tx) => (tx.id === id ? { ...tx, ...patch } : tx))
                .sort((a, b) => b.date.localeCompare(a.date)),
            }
          : current
      );
    },
    [mode, requireClient]
  );

  const deleteTransaction = useCallback(
    async (id: string) => {
      if (mode === "demo" || !supabaseRef.current) {
        setData((current) =>
          current
            ? {
                ...current,
                transactions: current.transactions.filter((tx) => tx.id !== id),
              }
            : current
        );
        return;
      }
      const { client } = requireClient();
      const { error: deleteError } = await client.from("transactions").delete().eq("id", id);
      if (deleteError) throw new Error(deleteError.message);
      setData((current) =>
        current
          ? {
              ...current,
              transactions: current.transactions.filter((tx) => tx.id !== id),
            }
          : current
      );
    },
    [mode, requireClient]
  );

  const addCategory = useCallback(
    async (input: CategoryInput) => {
      if (mode === "demo" || !supabaseRef.current) {
        setData((current) =>
          current
            ? { ...current, categories: [...current.categories, { ...input, id: uid() }] }
            : current
        );
        return;
      }
      const { client, user } = requireClient();
      const { data: row, error: insertError } = await client
        .from("categories")
        .insert({
          user_id: user.id,
          name: input.name,
          icon: input.icon,
          color: input.color,
          kind: input.kind,
          monthly_budget: input.budget,
        })
        .select()
        .single();
      if (insertError) throw new Error(insertError.message);
      setData((current) =>
        current
          ? { ...current, categories: [...current.categories, mapCategory(row)] }
          : current
      );
    },
    [mode, requireClient]
  );

  const updateCategory = useCallback(
    async (id: string, patch: Partial<CategoryInput>) => {
      if (mode === "demo" || !supabaseRef.current) {
        setData((current) =>
          current
            ? {
                ...current,
                categories: current.categories.map((category) =>
                  category.id === id ? { ...category, ...patch } : category
                ),
              }
            : current
        );
        return;
      }
      const { client } = requireClient();
      const payload: Record<string, unknown> = {};
      if (patch.name !== undefined) payload.name = patch.name;
      if (patch.icon !== undefined) payload.icon = patch.icon;
      if (patch.color !== undefined) payload.color = patch.color;
      if (patch.kind !== undefined) payload.kind = patch.kind;
      if (patch.budget !== undefined) payload.monthly_budget = patch.budget;

      const { error: updateError } = await client
        .from("categories")
        .update(payload)
        .eq("id", id);
      if (updateError) throw new Error(updateError.message);
      setData((current) =>
        current
          ? {
              ...current,
              categories: current.categories.map((category) =>
                category.id === id ? { ...category, ...patch } : category
              ),
            }
          : current
      );
    },
    [mode, requireClient]
  );

  const deleteCategory = useCallback(
    async (id: string) => {
      if (mode === "demo" || !supabaseRef.current) {
        setData((current) =>
          current
            ? {
                ...current,
                categories: current.categories.filter((category) => category.id !== id),
                transactions: current.transactions.map((tx) =>
                  tx.categoryId === id ? { ...tx, categoryId: "" } : tx
                ),
              }
            : current
        );
        return;
      }
      const { client } = requireClient();
      const { error: deleteError } = await client.from("categories").delete().eq("id", id);
      if (deleteError) throw new Error(deleteError.message);
      setData((current) =>
        current
          ? {
              ...current,
              categories: current.categories.filter((category) => category.id !== id),
              transactions: current.transactions.map((tx) =>
                tx.categoryId === id ? { ...tx, categoryId: "" } : tx
              ),
            }
          : current
      );
    },
    [mode, requireClient]
  );

  const addGoal = useCallback(
    async (input: GoalInput) => {
      if (mode === "demo" || !supabaseRef.current) {
        setData((current) =>
          current ? { ...current, goals: [...current.goals, { ...input, id: uid() }] } : current
        );
        return;
      }
      const { client, user } = requireClient();
      const { data: row, error: insertError } = await client
        .from("goals")
        .insert({
          user_id: user.id,
          name: input.name,
          target_amount: input.target,
          saved_amount: input.saved,
          deadline: input.deadline,
          color: input.color,
        })
        .select()
        .single();
      if (insertError) throw new Error(insertError.message);
      setData((current) =>
        current ? { ...current, goals: [...current.goals, mapGoal(row)] } : current
      );
    },
    [mode, requireClient]
  );

  const updateGoal = useCallback(
    async (id: string, patch: Partial<GoalInput>) => {
      if (mode === "demo" || !supabaseRef.current) {
        setData((current) =>
          current
            ? {
                ...current,
                goals: current.goals.map((goal) =>
                  goal.id === id ? { ...goal, ...patch } : goal
                ),
              }
            : current
        );
        return;
      }
      const { client } = requireClient();
      const payload: Record<string, unknown> = {};
      if (patch.name !== undefined) payload.name = patch.name;
      if (patch.target !== undefined) payload.target_amount = patch.target;
      if (patch.saved !== undefined) payload.saved_amount = patch.saved;
      if (patch.deadline !== undefined) payload.deadline = patch.deadline;
      if (patch.color !== undefined) payload.color = patch.color;

      const { error: updateError } = await client.from("goals").update(payload).eq("id", id);
      if (updateError) throw new Error(updateError.message);
      setData((current) =>
        current
          ? {
              ...current,
              goals: current.goals.map((goal) =>
                goal.id === id ? { ...goal, ...patch } : goal
              ),
            }
          : current
      );
    },
    [mode, requireClient]
  );

  const deleteGoal = useCallback(
    async (id: string) => {
      if (mode === "demo" || !supabaseRef.current) {
        setData((current) =>
          current ? { ...current, goals: current.goals.filter((goal) => goal.id !== id) } : current
        );
        return;
      }
      const { client } = requireClient();
      const { error: deleteError } = await client.from("goals").delete().eq("id", id);
      if (deleteError) throw new Error(deleteError.message);
      setData((current) =>
        current ? { ...current, goals: current.goals.filter((goal) => goal.id !== id) } : current
      );
    },
    [mode, requireClient]
  );

  const addContribution = useCallback(
    async (goalId: string, amount: number) => {
      const goal = data?.goals.find((item) => item.id === goalId);
      if (!goal) return;
      const nextSaved = Math.max(0, goal.saved + amount);
      await updateGoal(goalId, { saved: nextSaved });
    },
    [data, updateGoal]
  );

  const addSimulation = useCallback(
    async (input: SimulationInput) => {
      if (mode === "demo" || !supabaseRef.current) {
        setData((current) =>
          current
            ? { ...current, simulations: [{ ...input, id: uid() }, ...current.simulations] }
            : current
        );
        return;
      }
      const { client, user } = requireClient();
      const { data: row, error: insertError } = await client
        .from("simulations")
        .insert({
          user_id: user.id,
          name: input.name,
          initial_amount: input.initial,
          monthly_contribution: input.monthly,
          annual_rate: input.rate,
          months: input.months,
        })
        .select()
        .single();
      if (insertError) throw new Error(insertError.message);
      setData((current) =>
        current
          ? { ...current, simulations: [mapSimulation(row), ...current.simulations] }
          : current
      );
    },
    [mode, requireClient]
  );

  const deleteSimulation = useCallback(
    async (id: string) => {
      if (mode === "demo" || !supabaseRef.current) {
        setData((current) =>
          current
            ? {
                ...current,
                simulations: current.simulations.filter((simulation) => simulation.id !== id),
              }
            : current
        );
        return;
      }
      const { client } = requireClient();
      const { error: deleteError } = await client.from("simulations").delete().eq("id", id);
      if (deleteError) throw new Error(deleteError.message);
      setData((current) =>
        current
          ? {
              ...current,
              simulations: current.simulations.filter((simulation) => simulation.id !== id),
            }
          : current
      );
    },
    [mode, requireClient]
  );

  const updateProfile = useCallback(
    async (patch: Partial<Omit<Profile, "id" | "email">>) => {
      if (mode === "demo" || !supabaseRef.current) {
        setData((current) =>
          current ? { ...current, profile: { ...current.profile, ...patch } } : current
        );
        return;
      }
      const { client, user } = requireClient();
      const payload: Record<string, unknown> = {};
      if (patch.name !== undefined) payload.name = patch.name;
      if (patch.currency !== undefined) payload.currency = patch.currency;
      if (patch.monthlyIncome !== undefined) payload.monthly_income = patch.monthlyIncome;

      const { error: updateError } = await client
        .from("profiles")
        .update(payload)
        .eq("id", user.id);
      if (updateError) throw new Error(updateError.message);
      setData((current) =>
        current ? { ...current, profile: { ...current.profile, ...patch } } : current
      );
    },
    [mode, requireClient]
  );

  const clearData = useCallback(async () => {
    if (mode === "demo" || !supabaseRef.current) {
      setData((current) =>
        current
          ? { ...current, transactions: [], goals: [], simulations: [] }
          : current
      );
      return;
    }
    const { client, user } = requireClient();
    const results = await Promise.all([
      client.from("transactions").delete().eq("user_id", user.id),
      client.from("goals").delete().eq("user_id", user.id),
      client.from("simulations").delete().eq("user_id", user.id),
    ]);
    const failure = results.find((result) => result.error);
    if (failure?.error) throw new Error(failure.error.message);
    setData((current) =>
      current
        ? { ...current, transactions: [], goals: [], simulations: [] }
        : current
    );
  }, [mode, requireClient]);

  const resetDemo = useCallback(() => {
    try {
      window.localStorage.removeItem(DEMO_STORAGE_KEY);
    } catch {
      // ignore
    }
    setData(createDemoData());
    setMode("demo");
  }, []);

  const signOut = useCallback(async () => {
    if (supabaseRef.current) {
      await supabaseRef.current.auth.signOut();
    }
    userRef.current = null;
    router.replace("/");
    router.refresh();
  }, [router]);

  const refresh = useCallback(() => {
    if (supabaseRef.current && userRef.current) {
      loadCloud(supabaseRef.current, userRef.current);
    } else {
      loadDemo();
    }
  }, [loadCloud, loadDemo]);

  const exportData = useCallback(() => data, [data]);

  const value = useMemo<AppContextValue>(
    () => ({
      data,
      mode,
      isDemo: mode === "demo",
      configured: isSupabaseConfigured,
      error,
      ready: mode !== "loading" && data !== null,
      signOut,
      refresh,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      addCategory,
      updateCategory,
      deleteCategory,
      addGoal,
      updateGoal,
      deleteGoal,
      addContribution,
      addSimulation,
      deleteSimulation,
      updateProfile,
      resetDemo,
      clearData,
      exportData,
    }),
    [
      data,
      mode,
      error,
      signOut,
      refresh,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      addCategory,
      updateCategory,
      deleteCategory,
      addGoal,
      updateGoal,
      deleteGoal,
      addContribution,
      addSimulation,
      deleteSimulation,
      updateProfile,
      resetDemo,
      clearData,
      exportData,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp deve ser usado dentro de AppProvider");
  return context;
}
