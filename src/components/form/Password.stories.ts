import '../../index.css';
import type { Meta, StoryObj } from '@storybook/react';

import Password from './password';

const meta = {
  title: 'Form/Password',
  component: Password,
  tags: ['autodocs'],
} satisfies Meta<typeof Password>;

export default meta;

type Story = StoryObj<typeof Password>;

export const Default: Story = {};