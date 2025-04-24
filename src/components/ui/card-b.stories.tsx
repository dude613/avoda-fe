import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./card-b";

/**
 * Storybook stories for the Card-B component suite.
 * Demonstrates card composition, loading state, and content variants.
 * @module CardBStories
 */

const meta: Meta = {
  title: "UI/CardB",
  component: Card,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj;

export const Basic: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description goes here.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This is the card content area.</p>
      </CardContent>
      <CardFooter>
        <button type="button">Action</button>
      </CardFooter>
    </Card>
  ),
};

export const Loading: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Loading Card</CardTitle>
      </CardHeader>
      <CardContent loading>
        <span style={{ opacity: 0.5 }}>Loading content...</span>
      </CardContent>
      <CardFooter>
        <button type="button">Disabled</button>
      </CardFooter>
    </Card>
  ),
};

export const WithCustomFooter: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Card with Custom Footer</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Card with a custom footer layout.</p>
      </CardContent>
      <CardFooter>
        <button type="button">Accept</button>
        <button type="button">Decline</button>
      </CardFooter>
    </Card>
  ),
};
