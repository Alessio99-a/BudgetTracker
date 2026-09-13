"use client";

import StartScreen from "@/components/onboarding/StartScreen";
import { Button, Card, Typography } from "@heroui/react";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { User } from "@/types/User";

type AppState = "start" | "home";
type AppTab = "overview" | "transactions" | "budgets" | "goals" | "settings";
type TransactionType = "income" | "expense";

type Transaction = {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  type: TransactionType;
};

type BudgetCategory = {
  id: string;
  name: string;
  limit: number;
};

type SavingGoal = {
  id: string;
  name: string;
  target: number;
  current: number;
};

type BudgetData = {
  transactions: Transaction[];
  budgets: BudgetCategory[];
  goals: SavingGoal[];
};

const STORAGE_USER_KEY = "user";
const STORAGE_DATA_KEY = "budgetTrackerData";

const defaultUser: User = {
  name: "",
  annualIncome: 0,
  monthlyIncome: 0,
  housingExpenses: 0,
  debt: 0,
  savings: 0,
  investments: 0,
  status: "single",
  goal: "investment",
};

const defaultData: BudgetData = {
  transactions: [
    {
      id: "tx-1",
      title: "Groceries",
      amount: 180,
      category: "Food",
      date: "2026-09-01",
      type: "expense",
    },
    {
      id: "tx-2",
      title: "Freelance project",
      amount: 650,
      category: "Income",
      date: "2026-09-03",
      type: "income",
    },
    {
      id: "tx-3",
      title: "Transport pass",
      amount: 45,
      category: "Transport",
      date: "2026-09-05",
      type: "expense",
    },
  ],
  budgets: [
    { id: "budget-1", name: "Food", limit: 420 },
    { id: "budget-2", name: "Transport", limit: 120 },
    { id: "budget-3", name: "Lifestyle", limit: 260 },
  ],
  goals: [
    { id: "goal-1", name: "Emergency fund", target: 3000, current: 900 },
    { id: "goal-2", name: "Investing starter", target: 1500, current: 450 },
  ],
};

const moneyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

function formatMoney(value: number) {
  return moneyFormatter.format(Number.isFinite(value) ? value : 0);
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.round(Math.random() * 1000)}`;
}

function getGoalCopy(goal: User["goal"], monthlyFreeCash: number) {
  if (goal === "debt-free") {
    return monthlyFreeCash > 0
      ? `Try sending ${formatMoney(monthlyFreeCash * 0.6)} per month toward debt.`
      : "Reduce fixed costs before adding more debt payments.";
  }

  if (goal === "savings") {
    return monthlyFreeCash > 0
      ? `A starter target could be ${formatMoney(monthlyFreeCash * 0.5)} per month.`
      : "Start with a tiny automatic transfer, even 10-20 EUR.";
  }

  return monthlyFreeCash > 0
    ? `Consider investing up to ${formatMoney(monthlyFreeCash * 0.35)} monthly.`
    : "Build positive monthly cash flow before investing more.";
}

function getCategorySpent(transactions: Transaction[], category: string) {
  return transactions
    .filter((transaction) => transaction.type === "expense")
    .filter((transaction) => transaction.category === category)
    .reduce((total, transaction) => total + transaction.amount, 0);
}

export default function Home() {
  const [appState, setAppState] = useState<AppState>("start");
  const [activeTab, setActiveTab] = useState<AppTab>("overview");
  const [user, setUser] = useState<User>(defaultUser);
  const [data, setData] = useState<BudgetData>(defaultData);
  const [isReady, setIsReady] = useState(false);
  const [transactionDraft, setTransactionDraft] = useState<Omit<Transaction, "id">>({
    title: "",
    amount: 0,
    category: "Food",
    date: today(),
    type: "expense",
  });
  const [budgetDraft, setBudgetDraft] = useState({ name: "", limit: 0 });
  const [goalDraft, setGoalDraft] = useState({ name: "", target: 0, current: 0 });
  const [importText, setImportText] = useState("");
  const [importMessage, setImportMessage] = useState("");

  useEffect(() => {
    const savedUser = localStorage.getItem(STORAGE_USER_KEY);
    const savedData = localStorage.getItem(STORAGE_DATA_KEY);

    window.setTimeout(() => {
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser) as User);
          setAppState("home");
        } catch (error) {
          console.error("Failed to parse saved user:", error);
          localStorage.removeItem(STORAGE_USER_KEY);
        }
      }

      if (savedData) {
        try {
          setData(JSON.parse(savedData) as BudgetData);
        } catch (error) {
          console.error("Failed to parse saved budget data:", error);
          localStorage.removeItem(STORAGE_DATA_KEY);
        }
      }

      setIsReady(true);
    }, 0);
  }, []);

  useEffect(() => {
    if (!isReady) return;

    localStorage.setItem(STORAGE_DATA_KEY, JSON.stringify(data));
  }, [data, isReady]);

  const monthlyIncome = user.annualIncome / 12;
  const transactionIncome = data.transactions
    .filter((transaction) => transaction.type === "income")
    .reduce((total, transaction) => total + transaction.amount, 0);
  const transactionExpenses = data.transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((total, transaction) => total + transaction.amount, 0);
  const monthlyOutflow = user.housingExpenses + transactionExpenses;
  const monthlyFreeCash = monthlyIncome + transactionIncome - monthlyOutflow;
  const netWorth = user.savings + user.investments - user.debt;
  const housingRatio = monthlyIncome > 0 ? user.housingExpenses / monthlyIncome : 0;
  const emergencyMonths =
    monthlyOutflow > 0 ? user.savings / monthlyOutflow : 0;
  const healthScore = Math.max(
    0,
    Math.min(
      100,
      50 +
        (monthlyFreeCash > 0 ? 20 : -20) +
        (housingRatio <= 0.35 ? 15 : -10) +
        (emergencyMonths >= 3 ? 15 : emergencyMonths * 5) -
        (user.debt > monthlyIncome * 3 ? 15 : 0)
    )
  );
  const savingsRate =
    monthlyIncome + transactionIncome > 0
      ? (monthlyFreeCash / (monthlyIncome + transactionIncome)) * 100
      : 0;

  const categories = useMemo(() => {
    const names = new Set([
      "Food",
      "Transport",
      "Lifestyle",
      "Bills",
      "Health",
      "Income",
      ...data.budgets.map((budget) => budget.name),
      ...data.transactions.map((transaction) => transaction.category),
    ]);

    return Array.from(names);
  }, [data.budgets, data.transactions]);

  const insights = [
    housingRatio > 0.35
      ? "Housing is above 35% of income. This is the main risk area."
      : "Housing is inside a healthy range for this profile.",
    monthlyFreeCash > 0
      ? `Projected free cash this month is ${formatMoney(monthlyFreeCash)}.`
      : "Free cash is negative. Add income or reduce variable expenses.",
    emergencyMonths >= 3
      ? "Emergency fund coverage is strong enough for a portfolio demo."
      : "Emergency fund coverage is still below the common 3 month target.",
  ];

  function updateUser<K extends keyof User>(key: K, value: User[K]) {
    setUser((prev) => {
      const updated = {
        ...prev,
        [key]: value,
      };

      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(updated));

      return updated;
    });
  }

  function resetProfile() {
    localStorage.removeItem(STORAGE_USER_KEY);
    localStorage.removeItem(STORAGE_DATA_KEY);
    setUser(defaultUser);
    setData(defaultData);
    setActiveTab("overview");
    setAppState("start");
  }

  function addTransaction() {
    if (!transactionDraft.title.trim() || transactionDraft.amount <= 0) return;

    setData((prev) => ({
      ...prev,
      transactions: [
        {
          ...transactionDraft,
          id: makeId("tx"),
          title: transactionDraft.title.trim(),
          category: transactionDraft.category.trim() || "Other",
        },
        ...prev.transactions,
      ],
    }));
    setTransactionDraft({
      title: "",
      amount: 0,
      category: transactionDraft.category,
      date: today(),
      type: "expense",
    });
  }

  function removeTransaction(id: string) {
    setData((prev) => ({
      ...prev,
      transactions: prev.transactions.filter((transaction) => transaction.id !== id),
    }));
  }

  function addBudget() {
    if (!budgetDraft.name.trim() || budgetDraft.limit <= 0) return;

    setData((prev) => ({
      ...prev,
      budgets: [
        ...prev.budgets,
        {
          id: makeId("budget"),
          name: budgetDraft.name.trim(),
          limit: budgetDraft.limit,
        },
      ],
    }));
    setBudgetDraft({ name: "", limit: 0 });
  }

  function removeBudget(id: string) {
    setData((prev) => ({
      ...prev,
      budgets: prev.budgets.filter((budget) => budget.id !== id),
    }));
  }

  function addGoal() {
    if (!goalDraft.name.trim() || goalDraft.target <= 0) return;

    setData((prev) => ({
      ...prev,
      goals: [
        ...prev.goals,
        {
          id: makeId("goal"),
          name: goalDraft.name.trim(),
          target: goalDraft.target,
          current: Math.min(goalDraft.current, goalDraft.target),
        },
      ],
    }));
    setGoalDraft({ name: "", target: 0, current: 0 });
  }

  function removeGoal(id: string) {
    setData((prev) => ({
      ...prev,
      goals: prev.goals.filter((goal) => goal.id !== id),
    }));
  }

  function updateGoalProgress(id: string, current: number) {
    setData((prev) => ({
      ...prev,
      goals: prev.goals.map((goal) =>
        goal.id === id
          ? { ...goal, current: Math.max(0, Math.min(current, goal.target)) }
          : goal
      ),
    }));
  }

  function exportData() {
    const payload = JSON.stringify({ user, data }, null, 2);
    void navigator.clipboard?.writeText(payload);
    setImportText(payload);
    setImportMessage("Backup copied below. You can save it as JSON.");
  }

  function importData() {
    try {
      const parsed = JSON.parse(importText) as { user?: User; data?: BudgetData };

      if (!parsed.user || !parsed.data) {
        setImportMessage("Invalid backup: user and data are required.");
        return;
      }

      setUser(parsed.user);
      setData(parsed.data);
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(parsed.user));
      localStorage.setItem(STORAGE_DATA_KEY, JSON.stringify(parsed.data));
      setAppState("home");
      setImportMessage("Backup imported successfully.");
    } catch {
      setImportMessage("Invalid JSON. Check the backup text and try again.");
    }
  }

  function importFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      setImportText(String(reader.result ?? ""));
      setImportMessage("File loaded. Press Import backup to apply it.");
    });
    reader.readAsText(file);
  }

  return (
    <main
      className="m-auto flex w-full flex-col gap-8 p-6 sm:p-8"
      style={{ width: "min(1180px, 100%)" }}
    >
      <header className="flex flex-col gap-2">
        <Typography type="h1" className="text-5xl font-bold text-accent">
          Budget Tracker
        </Typography>
        <p className="max-w-2xl text-muted">
          Local personal finance dashboard for a portfolio project: onboarding,
          budgets, transactions, goals, insights, and backup tools.
        </p>
      </header>

      {appState === "start" && (
        <StartScreen
          appState={appState}
          onAppChange={(state) => setAppState(state as "home")}
          user={user}
          editUserField={updateUser}
        />
      )}

      {appState === "home" && (
        <div className="flex min-h-screen w-full flex-col gap-6">
          <section className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Typography type="h2" className="text-2xl font-semibold">
                Welcome, {user.name || "there"}
              </Typography>
              <p className="text-muted">
                Goal: {user.goal.replace("-", " ")}. Everything is stored in
                this browser only.
              </p>
            </div>

            <Button variant="secondary" onClick={resetProfile}>
              Reset demo
            </Button>
          </section>

          <nav className="grid grid-cols-2 gap-2 sm:grid-cols-5">
            {(["overview", "transactions", "budgets", "goals", "settings"] as AppTab[]).map(
              (tab) => (
                <button
                  key={tab}
                  className={`rounded-md border px-3 py-2 text-sm font-medium capitalize ${
                    activeTab === tab
                      ? "border-accent bg-accent text-accent-foreground"
                      : "border-border bg-surface text-foreground"
                  }`}
                  onClick={() => setActiveTab(tab)}
                  type="button"
                >
                  {tab}
                </button>
              )
            )}
          </nav>

          {activeTab === "overview" && (
            <section className="flex flex-col gap-6">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <MetricCard label="Monthly Income" value={formatMoney(monthlyIncome)} />
                <MetricCard label="Free Cash" value={formatMoney(monthlyFreeCash)} />
                <MetricCard label="Net Worth" value={formatMoney(netWorth)} />
                <MetricCard label="Health Score" value={`${Math.round(healthScore)}/100`} />
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                <Card>
                  <Card.Header>
                    <Card.Title>Cash Flow</Card.Title>
                    <Card.Description>
                      Income, recurring housing, and tracked transactions.
                    </Card.Description>
                  </Card.Header>
                  <Card.Content className="flex flex-col gap-4">
                    <ProgressRow
                      label="Base income"
                      value={monthlyIncome}
                      max={Math.max(monthlyIncome + transactionIncome, monthlyOutflow, 1)}
                    />
                    <ProgressRow
                      label="Extra income"
                      value={transactionIncome}
                      max={Math.max(monthlyIncome + transactionIncome, monthlyOutflow, 1)}
                    />
                    <ProgressRow
                      label="Total outflow"
                      value={monthlyOutflow}
                      max={Math.max(monthlyIncome + transactionIncome, monthlyOutflow, 1)}
                      tone="danger"
                    />
                    <div className="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-3">
                      <SmallStat label="Savings rate" value={`${savingsRate.toFixed(0)}%`} />
                      <SmallStat label="Emergency cover" value={`${emergencyMonths.toFixed(1)} mo`} />
                      <SmallStat label="Tracked expenses" value={formatMoney(transactionExpenses)} />
                    </div>
                  </Card.Content>
                </Card>

                <Card>
                  <Card.Header>
                    <Card.Title>Next Best Move</Card.Title>
                    <Card.Description>
                      {getGoalCopy(user.goal, monthlyFreeCash)}
                    </Card.Description>
                  </Card.Header>
                  <Card.Content className="flex flex-col gap-3">
                    {insights.map((insight) => (
                      <p key={insight} className="rounded-md bg-surface-secondary p-3 text-sm">
                        {insight}
                      </p>
                    ))}
                  </Card.Content>
                </Card>
              </div>

              <Card>
                <Card.Header>
                  <Card.Title>Recent Activity</Card.Title>
                  <Card.Description>Latest local transactions.</Card.Description>
                </Card.Header>
                <Card.Content className="flex flex-col gap-2">
                  {data.transactions.slice(0, 5).map((transaction) => (
                    <TransactionRow
                      key={transaction.id}
                      transaction={transaction}
                      onRemove={removeTransaction}
                    />
                  ))}
                </Card.Content>
              </Card>
            </section>
          )}

          {activeTab === "transactions" && (
            <section className="grid grid-cols-1 gap-4 lg:grid-cols-[0.85fr_1.15fr]">
              <Card>
                <Card.Header>
                  <Card.Title>Add Transaction</Card.Title>
                  <Card.Description>Manual entries keep the demo offline.</Card.Description>
                </Card.Header>
                <Card.Content className="flex flex-col gap-3">
                  <input
                    className="app-input"
                    onChange={(event) =>
                      setTransactionDraft((prev) => ({
                        ...prev,
                        title: event.target.value,
                      }))
                    }
                    placeholder="Title"
                    value={transactionDraft.title}
                  />
                  <input
                    className="app-input"
                    min="0"
                    onChange={(event) =>
                      setTransactionDraft((prev) => ({
                        ...prev,
                        amount: Number(event.target.value),
                      }))
                    }
                    placeholder="Amount"
                    type="number"
                    value={transactionDraft.amount || ""}
                  />
                  <select
                    className="app-input"
                    onChange={(event) =>
                      setTransactionDraft((prev) => ({
                        ...prev,
                        type: event.target.value as TransactionType,
                      }))
                    }
                    value={transactionDraft.type}
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                  <input
                    className="app-input"
                    list="categories"
                    onChange={(event) =>
                      setTransactionDraft((prev) => ({
                        ...prev,
                        category: event.target.value,
                      }))
                    }
                    placeholder="Category"
                    value={transactionDraft.category}
                  />
                  <datalist id="categories">
                    {categories.map((category) => (
                      <option key={category} value={category} />
                    ))}
                  </datalist>
                  <input
                    className="app-input"
                    onChange={(event) =>
                      setTransactionDraft((prev) => ({
                        ...prev,
                        date: event.target.value,
                      }))
                    }
                    type="date"
                    value={transactionDraft.date}
                  />
                  <Button onClick={addTransaction}>Add transaction</Button>
                </Card.Content>
              </Card>

              <Card>
                <Card.Header>
                  <Card.Title>Transactions</Card.Title>
                  <Card.Description>
                    {data.transactions.length} entries in local storage.
                  </Card.Description>
                </Card.Header>
                <Card.Content className="flex flex-col gap-2">
                  {data.transactions.map((transaction) => (
                    <TransactionRow
                      key={transaction.id}
                      transaction={transaction}
                      onRemove={removeTransaction}
                    />
                  ))}
                </Card.Content>
              </Card>
            </section>
          )}

          {activeTab === "budgets" && (
            <section className="grid grid-cols-1 gap-4 lg:grid-cols-[0.85fr_1.15fr]">
              <Card>
                <Card.Header>
                  <Card.Title>Add Budget</Card.Title>
                  <Card.Description>Set monthly limits by category.</Card.Description>
                </Card.Header>
                <Card.Content className="flex flex-col gap-3">
                  <input
                    className="app-input"
                    onChange={(event) =>
                      setBudgetDraft((prev) => ({ ...prev, name: event.target.value }))
                    }
                    placeholder="Category name"
                    value={budgetDraft.name}
                  />
                  <input
                    className="app-input"
                    min="0"
                    onChange={(event) =>
                      setBudgetDraft((prev) => ({
                        ...prev,
                        limit: Number(event.target.value),
                      }))
                    }
                    placeholder="Monthly limit"
                    type="number"
                    value={budgetDraft.limit || ""}
                  />
                  <Button onClick={addBudget}>Add budget</Button>
                </Card.Content>
              </Card>

              <Card>
                <Card.Header>
                  <Card.Title>Budget Planner</Card.Title>
                  <Card.Description>Compare planned limits with actual spending.</Card.Description>
                </Card.Header>
                <Card.Content className="flex flex-col gap-4">
                  {data.budgets.map((budget) => {
                    const spent = getCategorySpent(data.transactions, budget.name);
                    const percent = Math.min(100, (spent / budget.limit) * 100);

                    return (
                      <div key={budget.id} className="flex flex-col gap-2">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="font-semibold">{budget.name}</p>
                            <p className="text-sm text-muted">
                              {formatMoney(spent)} of {formatMoney(budget.limit)}
                            </p>
                          </div>
                          <button
                            className="text-sm text-danger"
                            onClick={() => removeBudget(budget.id)}
                            type="button"
                          >
                            Remove
                          </button>
                        </div>
                        <div className="h-3 overflow-hidden rounded-full bg-surface-secondary">
                          <div
                            className={`h-full rounded-full ${
                              spent > budget.limit ? "bg-danger" : "bg-accent"
                            }`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </Card.Content>
              </Card>
            </section>
          )}

          {activeTab === "goals" && (
            <section className="grid grid-cols-1 gap-4 lg:grid-cols-[0.85fr_1.15fr]">
              <Card>
                <Card.Header>
                  <Card.Title>Add Goal</Card.Title>
                  <Card.Description>Create simple savings targets.</Card.Description>
                </Card.Header>
                <Card.Content className="flex flex-col gap-3">
                  <input
                    className="app-input"
                    onChange={(event) =>
                      setGoalDraft((prev) => ({ ...prev, name: event.target.value }))
                    }
                    placeholder="Goal name"
                    value={goalDraft.name}
                  />
                  <input
                    className="app-input"
                    min="0"
                    onChange={(event) =>
                      setGoalDraft((prev) => ({
                        ...prev,
                        target: Number(event.target.value),
                      }))
                    }
                    placeholder="Target"
                    type="number"
                    value={goalDraft.target || ""}
                  />
                  <input
                    className="app-input"
                    min="0"
                    onChange={(event) =>
                      setGoalDraft((prev) => ({
                        ...prev,
                        current: Number(event.target.value),
                      }))
                    }
                    placeholder="Current amount"
                    type="number"
                    value={goalDraft.current || ""}
                  />
                  <Button onClick={addGoal}>Add goal</Button>
                </Card.Content>
              </Card>

              <Card>
                <Card.Header>
                  <Card.Title>Goal Tracker</Card.Title>
                  <Card.Description>Update progress without an account.</Card.Description>
                </Card.Header>
                <Card.Content className="flex flex-col gap-4">
                  {data.goals.map((goal) => {
                    const percent = Math.min(100, (goal.current / goal.target) * 100);

                    return (
                      <div key={goal.id} className="flex flex-col gap-2">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="font-semibold">{goal.name}</p>
                            <p className="text-sm text-muted">
                              {formatMoney(goal.current)} of {formatMoney(goal.target)}
                            </p>
                          </div>
                          <button
                            className="text-sm text-danger"
                            onClick={() => removeGoal(goal.id)}
                            type="button"
                          >
                            Remove
                          </button>
                        </div>
                        <input
                          className="app-input"
                          max={goal.target}
                          min="0"
                          onChange={(event) =>
                            updateGoalProgress(goal.id, Number(event.target.value))
                          }
                          type="range"
                          value={goal.current}
                        />
                        <div className="h-3 overflow-hidden rounded-full bg-surface-secondary">
                          <div
                            className="h-full rounded-full bg-accent"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </Card.Content>
              </Card>
            </section>
          )}

          {activeTab === "settings" && (
            <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <Card>
                <Card.Header>
                  <Card.Title>Backup</Card.Title>
                  <Card.Description>Export or import a local JSON snapshot.</Card.Description>
                </Card.Header>
                <Card.Content className="flex flex-col gap-3">
                  <Button onClick={exportData}>Export backup</Button>
                  <input className="app-input" onChange={importFile} type="file" accept=".json" />
                  <textarea
                    className="app-input min-h-48"
                    onChange={(event) => setImportText(event.target.value)}
                    placeholder="Paste backup JSON here"
                    value={importText}
                  />
                  <Button variant="secondary" onClick={importData}>
                    Import backup
                  </Button>
                  {importMessage && <p className="text-sm text-muted">{importMessage}</p>}
                </Card.Content>
              </Card>

              <Card>
                <Card.Header>
                  <Card.Title>Portfolio Notes</Card.Title>
                  <Card.Description>What this demo intentionally supports.</Card.Description>
                </Card.Header>
                <Card.Content className="flex flex-col gap-3 text-sm text-muted">
                  <p>Manual finance tracking with browser storage.</p>
                  <p>Budget and goal logic that updates instantly.</p>
                  <p>Data portability through JSON backup.</p>
                  <p>No login, no bank connection, no external API dependency.</p>
                </Card.Content>
              </Card>
            </section>
          )}
        </div>
      )}
    </main>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <Card.Header>
        <Card.Title>{label}</Card.Title>
        <Card.Description>{value}</Card.Description>
      </Card.Header>
    </Card>
  );
}

function SmallStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-surface-secondary p-3">
      <p className="text-sm text-muted">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  );
}

function ProgressRow({
  label,
  value,
  max,
  tone = "accent",
}: {
  label: string;
  value: number;
  max: number;
  tone?: "accent" | "danger";
}) {
  const width = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-3">
        <p className="font-medium">{label}</p>
        <p className="text-sm text-muted">{formatMoney(value)}</p>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-surface-secondary">
        <div
          className={`h-full rounded-full ${tone === "danger" ? "bg-danger" : "bg-accent"}`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}

function TransactionRow({
  transaction,
  onRemove,
}: {
  transaction: Transaction;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-[1fr_auto] items-center gap-3 rounded-md bg-surface-secondary p-3 sm:grid-cols-[1fr_auto_auto]">
      <div>
        <p className="font-semibold">{transaction.title}</p>
        <p className="text-sm text-muted">
          {transaction.category} · {transaction.date}
        </p>
      </div>
      <p
        className={`font-semibold ${
          transaction.type === "income" ? "text-accent" : "text-danger"
        }`}
      >
        {transaction.type === "income" ? "+" : "-"}
        {formatMoney(transaction.amount)}
      </p>
      <button
        className="text-left text-sm text-muted sm:text-right"
        onClick={() => onRemove(transaction.id)}
        type="button"
      >
        Remove
      </button>
    </div>
  );
}
