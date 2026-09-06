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
} from "@heroui/react";
type FirstSlideProps = {
  user: User;
  editUserField: <K extends keyof User>(key: K, value: User[K]) => void;
};
const STATUS = ["single", "in a relationship", "married"];
const JOB = ["part-time", "indeterminated", "unemployed"];
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

      <Select variant="secondary">
        <Label>Status</Label>
        <Select.Trigger>
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>
        <Select.Popover>
          <ListBox>
            {STATUS.map((s, i) => (
              <ListBox.Item id={s}>
                {s}
                <ListBox.ItemIndicator />
              </ListBox.Item>
            ))}
          </ListBox>
        </Select.Popover>
      </Select>

      <Select variant="secondary">
        <Label>Job</Label>
        <Select.Trigger>
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>
        <Select.Popover>
          <ListBox>
            {JOB.map((s, i) => (
              <ListBox.Item id={s}>
                {s}
                <ListBox.ItemIndicator />
              </ListBox.Item>
            ))}
          </ListBox>
        </Select.Popover>
      </Select>

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

      <NumberField
        variant="secondary"
        isRequired
        name="annualIncome"
        value={user.annualIncome}
        onChange={(value) => editUserField("annualIncome", value ?? 0)}
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
        name="annualIncome"
        value={user.annualIncome}
        onChange={(value) => editUserField("annualIncome", value ?? 0)}
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
        name="annualIncome"
        value={user.annualIncome}
        onChange={(value) => editUserField("annualIncome", value ?? 0)}
      >
        <Label>Investments</Label>
        <NumberField.Group>
          <NumberField.DecrementButton />
          <NumberField.Input />
          <NumberField.IncrementButton />
        </NumberField.Group>
      </NumberField>
    </Form>
  );
}
