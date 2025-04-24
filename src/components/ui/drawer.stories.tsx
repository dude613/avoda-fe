import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
} from "./drawer";

/**
 * Storybook stories for the Drawer component suite.
 * Demonstrates all directions, header/footer, and controlled usage.
 * @module DrawerStories
 */

const meta: Meta = {
  title: "UI/Drawer",
  component: Drawer,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj;

export const Basic: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <button type="button">Open Drawer</button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Drawer Title</DrawerTitle>
          <DrawerDescription>This is a drawer description.</DrawerDescription>
        </DrawerHeader>
        <div style={{ padding: 16 }}>Drawer content goes here.</div>
        <DrawerFooter>
          <button type="button">Close</button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};

export const Directions: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
      {["left", "right", "top", "bottom"].map((direction) => (
        <Drawer key={direction} direction={direction as any}>
          <DrawerTrigger asChild>
            <button type="button">{direction.charAt(0).toUpperCase() + direction.slice(1)}</button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>{direction.charAt(0).toUpperCase() + direction.slice(1)} Drawer</DrawerTitle>
            </DrawerHeader>
            <div style={{ padding: 16 }}>Content for {direction} drawer.</div>
            <DrawerFooter>
              <button type="button">Close</button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      ))}
    </div>
  ),
};

export const Controlled: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <button type="button">{open ? "Close" : "Open"} Drawer</button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Controlled Drawer</DrawerTitle>
          </DrawerHeader>
          <div style={{ padding: 16 }}>This drawer is controlled by state.</div>
          <DrawerFooter>
            <button type="button" onClick={() => setOpen(false)}>
              Close
            </button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  },
};
