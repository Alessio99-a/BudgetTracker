"use client";
import StartScreen from "@/components/onboarding/StartScreen";
import { Card, Typography } from "@heroui/react";
import { useState } from "react";
type AppState = "start";

const APP_STATE = {
  start: StartScreen,
};

export default function Home() {
  const [appState] = useState<AppState>("start");

  return (
    <div
      className="p-8 flex flex-col gap-8"
      style={{ width: "min(720px, 100%)" }}
    >
      <Typography type="h1" className="text-accent font-bold text-5xl">
        Budget Tracker
      </Typography>
      {APP_STATE[appState]()}
    </div>
  );
}
