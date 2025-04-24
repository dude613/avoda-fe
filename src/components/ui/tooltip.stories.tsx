import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "./tooltip";

/**
 * Storybook stories for the Tooltip component suite.
 * Demonstrates controls for content and side.
 * @module TooltipStories
 */

const meta: Meta = {
  title: "UI/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
  argTypes: {
    content: { control: 'text', description: 'Tooltip content.' },
    side: { control: { type: 'select', options: ['top', 'right', 'bottom', 'left'] }, description: 'Tooltip side.' },
  },
};
export default meta;

type Story = StoryObj;

export const Basic: Story = {
  args: {
    content: 'Tooltip text',
    side: 'top',
  },
  render: (args) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button type="button">Hover me</button>
        </TooltipTrigger>
        <TooltipContent side={args.side}>{args.content}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
};
