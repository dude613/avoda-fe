import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Calendar } from "./calendar";

/**
 * Storybook stories for the Calendar component.
 * Demonstrates basic usage and month/year navigation.
 * @module CalendarStories
 */

const meta: Meta = {
  title: "UI/Calendar",
  component: Calendar,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj;

export const Basic: Story = {
  render: () => <Calendar />,
};

export const WithClassName: Story = {
  render: () => <Calendar className="border-2 border-blue-400" />,
};

export const ControlledMonth: Story = {
  render: () => {
    const [month, setMonth] = React.useState(new Date());
    return <Calendar month={month} onMonthChange={setMonth} />;
  },
};
