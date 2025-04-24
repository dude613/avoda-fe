import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Popover, PopoverTrigger, PopoverContent } from "./popover";

/**
 * Storybook stories for the Popover component suite.
 * Demonstrates basic, controlled, placement, and content variations.
 * @module PopoverStories
 */

const meta: Meta = {
  title: "UI/Popover",
  component: Popover,
  tags: ["autodocs"],
  argTypes: {
    open: { control: 'boolean', description: 'Popover open state (controlled).' },
    side: { control: { type: 'select', options: ['top', 'right', 'bottom', 'left'] }, description: 'Popover side.' },
    align: { control: { type: 'select', options: ['center', 'start', 'end'] }, description: 'Popover alignment.' },
    disabled: { control: 'boolean', description: 'Disable the PopoverTrigger.' },
    content: { control: 'text', description: 'Content inside the Popover.' },
    triggerLabel: { control: 'text', description: 'Label for the Popover trigger button.' },
  },
  args: {
    open: undefined,
    side: 'bottom',
    align: 'center',
    disabled: false,
    content: 'This is a basic popover.',
    triggerLabel: 'Open Popover',
  }
};
export default meta;

/**
 * @typedef {object} PopoverStoryArgs
 * @property {boolean=} open
 * @property {'top'|'right'|'bottom'|'left'=} side
 * @property {'center'|'start'|'end'=} align
 * @property {boolean=} disabled
 * @property {string} triggerLabel
 * @property {string} content
 */
/** @type {import('@storybook/react').StoryObj<PopoverStoryArgs>} */
// @ts-ignore


export const Basic: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <button type="button">Open Popover</button>
      </PopoverTrigger>
      <PopoverContent>
        <span>This is a basic popover.</span>
      </PopoverContent>
    </Popover>
  ),
};

export const WithListContent: Story = {
  args: {
    ...meta.args,
    content: undefined,
    triggerLabel: 'Show List',
  },
  render: (args) => (
    <Popover open={args.open} onOpenChange={args.open !== undefined ? () => { } : undefined}>
      <PopoverTrigger asChild disabled={args.disabled}>
        <button type="button">{args.triggerLabel}</button>
      </PopoverTrigger>
      <PopoverContent side={args.side} align={args.align}>
        <ul style={{ margin: 0, padding: 0, listStyle: "inside disc" }}>
          <li>First item</li>
          <li>Second item</li>
          <li>Third item</li>
        </ul>
      </PopoverContent>
    </Popover>
  ),
};

export const WithInteractiveContent: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <button type="button">Show Form</button>
      </PopoverTrigger>
      <PopoverContent>
        <form style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <label htmlFor="email">Email:</label>
          <input id="email" type="email" style={{ padding: 4 }} />
          <button type="submit">Submit</button>
        </form>
      </PopoverContent>
    </Popover>
  ),
};

export const PlacementVariants: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
      {(["top", "right", "bottom", "left"] as const).map((side) => (
        <Popover key={side}>
          <PopoverTrigger asChild>
            <button type="button">{`Side: ${side}`}</button>
          </PopoverTrigger>
          <PopoverContent side={side} align="center">
            <span>{`Popover on ${side}`}</span>
          </PopoverContent>
        </Popover>
      ))}
    </div>
  ),
};

export const Controlled: Story = {
  render: () => {
    const [open, setOpen] = useState<boolean>(false);
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button type="button">
            {open ? "Close Popover" : "Open Popover"}
          </button>
        </PopoverTrigger>
        <PopoverContent>
          <span>This popover is controlled by state.</span>
          <div style={{ marginTop: 8 }}>
            <button type="button" onClick={() => setOpen(false)}>
              Close
            </button>
          </div>
        </PopoverContent>
      </Popover>
    );
  },
};
