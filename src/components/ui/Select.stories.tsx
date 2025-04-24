import type { Meta, StoryObj } from '@storybook/react';

import { Select } from '@/components/ui/select';
import { Label } from '@/components/ui/label'; // Import Label for association
import '@/index.css'; // Import base CSS

const meta = {
  title: 'UI/Select',
  component: Select,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    // label is handled in render, not a direct prop of Select
    error: {
      control: 'boolean',
      description: 'Applies error styling.',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the select.',
    },
    required: {
      control: 'boolean',
      description: 'Sets the required attribute.',
    },
    multiple: {
      control: 'boolean',
      description: 'Allows multiple selections.',
    },
    // helperText is handled in render, not a direct prop of Select
    // We don't control 'children' (options) via args, they are hardcoded in render
  },
} satisfies Meta<typeof Select>;

export default meta;

// Define the type for the story's args based on argTypes
type StoryArgs = {
  label?: string;
  error?: boolean;
  disabled?: boolean;
  required?: boolean;
  multiple?: boolean;
  helperText?: string; // Add helperText to args type
  // Add a unique ID for label association
  id?: string;
};

type Story = StoryObj<StoryArgs>;

// Interactive story
export const Interactive: Story = {
  args: {
    label: 'Favorite Fruit',
    error: false,
    disabled: false,
    required: false,
    multiple: false,
    helperText: 'Select your most preferred fruit.', // Default helper text
    id: 'favorite-fruit-select', // Unique ID for the select
  },
  render: (args) => (
    <div className="w-64 space-y-1">
      {args.label && (
        <Label htmlFor={args.id}>
          {args.label}
          {/* Add required indicator */}
          {args.required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      <Select
        id={args.id}
        disabled={args.disabled}
        error={args.error}
        required={args.required}
        multiple={args.multiple}
      // Add defaultValue or value if needed for controlled state in real apps
      >
        <option value="apple">Apple</option>
        <option value="banana">Banana</option>
        <option value="blueberry">Blueberry</option>
        <option value="grapes">Grapes</option>
        <option value="pineapple">Pineapple</option>
      </Select>
      {args.error && (
        <p className="text-sm text-destructive mt-1">This field is required (example error).</p>
      )}
      {/* Add helper text (only show if no error) */}
      {args.helperText && !args.error && (
        <p className="text-xs text-muted-foreground mt-1">{args.helperText}</p>
      )}
    </div>
  ),
};

// Example: With Helper Text
export const WithHelperText: Story = {
  args: {
    ...Interactive.args,
    label: 'Select Framework',
    helperText: "Choose the framework you're most comfortable with.",
    id: 'framework-select-helper',
  },
  render: Interactive.render,
};

// Example: Required Field
export const RequiredField: Story = {
  args: {
    ...Interactive.args,
    label: 'Select Size',
    required: true,
    helperText: 'Size selection is mandatory.',
    id: 'size-select-required',
  },
  render: Interactive.render,
};

// Example: Error State
export const ErrorState: Story = {
  args: {
    ...Interactive.args, // Inherit default args
    label: 'Select Country',
    error: true,
    id: 'country-select-error',
  },
  render: Interactive.render, // Reuse the render function
};

// Example: Disabled State
export const DisabledState: Story = {
  args: {
    ...Interactive.args,
    label: 'Choose Plan (Disabled)',
    disabled: true,
    id: 'plan-select-disabled',
  },
  render: Interactive.render,
};

// Example: Multiple Selection
export const MultipleSelect: Story = {
  args: {
    ...Interactive.args,
    label: 'Select Toppings (Multiple)',
    multiple: true,
    id: 'toppings-select-multiple',
  },
  render: (args) => (
    <div className="w-64 space-y-1">
      {args.label && <Label htmlFor={args.id}>{args.label}</Label>}
      <Select
        id={args.id}
        disabled={args.disabled}
        error={args.error}
        required={args.required}
        multiple={args.multiple}
        size={5} // Set size for better multiple display
      >
        <option value="pepperoni">Pepperoni</option>
        <option value="mushrooms">Mushrooms</option>
        <option value="onions">Onions</option>
        <option value="peppers">Peppers</option>
        <option value="olives">Olives</option>
      </Select>
      {args.error && (
        <p className="text-sm text-destructive mt-1">Selection required.</p>
      )}
    </div>
  ),
};
