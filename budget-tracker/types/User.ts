export type User = {
  name: string;
  annualIncome: number;
  monthlyIncome?: number;

  job: "part-time" | "indeterminated" | "unemployed";

  debt: number;
  savings: number;
  investments: number;

  status: "married" | "single" | "in a relationship";

  goals: Goal[];
};

export type Goal = {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
  priority: "low" | "medium" | "high";
};
