"use client";
import { Card } from "@heroui/react";
type SecondSlideProps = {
  selectedCards: number[];
  toggleCard: (idx: number) => void;
};

const CARDS_GOALS = ["Saving money", "Investing", "Debt extinction"];

export default function SecondSlide({
  selectedCards,
  toggleCard,
}: SecondSlideProps) {
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
