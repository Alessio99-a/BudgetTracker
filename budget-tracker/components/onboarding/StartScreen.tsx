"use client";
import { useState } from "react";
import { User } from "@/types/User";
import FirstSlide from "./Slide1";
import SecondSlide from "./Slide2";
import SlideControls from "../SlideControls";
import { Card } from "@heroui/react";

export default function StartScreen() {
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
