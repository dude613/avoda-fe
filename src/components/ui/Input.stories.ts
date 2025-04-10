import '../../index.css';
import type { Meta, StoryObj } from '@storybook/react';

import {Input} from './input';

const meta = {
  title: 'UI/Input', // Group under UI like Button
  component: Input,
  tags: ['autodocs'],
  argTypes: { // Add argTypes for controls
    label: {
      control: 'text',
      description: 'Optional label displayed above the input.',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text for the input.',
    },
    type: {
      control: { type: 'select' },
      options: ['text', 'password', 'email', 'number', 'file', 'search', 'tel', 'url'],
      description: 'Input type attribute.',
    },
    error: {
      control: 'boolean',
      description: 'Applies error styling (e.g., red border).',
    },
    errorMessage: {
      control: 'text',
      description: 'Error message text displayed below the input.',
      if: { arg: 'error', eq: true }, // Only show if error is true
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the input.',
    },
    // Add other relevant HTML input attributes if needed
    // value: { control: 'text' }, // Could add this to control value directly
    // readOnly: { control: 'boolean' },
    // required: { control: 'boolean' },
  },
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>; // Use meta for better type inference

// Rename Default to Interactive and add default args for new controls
export const Interactive: Story = {
  args: {
    type: 'text',
    label: 'Interactive Label',
    placeholder: 'Interactive Input',
    error: false,
    errorMessage: 'This is an error message.',
    disabled: false,
    id: 'interactive-input', // Add id for label association
  },
};

export const File: Story = {
  args: {
    type: 'file',
    accept: '.jpg,.png,.pdf',
  },
};

// --- Additional Stories ---

export const WithLabel: Story = {
  args: {
    label: 'Email Address',
    placeholder: 'you@example.com',
    type: 'email',
    id: 'email-input', // Add id for label association
  },
};

export const WithErrorState: Story = {
  args: {
    label: 'Username',
    placeholder: 'Enter username',
    error: true, // Boolean error state
    id: 'username-error-state',
  },
};

export const WithErrorStateWithMessage: Story = {
  args: {
    label: 'Confirm Password',
    placeholder: 'Re-enter password',
    type: 'password',
    error: true, // Set error state for styling
    errorMessage: 'Passwords do not match.', // Provide the message text
    id: 'confirm-password-error-message',
  },
};

export const Disabled: Story = {
  args: {
    placeholder: 'Cannot edit this',
    disabled: true,
  },
};

export const Password: Story = {
  args: {
    label: 'Password',
    placeholder: 'Enter your password',
    type: 'password',
    id: 'password-input',
  },
};

export const Email: Story = {
  args: {
    label: 'Email for Newsletter',
    placeholder: 'newsletter@domain.com',
    type: 'email',
    id: 'email-newsletter',
  },
};

export const Number: Story = {
  args: {
    label: 'Quantity',
    placeholder: '0',
    type: 'number',
    min: 0,
    max: 10,
    id: 'quantity-input',
  },
};
