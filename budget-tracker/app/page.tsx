"use client";

import StartScreen from "@/components/onboarding/StartScreen";
import { Typography } from "@heroui/react";
import { useEffect, useState } from "react";
import { User } from "@/types/User";

type AppState = "start" | "home";

const defaultUser: User = {
  name: "",
  annualIncome: 0,
  monthlyIncome: 0,
  job: "part-time",
  debt: 0,
  savings: 0,
  investments: 0,
  status: "single",
  goals: [],
};

export default function Home() {
  const [appState, setAppState] = useState<AppState>("start");
  const [user, setUser] = useState<User>(defaultUser);

  useEffect(() => {
    const userSaved = localStorage.getItem("user");

    if (!userSaved) return;

    try {
      const savedUser = JSON.parse(userSaved) as User;

      setUser(savedUser);
      setAppState("home");
    } catch (error) {
      console.error("Failed to parse saved user:", error);
      localStorage.removeItem("user");
    }
  }, []);

  function updateUser<K extends keyof User>(key: K, value: User[K]) {
    setUser((prev) => {
      const updated = {
        ...prev,
        [key]: value,
      };

      localStorage.setItem("user", JSON.stringify(updated));

      return updated;
    });
  }

  return (
    <div
      className="p-8 flex flex-col gap-8 justify-center w-full m-auto"
      style={{ width: "min(720px, 100%)" }}
    >
      <Typography type="h1" className="text-accent font-bold text-5xl">
        Budget Tracker
      </Typography>

      {appState === "start" && (
        <StartScreen
          appState={appState}
          onAppChange={(state) => setAppState(state as "home")}
          user={user}
          editUserField={updateUser}
        />
      )}

      {appState === "home" && (
        <div className="w-full h-full">Welcome, {user.name}</div>
      )}
    </div>
  );
}
