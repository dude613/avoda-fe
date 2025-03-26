import '../../index.css';
import type { Meta, StoryObj } from '@storybook/react';

import Email from './email';

const meta = {
  title: 'Form/Email',
  component: Email,
  tags: ['autodocs'],
} satisfies Meta<typeof Email>;

export default meta;

type Story = StoryObj<typeof Email>;

export const Default: Story = {};