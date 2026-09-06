"use client";
import { User } from "@/types/User";
import { Form, Input, Label, NumberField, TextField } from "@heroui/react";
type FirstSlideProps = {
  user: User;
  editUserField: <K extends keyof User>(key: K, value: User[K]) => void;
};

export default function FirstSlide({ user, editUserField }: FirstSlideProps) {
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
