import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { Card } from './card';
import { Button } from './button'; // Example child component
import '../../index.css'; // Import base CSS

const meta = {
  title: 'UI/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered', // Center the card in the preview
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'elevated'],
      description: 'Visual style variant (shadow).',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Size variant (padding and max-width).',
    },
    layout: {
      control: { type: 'select' },
      options: ['default', 'centered', 'spaced', 'centeredAndSpaced'],
      description: 'Layout variant (centering and spacing).',
    },
    children: {
      control: 'text', // Allow basic text content control
      description: 'Content inside the card.',
    },
    // className could be added if needed: { control: 'text' }
  },
} satisfies Meta<typeof Card>;

export default meta;

// Define the type for the story's args based on argTypes
type StoryArgs = React.ComponentProps<typeof Card> & {
  children?: React.ReactNode; // Ensure children is part of the type
};


type Story = StoryObj<StoryArgs>;

// Interactive story
export const Interactive: Story = {
  args: {
    variant: 'default',
    size: 'sm',
    layout: 'default',
    children: 'This is the card content. You can change it in the Controls panel.',
  },
  // Render function allows more complex children if needed,
  // but basic text is controlled by args.children
  render: (args) => (
    <Card {...args}>
      {/* Render text content from args */}
      {typeof args.children === 'string' ? <p>{args.children}</p> : args.children}

      {/* Add some example fixed content for context if args.children is simple text */}
      {typeof args.children === 'string' && (
        <div className="mt-4 flex justify-end">
          <Button size="sm">Action</Button>
        </div>
      )}
    </Card>
  ),
};

// Example: Elevated Card
export const Elevated: Story = {
  args: {
    ...Interactive.args, // Inherit default args
    variant: 'elevated',
    children: 'This card has more shadow.',
  },
  render: Interactive.render,
};

// Example: Large Card
export const Large: Story = {
  args: {
    ...Interactive.args,
    size: 'lg',
    children: 'This is a larger card with more padding.',
  },
  render: Interactive.render,
};

// Example: Centered and Spaced Layout
export const CenteredSpaced: Story = {
  args: {
    ...Interactive.args,
    layout: 'centeredAndSpaced',
    children: 'This card content is centered and has spacing.',
  },
  render: (args) => (
    // Need to wrap in a container for centering to be visible
    <div className="w-full p-4">
      <Card {...args}>
        <h3 className="text-lg font-semibold">Card Title</h3>
        <p>{args.children}</p>
        <div className="flex justify-end">
          <Button variant="secondary" size="sm">Cancel</Button>
          <Button size="sm" className="ml-2">Confirm</Button>
        </div>
      </Card>
    </div>
  ),
};
