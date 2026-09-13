export type User = {
  name: string;
  annualIncome: number;
  monthlyIncome?: number;
  housingExpenses: number;

  debt: number;
  savings: number;
  investments: number;

  status: "married" | "single" | "in a relationship";

  goal: "savings" | "investment" | "debt-free";
};

// export type Goal = {
//   id: string;
//   name: string;
//   targetAmount: number;
//   currentAmount: number;
//   deadline?: string;
//   priority: "low" | "medium" | "high";
// };
