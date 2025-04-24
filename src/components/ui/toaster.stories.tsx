import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Toaster } from "./toaster";

/**
 * Storybook stories for the Toaster provider.
 * Demonstrates usage and explains provider nature.
 * @module ToasterStories
 */

const meta: Meta<typeof Toaster> = {
  title: "UI/Toaster",
  component: Toaster,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          'The Toaster component is a provider/listener for toast notifications. Use the `useToast` hook and `Toast` components to trigger and display toasts. This story demonstrates mounting the Toaster in your app root.'
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof Toaster>;

export const Basic: Story = {
  render: () => <Toaster />,
};
