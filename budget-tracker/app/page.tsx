"use client";

import {
  Button,
  Card,
  Form,
  Input,
  Label,
  NumberField,
  TextField,
  Typography,
} from "@heroui/react";
import { useState } from "react";

type AppState = "start";

type User = {
  name: string;
  annualIncome: number;
  goals: number[];
};

const CARDS_GOALS = ["Saving money", "Investing", "Debt extinction"];

type FirstSlideProps = {
  user: User;
  editUserField: <K extends keyof User>(key: K, value: User[K]) => void;
};

type SlideControlsProps = {
  currentSlide: number;
  maxSlides: number;
  onSlideChange: (slide: number) => void;
};

function SlideControls({
  currentSlide,
  maxSlides,
  onSlideChange,
}: SlideControlsProps) {
  return (
    <div className="flex w-full justify-between items-center gap-4">
      <Button
        fullWidth
        isDisabled={currentSlide <= 0}
        onClick={() => onSlideChange(currentSlide - 1)}
        variant="secondary"
      >
        Back
      </Button>

      <Button
        fullWidth
        isDisabled={currentSlide >= maxSlides}
        onClick={() => onSlideChange(currentSlide + 1)}
      >
        Next
      </Button>
    </div>
  );
}

function FirstSlide({ user, editUserField }: FirstSlideProps) {
  return (
    <Form className="flex flex-col gap-4">
      <TextField isRequired name="name" type="text">
        <Label>Full Name</Label>
        <Input
          value={user.name}
          onChange={(e) => editUserField("name", e.target.value)}
          placeholder="Alessio Galtelli"
          variant="secondary"
        />
      </TextField>

      <NumberField
        variant="secondary"
        isRequired
        name="annualIncome"
        value={user.annualIncome}
        onChange={(value) => editUserField("annualIncome", value ?? 0)}
      >
        <Label>Income</Label>
        <NumberField.Group>
          <NumberField.DecrementButton />
          <NumberField.Input />
          <NumberField.IncrementButton />
        </NumberField.Group>
      </NumberField>
    </Form>
  );
}

type SecondSlideProps = {
  selectedCards: number[];
  toggleCard: (idx: number) => void;
};

function SecondSlide({ selectedCards, toggleCard }: SecondSlideProps) {
  return (
    <div className="flex flex-col gap-3">
      {CARDS_GOALS.map((goal, idx) => {
        const isSelected = selectedCards.includes(idx);

        return (
          <Card
            key={idx}
            variant="secondary"
            onClick={() => toggleCard(idx)}
            className={`cursor-pointer ${
              isSelected
                ? "border border-accent"
                : "border-0 border-transparent"
            }`}
          >
            <Card.Title>{goal}</Card.Title>
          </Card>
        );
      })}
    </div>
  );
}
function StartScreen() {
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  const [user, setUser] = useState<User>({
    name: "",
    annualIncome: 0,
    goals: [],
  });

  function toggleCard(idx: number) {
    setSelectedCards((prev) =>
      prev.includes(idx)
        ? prev.filter((cardIdx) => cardIdx !== idx)
        : [...prev, idx],
    );
  }

  function editUserField<K extends keyof User>(key: K, value: User[K]) {
    setUser((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  const slides = [
    <FirstSlide key="first" user={user} editUserField={editUserField} />,
    <SecondSlide
      key="second"
      selectedCards={selectedCards}
      toggleCard={toggleCard}
    />,
  ];

  return (
    <Card>
      <Card.Header>
        <Card.Title>Some Information About your Goals</Card.Title>
      </Card.Header>
      <Card.Content>{slides[currentSlide]}</Card.Content>
      <SlideControls
        currentSlide={currentSlide}
        maxSlides={slides.length - 1}
        onSlideChange={setCurrentSlide}
      />
    </Card>
  );
}

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
