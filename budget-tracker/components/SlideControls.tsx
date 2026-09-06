"use client";
import { Button } from "@heroui/react";

type SlideControlsProps = {
  currentSlide: number;
  maxSlides: number;
  onSlideChange: (slide: number) => void;
};

export default function SlideControls({
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
