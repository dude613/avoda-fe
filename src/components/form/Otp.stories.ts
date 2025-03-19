import '../../index.css';
import type { Meta, StoryObj } from '@storybook/react';

import OTP from './otp';

const meta = {
  title: 'Form/OTP',
  component: OTP,
  tags: ['autodocs'],
} satisfies Meta<typeof OTP>;

export default meta;

type Story = StoryObj<typeof OTP>;

export const Default: Story = {};