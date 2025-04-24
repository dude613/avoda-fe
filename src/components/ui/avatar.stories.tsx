import { StoryObj } from "@storybook/react";
import { Avatar } from "./avatar";

/**
 * Storybook stories for the Avatar component.
 * Demonstrates variants, sizes, fallback, and error handling.
 * @module AvatarStories
 */

const meta = {
  title: "UI/Avatar",
  component: Avatar,
  tags: ["autodocs"],
  argTypes: {
    src: { control: 'text', description: 'Image URL.' },
    alt: { control: 'text', description: 'Alt text.' },
    fallback: { control: 'text', description: 'Fallback text.' },
    variant: { control: { type: 'select', options: ['default', 'outline'] }, description: 'Avatar variant.' },
    size: { control: { type: 'select', options: ['sm', 'default', 'lg'] }, description: 'Avatar size.' },
    className: { control: 'text', description: 'Custom className.' },
  },
  args: {
    src: 'https://i.pravatar.cc/100',
    alt: 'User Avatar',
    fallback: 'JD',
    variant: 'default',
    size: 'default',
    className: '',
  },
};
export default meta;

/**
 * @typedef {object} AvatarStoryArgs
 * @property {string=} src
 * @property {string=} alt
 * @property {string=} fallback
 * @property {'default'|'outline'=} variant
 * @property {'sm'|'default'|'lg'=} size
 * @property {string=} className
 */
/** @type {import('@storybook/react').StoryObj<AvatarStoryArgs>} */
// @ts-ignore

export const Basic = {
  args: meta.args,
  render: (args) => <Avatar {...args} />, 
};

export const WithFallback: StoryObj<typeof Avatar> = {
  render: () => <Avatar fallback="Jane Doe" />,
};

export const ErrorState: StoryObj<typeof Avatar> = {
  render: () => <Avatar src="broken-url.jpg" fallback="Error" />,
};

export const Variants: StoryObj<typeof Avatar> = {
  render: () => (
    <div style={{ display: "flex", gap: 16 }}>
      <Avatar src="https://i.pravatar.cc/100" variant="default" fallback="D" />
      <Avatar src="https://i.pravatar.cc/100" variant="outline" fallback="O" />
    </div>
  ),
};

export const Sizes: StoryObj<typeof Avatar> = {
  render: () => (
    <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
      <Avatar src="https://i.pravatar.cc/100" size="sm" fallback="S" />
      <Avatar src="https://i.pravatar.cc/100" size="default" fallback="D" />
      <Avatar src="https://i.pravatar.cc/100" size="lg" fallback="L" />
    </div>
  ),
};
