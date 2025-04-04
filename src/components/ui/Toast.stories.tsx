import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { Button } from './button'; // Button to trigger the toast
import { Toaster } from './toaster'; // Toaster to display toasts
import { ToastAction } from './toast'; // Action component for the toast
import { toast } from '@/hooks/use-toast'; // Hook to trigger toasts
import '../../index.css'; // Import base CSS

const meta = {
  title: 'UI/Toast',
  component: Toaster, // Although we trigger via button, Toaster is the container
  tags: ['autodocs'],
  parameters: {
    // Center the button in the preview
    layout: 'centered',
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Optional title for the toast.',
    },
    description: {
      control: 'text',
      description: 'Optional description for the toast.',
    },
     variant: {
       control: { type: 'select' },
       options: ['default', 'destructive', 'success'], // Add 'success' here
       description: 'Visual style of the toast.',
     },
     withAction: {
      control: 'boolean',
      description: 'Include an "Undo" action button in the toast.',
    },
    // Note: We don't control Toaster props directly here,
    // but the props for the toast() function call.
  },
} satisfies Meta<typeof Toaster>; // Use Toaster here, but args control the toast() call

export default meta;

// Define the type for the story's args based on argTypes
type StoryArgs = {
  variant?: 'default' | 'destructive' | 'success';
  title?: string;
  withAction?: boolean;
  description?: string;
};

type Story = StoryObj<StoryArgs>; // Use custom StoryArgs type

// Interactive story that renders a button to trigger toasts
export const Interactive: Story = {
  args: {
    // Default values for the controls
    variant: 'default',
    title: 'Scheduled: Catch up',
    description: 'Friday, February 10, 2023 at 5:57 PM',
    withAction: true,
  },
  render: (args) => {
    const handleShowToast = () => {
      toast({
        title: args.title,
        description: args.description,
        variant: args.variant,
        action: args.withAction ? (
          <ToastAction altText="Undo action">Undo</ToastAction>
        ) : undefined,
      });
    };

    return (
      <div>
        {/* Toaster is needed to render the toasts */}
        <Toaster />
        {/* Button triggers the toast based on args */}
        <Button onClick={handleShowToast}>Show Toast</Button>
      </div>
    );
  },
};

// Example of a simple default toast
export const DefaultToast: Story = {
  args: {
    title: 'Update Available',
    description: 'A new version has been downloaded.',
    variant: 'default',
    withAction: false,
  },
  render: Interactive.render, // Reuse the render function
};

// Example of a destructive toast
export const DestructiveToast: Story = {
  args: {
    title: 'Error',
    description: 'Failed to save changes.',
    variant: 'destructive',
    withAction: true,
  },
  render: Interactive.render, // Reuse the render function
};

// Example of a success toast
export const SuccessToast: Story = {
  args: {
    title: 'Success',
    description: 'Operation completed successfully.',
    variant: 'success',
    withAction: false,
  },
  render: Interactive.render, // Reuse the render function
};

// Example with only a title
export const TitleOnly: Story = {
    args: {
        title: 'Event Created',
        variant: 'default',
        withAction: false,
    },
    render: Interactive.render,
};

// Example with only a description
export const DescriptionOnly: Story = {
    args: {
        description: 'Your profile has been updated successfully.',
        variant: 'default',
        withAction: false,
    },
    render: Interactive.render,
};
