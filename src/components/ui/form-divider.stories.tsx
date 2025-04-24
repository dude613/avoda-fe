import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { FormDivider } from "./form-divider";

/**
 * Storybook stories for the FormDivider component.
 * Demonstrates all variants and sizes.
 * @module FormDividerStories
 */

const meta: Meta = {
  title: "UI/FormDivider",
  component: FormDivider,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj;

export const Basic: Story = {
  render: () => <FormDivider text="or" />,
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <FormDivider text="Default" variant="default" />
      <FormDivider text="Destructive" variant="destructive" />
      <FormDivider text="Muted" variant="muted" />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <FormDivider text="Small" size="sm" />
      <FormDivider text="Medium" size="md" />
      <FormDivider text="Large" size="lg" />
    </div>
  ),
};

export const Combined: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <FormDivider text="Default/Small" variant="default" size="sm" />
      <FormDivider text="Muted/Large" variant="muted" size="lg" />
      <FormDivider text="Destructive/Medium" variant="destructive" size="md" />
    </div>
  ),
};
