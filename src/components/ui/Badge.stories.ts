import '../../index.css';
import type { Meta, StoryObj } from '@storybook/react';
// Temporarily remove icon import
// import { CheckIcon } from 'lucide-react';
import React from 'react'; // Import React

// Import the component and the variant config
import { Badge, badgeVariants } from './badge';

const meta = {
  title: 'UI/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      // Manually list options as badgeVariants doesn't expose the config directly
      options: ['default', 'secondary', 'destructive', 'outline'],
      description: 'The visual style of the badge.',
    },
    children: {
      control: 'text', // Revert to text control for simplicity
      description: 'Badge content.',
    },
    asChild: {
      control: 'boolean',
      description: 'Render as a child element (e.g., within a link).',
      table: {
          disable: true,
      },
    },
    className: {
        control: 'text',
        description: 'Optional CSS classes.'
    }
  },
  // Add default args used by multiple stories
  args: {
    children: 'Badge',
    variant: 'default',
    asChild: false,
    className: '',
  },
} satisfies Meta<typeof Badge>;

export default meta;

type Story = StoryObj<typeof meta>;


// --- Primary Interactive Story ---

export const Interactive: Story = {
  // Args are inherited from meta.args
};

// --- Variant Demonstrations ---

export const Default: Story = {
  args: {
    variant: 'default',
    children: 'Default Badge',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Badge',
  },
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Destructive Badge',
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline Badge',
  },
};


// --- Specific Use Case Demonstrations (Simplified Placeholders) ---
// These are simplified due to persistent JSX parsing/runtime issues likely
// related to React 19 compatibility with the current Storybook/TS setup.

export const WithIcon: Story = {
  args: {
    variant: 'outline',
    className: 'gap-1', // Keep className for layout context
    children: 'With Icon (Placeholder)', // Use simple text
  },
  // Removed render function and complex children
};

export const WithIndicator: Story = {
    args: {
        variant: 'outline',
        className: 'gap-1.5', // Keep className for layout context
        children: 'With Indicator (Placeholder)', // Use simple text
    },
    // Removed render function and complex children
};

// Example showing asChild (less common for Badge, but possible)
/*
export const AsChildLink: Story = {
  args: {
    asChild: true,
    variant: 'secondary', // Example variant
    // Temporarily comment out complex child
    // children: <a href="#">Link Styled as Badge</a>
    children: 'As Child Link (Placeholder)'
  },
};
*/
