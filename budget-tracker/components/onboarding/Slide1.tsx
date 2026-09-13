"use client";

import { User } from "@/types/User";
import {
  Form,
  Input,
  Label,
  NumberField,
  TextField,
  Select,
  ListBox,
  Button,
} from "@heroui/react";

type AppState = "start" | "home";

type FirstSlideProps = {
  user: User;
  onAppChange: (state: AppState) => void;
  editUserField: <K extends keyof User>(key: K, value: User[K]) => void;
};

const GOALS = ["savings", "investment", "debt-free"] as const;

export default function FirstSlide({
  user,
  editUserField,
  onAppChange,
}: FirstSlideProps) {
  return (
    <Form
      className="flex flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        onAppChange("home");
      }}
    >
      <TextField isRequired name="name" type="text">
        <Label>Full Name</Label>

        <Input
          value={user.name}
          onChange={(e) => editUserField("name", e.target.value)}
          placeholder="Full name"
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
        <Label>Yearly Income</Label>

        <NumberField.Group>
          <NumberField.DecrementButton />
          <NumberField.Input />
          <NumberField.IncrementButton />
        </NumberField.Group>
      </NumberField>

      <NumberField
        variant="secondary"
        isRequired
        name="savings"
        value={user.savings}
        onChange={(value) => editUserField("savings", value ?? 0)}
      >
        <Label>Savings</Label>

        <NumberField.Group>
          <NumberField.DecrementButton />
          <NumberField.Input />
          <NumberField.IncrementButton />
        </NumberField.Group>
      </NumberField>

      <NumberField
        variant="secondary"
        isRequired
        name="debt"
        value={user.debt}
        onChange={(value) => editUserField("debt", value ?? 0)}
      >
        <Label>Debt</Label>

        <NumberField.Group>
          <NumberField.DecrementButton />
          <NumberField.Input />
          <NumberField.IncrementButton />
        </NumberField.Group>
      </NumberField>

      <NumberField
        variant="secondary"
        isRequired
        name="investments"
        value={user.investments}
        onChange={(value) => editUserField("investments", value ?? 0)}
      >
        <Label>Investments</Label>
        <NumberField.Group>
          <NumberField.DecrementButton />
          <NumberField.Input />
          <NumberField.IncrementButton />
        </NumberField.Group>
      </NumberField>

      <NumberField
        variant="secondary"
        isRequired
        name="housingExpenses"
        value={user.housingExpenses}
        onChange={(value) => editUserField("housingExpenses", value ?? 0)}
      >
        <Label>Housing expenses</Label>
        <NumberField.Group>
          <NumberField.DecrementButton />
          <NumberField.Input />
          <NumberField.IncrementButton />
        </NumberField.Group>
      </NumberField>

      <Select
        variant="secondary"
        selectedKey={user.goal}
        onSelectionChange={(value) =>
          editUserField("goal", value as User["goal"])
        }
      >
        <Label>Goal</Label>

        <Select.Trigger>
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>

        <Select.Popover>
          <ListBox>
            {GOALS.map((goal) => (
              <ListBox.Item key={goal} id={goal}>
                {goal}
                <ListBox.ItemIndicator />
              </ListBox.Item>
            ))}
          </ListBox>
        </Select.Popover>
      </Select>

      <Button fullWidth className="mt-2" type="submit">
        Continue
      </Button>
    </Form>
  );
}
