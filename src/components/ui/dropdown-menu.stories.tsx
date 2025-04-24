import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
} from "./dropdown-menu";

/**
 * Storybook stories for the DropdownMenu component suite.
 * Demonstrates basic, checkbox, radio, shortcut, and submenu usage.
 * @module DropdownMenuStories
 */

const meta = {
  title: "UI/DropdownMenu",
  component: DropdownMenu,
  tags: ["autodocs"],
  argTypes: {
    triggerLabel: { control: 'text', description: 'Label for the menu trigger button.' },
    menuItems: { control: 'object', description: 'Array of menu item labels.' },
    checked: { control: 'boolean', description: 'Checked state for WithCheckbox.' },
    radioValue: { control: { type: 'radio', options: ['asc', 'desc'] }, description: 'Selected value for WithRadioGroup.' },
  },
  args: {
    triggerLabel: 'Open Menu',
    menuItems: ['Profile', 'Settings', 'Logout'],
    checked: true,
    radioValue: 'asc',
  },
};
export default meta;

/**
 * @typedef {object} DropdownMenuStoryArgs
 * @property {string} triggerLabel
 * @property {string[]} menuItems
 * @property {boolean} checked
 * @property {'asc'|'desc'} radioValue
 */
/** @type {import('@storybook/react').StoryObj<DropdownMenuStoryArgs>} */
// @ts-ignore

export const Basic = {
  args: meta.args,
  render: (args) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button type="button">{args.triggerLabel}</button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        {args.menuItems.slice(0, 2).map((item, idx) => (
          <DropdownMenuItem key={item}>{item}</DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem>{args.menuItems[2]}</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const WithCheckbox = {
  args: {
    ...meta.args,
    checked: true,
  },
  render: (args) => {
    const [checked, setChecked] = React.useState(args.checked);
    React.useEffect(() => { setChecked(args.checked); }, [args.checked]);
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button type="button">{args.triggerLabel}</button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuCheckboxItem checked={checked} onCheckedChange={setChecked}>
            Enable notifications
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
};

export const WithRadioGroup = {
  args: {
    ...meta.args,
    radioValue: 'asc',
  },
  render: (args) => {
    const [value, setValue] = React.useState(args.radioValue);
    React.useEffect(() => { setValue(args.radioValue); }, [args.radioValue]);
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button type="button">Sort Options</button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuRadioGroup value={value} onValueChange={setValue}>
            <DropdownMenuRadioItem value="asc">Ascending</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="desc">Descending</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
};

export const WithShortcuts: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button type="button">Menu with Shortcuts</button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          Undo <DropdownMenuShortcut>Ctrl+Z</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          Redo <DropdownMenuShortcut>Ctrl+Y</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const WithSubmenu: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button type="button">Menu with Submenu</button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>More Options</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>Subitem 1</DropdownMenuItem>
            <DropdownMenuItem>Subitem 2</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};
