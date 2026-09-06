"use client";

import { User } from "@/types/User";
import FirstSlide from "./Slide1";
import { Card } from "@heroui/react";

type StartScreenProps = {
  user: User;
  appState: string;
  onAppChange: (state: string) => void;
  editUserField: <K extends keyof User>(key: K, value: User[K]) => void;
};

export default function StartScreen({
  user,
  editUserField,
  onAppChange,
}: StartScreenProps) {
  return (
    <Card>
      <Card.Header>
        <Card.Title>Some Information About your Goals</Card.Title>
      </Card.Header>

      <Card.Content>
        <FirstSlide
          onAppChange={onAppChange}
          user={user}
          editUserField={editUserField}
        />
      </Card.Content>
    </Card>
  );
}
