import '../../index.css';
import type { Meta, StoryObj } from '@storybook/react';

import {Input} from './input';

const meta = {
  title: 'Input',
  component: Input,
  tags: ['autodocs'],
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    placeholder: 'Default Input',
  },
};

export const File: Story = {
  args: {
    type: 'file',
    accept: '.jpg,.png,.pdf',
  },
};