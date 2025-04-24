import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { CircularLoading } from "./circular-loading";

/**
 * Storybook stories for the CircularLoading spinner component.
 * Demonstrates all variants and sizes.
 * @module CircularLoadingStories
 */

const meta: Meta<typeof CircularLoading> = {
  title: "UI/CircularLoading",
  component: CircularLoading,
  tags: ["autodocs"],
  argTypes: {
    variant: { control: { type: 'select', options: ['default', 'primary', 'destructive'] }, description: 'Spinner color variant.' },
    size: { control: { type: 'select', options: ['sm', 'md', 'lg'] }, description: 'Spinner size.' },
    className: { control: 'text', description: 'Custom className for styling.' },
    style: { control: 'object', description: 'Inline style object.' },
  },
  args: {
    variant: 'default',
    size: 'md',
    className: '',
    style: {},
  }
};
export default meta;

/**
 * @typedef {object} CircularLoadingStoryArgs
 * @property {'default'|'primary'|'destructive'} variant - Spinner color variant
 * @property {'sm'|'md'|'lg'} size - Spinner size
 * @property {string=} className - Custom className for styling
 * @property {object=} style - Inline style object
 */

/**
 * Storybook Story type for CircularLoading
 */
type CircularLoadingStoryArgs = {
  variant: 'default' | 'primary' | 'destructive';
  size: 'sm' | 'md' | 'lg';
  className?: string;
  style?: object;
};
type Story = StoryObj<CircularLoadingStoryArgs>;

export const Basic: Story = {
  args: meta.args,
  render: (args) => <CircularLoading {...args} />,
};

export const Variants: Story = {
  /**
   * Interactive story for all variants of CircularLoading
   */
  args: { ...meta.args },
  render: (args) => (
    <div style={{ display: "flex", gap: 24 }}>
      {['default', 'primary', 'destructive'].map((variant) => (
        <CircularLoading key={variant} {...args} variant={variant as 'default' | 'primary' | 'destructive'} />
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  /**
   * Interactive story for all sizes of CircularLoading
   */
  args: { ...meta.args },
  render: (args) => (
    <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <CircularLoading key={size} {...args} size={size} />
      ))}
    </div>
  ),
};

export const AllCombinations: Story = {
  /**
   * Interactive story showing all variant/size combinations
   */
  args: { ...meta.args },
  render: (args) => (
    <div style={{ display: "flex", gap: 32 }}>
      {(['default', 'primary', 'destructive'] as const).map((variant) => (
        <div key={variant} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <span>{variant}</span>
          {(['sm', 'md', 'lg'] as const).map((size) => (
            <CircularLoading
              key={size}
              {...args}
              variant={variant}
              size={size}
            />
          ))}
        </div>
      ))}
    </div>
  ),
};
