import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { IconContainer } from "./icon-container";
import { Check } from "lucide-react";

/**
 * Storybook stories for the IconContainer component.
 * Demonstrates usage with different icons and custom classes.
 * @module IconContainerStories
 */

const meta: Meta = {
  title: "UI/IconContainer",
  component: IconContainer,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj;

export const Basic: Story = {
  render: () => (
    <IconContainer>
      <Check />
    </IconContainer>
  ),
};

export const WithCustomSize: Story = {
  render: () => (
    <IconContainer className="w-16 h-16">
      <Check size={32} />
    </IconContainer>
  ),
};

export const WithDifferentIcon: Story = {
  render: () => (
    <IconContainer>
      <span role="img" aria-label="star">⭐</span>
    </IconContainer>
  ),
};
