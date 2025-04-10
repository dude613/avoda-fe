import '../../index.css';
import type { Meta, StoryObj } from '@storybook/react';
// Import the config object as well
import { Button, buttonVariantConfig } from './button';

const meta = {
  title: 'UI/Button', // Updated title for better organization
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      // Use the imported config object
      options: Object.keys(buttonVariantConfig.variants.variant),
      description: 'The visual style of the button.',
    },
    size: {
      control: { type: 'select' },
      // Use the imported config object
      options: Object.keys(buttonVariantConfig.variants.size),
      description: 'The size of the button.',
    },
    isLoading: {
      control: 'boolean',
      description: 'Show loading state.',
    },
    loadingText: {
      control: 'text',
      description: 'Text to display when loading (optional).',
      if: { arg: 'isLoading', eq: true }, // Only show if isLoading is true
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the button.',
    },
    asChild: {
      control: 'boolean',
      description: 'Render as a child element (e.g., link).',
    },
    children: {
      control: 'text',
      description: 'Button label/content.',
    },
    icon: {
      control: false, // Disable control for complex icon prop
      description: 'Optional icon element.',
    },
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>; // Use meta here for better type inference with argTypes

// --- Primary Interactive Story ---

export const Interactive: Story = {
  args: {
    variant: 'default',
    size: 'default',
    isLoading: false,
    loadingText: '',
    disabled: false,
    children: 'Button',
    asChild: false,
  },
  // Render function needed if we want to dynamically add icon based on controls (but icon control is disabled)
  // If we wanted an optional icon control, it would be more complex.
};

// --- Specific Prop Demonstrations ---

export const Small: Story = {
  args: {
    ...Interactive.args, // Start with default args
    size: 'sm',
    children: 'Small Button',
  },
};

export const Large: Story = {
  args: {
    ...Interactive.args,
    size: 'lg',
    children: 'Large Button',
  },
};

/* export const IconOnly: Story = {
  args: {
    variant: 'outline', // Use a variant that suits icon-only
    size: 'icon',
    // No children needed
  },
  render: (args) => { // Render function to add the icon
    return <Button {...args} icon={<Mail />} />;
  },
};

export const WithIcon: Story = {
  args: {
    ...Interactive.args,
    children: 'Button With Icon',
  },
  render: (args) => { // Render function to add the icon
    return <Button {...args} icon={<Mail />} />;
  },
}; */

export const Loading: Story = {
  args: {
    ...Interactive.args,
    children: 'Loading...', // Provide relevant children text
    isLoading: true,
  },
};

export const LoadingWithCustomText: Story = {
  args: {
    ...Interactive.args,
    variant: 'secondary',
    isLoading: true,
    loadingText: 'Processing...',
    children: 'Hidden Text', // Children are hidden by loading state + text
  },
};

export const Disabled: Story = {
  args: {
    ...Interactive.args,
    children: 'Disabled Button',
    disabled: true,
  },
};

/* export const AsChildLink: Story = {
  args: {
    asChild: true,
    variant: 'link', // Use link variant for a common use case
  },
  render: (args) => { // Render function to provide the child link
    return (
      <Button {...args}>
        <a href="#">Link Styled as Button</a>
      </Button>
    );
  },
};
 */
