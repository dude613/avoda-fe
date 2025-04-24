import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Skeleton } from "./skeleton";

/**
 * Storybook stories for the Skeleton component.
 * Demonstrates controls for width, height, and className.
 * @module SkeletonStories
 */

const meta: Meta<typeof Skeleton> = {
  title: "UI/Skeleton",
  component: Skeleton,
  tags: ["autodocs"],
  argTypes: {
    className: { control: 'text', description: 'Custom className for styling.' },
    style: { control: 'object', description: 'Inline style object.' },
  },
};
export default meta;

type Story = StoryObj<typeof Skeleton>;

export const Basic: Story = {
  args: {
    style: { width: 120, height: 24 },
  },
};

export const CustomSize: Story = {
  args: {
    style: { width: 240, height: 40 },
    className: "rounded-full",
  },
};
