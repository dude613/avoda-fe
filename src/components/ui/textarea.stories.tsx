import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Textarea } from "./textarea";

/**
 * Storybook stories for the Textarea component.
 * Demonstrates controls for value, placeholder, disabled, and rows.
 * @module TextareaStories
 */

const meta: Meta<typeof Textarea> = {
  title: "UI/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  argTypes: {
    value: { control: 'text', description: 'Textarea value.' },
    placeholder: { control: 'text', description: 'Placeholder text.' },
    disabled: { control: 'boolean', description: 'Disabled state.' },
    rows: { control: { type: 'number', min: 1, max: 10 }, description: 'Number of rows.' },
  },
};
export default meta;

type Story = StoryObj<typeof Textarea>;

export const Basic: Story = {
  args: {
    value: '',
    placeholder: 'Type here...',
    disabled: false,
    rows: 4,
  },
  render: (args) => {
    const [value, setValue] = useState(args.value);
    return <Textarea {...args} value={value} onChange={e => setValue(e.target.value)} />;
  },
};
