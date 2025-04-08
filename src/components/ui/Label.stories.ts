import '../../index.css';
import type { Meta, StoryObj } from '@storybook/react';
import { Label } from './label'; // Assuming this structure

const meta = {
  title: 'UI/Label',
  component: Label,
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: 'text',
      description: 'The text content of the label.',
    },
    htmlFor: {
      control: 'text',
      description: 'The id of the associated input element.',
    },
    variant: {
      control: { type: 'select' },
      options: ['default'], // Currently only "default" is available
      description: 'The variant style of the label.',
    },
    className: {
      control: 'text',
      description: 'Additional custom CSS classes to apply.',
    },
  },
} satisfies Meta<typeof Label>;

export default meta;

type Story = StoryObj<typeof meta>;

// A basic interactive Label story
export const Interactive: Story = {
  args: {
    children: 'Interactive Label',
    htmlFor: 'interactive-input',
    variant: 'default',
  },
};

// Label with an additional custom class for demonstration
export const WithCustomClass: Story = {
  args: {
    children: 'Custom Styled Label',
    htmlFor: 'custom-input',
    variant: 'default',
    className: 'text-blue-500 underline',
  },
};

// Label rendered without an htmlFor attribute
export const WithoutHtmlFor: Story = {
  args: {
    children: 'Label without htmlFor',
    variant: 'default',
  },
};
