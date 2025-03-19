import '../../index.css';
import type { Meta, StoryObj } from '@storybook/react';

import PasswordWithStrength from './PasswordWithStrength';

const meta = {
  title: 'Form/PasswordWithStrength',
  component: PasswordWithStrength,
  tags: ['autodocs'],
} satisfies Meta<typeof PasswordWithStrength>;

export default meta;

type Story = StoryObj<typeof PasswordWithStrength>;

export const Default: Story = {};