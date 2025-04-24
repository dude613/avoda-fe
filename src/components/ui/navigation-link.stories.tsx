import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { NavigationLink } from "./navigation-link";
import { MemoryRouter } from "react-router-dom";

/**
 * Storybook stories for the NavigationLink component.
 * Demonstrates all variants, sizes, and underline.
 * @module NavigationLinkStories
 */

const meta: Meta = {
  title: "UI/NavigationLink",
  component: NavigationLink,
  decorators: [
    (Story) => <MemoryRouter>{Story()}</MemoryRouter>,
  ],
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj;

export const Basic: Story = {
  render: () => <NavigationLink to="/">Home</NavigationLink>,
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 16 }}>
      <NavigationLink to="/" variant="link">Link</NavigationLink>
      <NavigationLink to="/" variant="ghost">Ghost</NavigationLink>
      <NavigationLink to="/" variant="outline">Outline</NavigationLink>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 16 }}>
      <NavigationLink to="/" size="sm">Small</NavigationLink>
      <NavigationLink to="/" size="default">Default</NavigationLink>
      <NavigationLink to="/" size="lg">Large</NavigationLink>
      <NavigationLink to="/" size="icon">Icon</NavigationLink>
    </div>
  ),
};

export const Underline: Story = {
  render: () => (
    <NavigationLink to="/" underline>Underlined Link</NavigationLink>
  ),
};
