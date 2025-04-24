import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Tabs } from "./tabs";

/**
 * Storybook stories for the Tabs component.
 * Demonstrates controls for tabs, activeTab, and variant.
 * @module TabsStories
 */

const tabOptions = [
  { value: "tab1", label: "Tab One" },
  { value: "tab2", label: "Tab Two" },
  { value: "tab3", label: "Tab Three" },
];

const meta: Meta<typeof Tabs> = {
  title: "UI/Tabs",
  component: Tabs,
  tags: ["autodocs"],
  argTypes: {
    tabs: { control: 'object', description: 'Array of tab objects.' },
    activeTab: { control: 'text', description: 'Currently active tab value.' },
    variant: { control: 'text', description: 'Visual variant.' },
  },
};
export default meta;

type Story = StoryObj<typeof Tabs>;

export const Basic: Story = {
  args: {
    tabs: tabOptions,
    activeTab: "tab1",
    variant: "default",
    onTabChange: () => {},
  },
  render: (args) => {
    const [activeTab, setActiveTab] = useState(args.activeTab);
    return <Tabs {...args} activeTab={activeTab} onTabChange={setActiveTab} />;
  },
};
