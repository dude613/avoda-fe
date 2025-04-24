import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "./dialog";

/**
 * Storybook stories for the Dialog component suite.
 * Demonstrates basic, header/footer, long content, and multiple dialogs.
 * @module DialogStories
 */

const meta: Meta = {
  title: "UI/Dialog",
  component: Dialog,
  tags: ["autodocs"],
  argTypes: {
    open: { control: 'boolean', description: 'Dialog open state (controlled).' },
    title: { control: 'text', description: 'Dialog title.' },
    description: { control: 'text', description: 'Dialog description.' },
    content: { control: 'text', description: 'Dialog main content.' },
    footer: { control: 'text', description: 'Dialog footer content.' },
    triggerLabel: { control: 'text', description: 'Label for the Dialog trigger button.' },
  },
  args: {
    open: undefined,
    title: 'Dialog Title',
    description: 'This is a dialog description.',
    content: 'Dialog content goes here.',
    footer: 'Close',
    triggerLabel: 'Open Dialog',
  }
};
export default meta;

/**
 * @typedef {object} DialogStoryArgs
 * @property {boolean=} open
 * @property {string} triggerLabel
 * @property {string} title
 * @property {string} description
 * @property {string} content
 * @property {string} footer
 */
/** @type {import('@storybook/react').StoryObj<DialogStoryArgs>} */
// @ts-ignore


export const Basic: Story = {
  args: meta.args,
  render: (args) => (
    <Dialog open={args.open} onOpenChange={args.open !== undefined ? () => { } : undefined}>
      <DialogTrigger asChild>
        <button type="button">{args.triggerLabel}</button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{args.title}</DialogTitle>
          <DialogDescription>{args.description}</DialogDescription>
        </DialogHeader>
        <p>{args.content}</p>
        <DialogFooter>
          <button type="button">{args.footer}</button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const WithLongContent: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <button type="button">Open Dialog with Long Content</button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dialog with Long Content</DialogTitle>
        </DialogHeader>
        <div style={{ maxHeight: 300, overflow: "auto" }}>
          {Array.from({ length: 20 }, (_, i) => (
            <p key={i}>Line {i + 1}: Lorem ipsum dolor sit amet.</p>
          ))}
        </div>
        <DialogFooter>
          <button type="button">Close</button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const MultipleDialogs: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 24 }}>
      <Dialog>
        <DialogTrigger asChild>
          <button type="button">Dialog 1</button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>First Dialog</DialogTitle>
          </DialogHeader>
          <p>This is the first dialog.</p>
        </DialogContent>
      </Dialog>
      <Dialog>
        <DialogTrigger asChild>
          <button type="button">Dialog 2</button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Second Dialog</DialogTitle>
          </DialogHeader>
          <p>This is the second dialog.</p>
        </DialogContent>
      </Dialog>
    </div>
  ),
};

export const Controlled: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button type="button">{open ? "Close" : "Open"} Dialog</button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Controlled Dialog</DialogTitle>
          </DialogHeader>
          <p>This dialog is controlled by state.</p>
          <DialogFooter>
            <button type="button" onClick={() => setOpen(false)}>
              Close
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  },
};
