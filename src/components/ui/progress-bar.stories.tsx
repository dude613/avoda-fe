import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ProgressBar } from "./progress-bar";

/**
 * Storybook stories for the ProgressBar component.
 * Demonstrates various steps, labels, and edge cases.
 * @module ProgressBarStories
 */

const meta = {
  title: "UI/ProgressBar",
  component: ProgressBar,
  tags: ["autodocs"],
  argTypes: {
    currentStep: { control: { type: 'number', min: 0, step: 1 }, description: 'Current progress step.' },
    totalSteps: { control: { type: 'number', min: 0, step: 1 }, description: 'Total number of steps.' },
    label: { control: 'text', description: 'Progress label.' },
    statusText: { control: 'text', description: 'Status text.' },
  },
  args: {
    currentStep: 2,
    totalSteps: 5,
    label: 'Uploading',
    statusText: 'Step 2 of 5',
  },
};
export default meta;

/**
 * @typedef {object} ProgressBarStoryArgs
 * @property {number} currentStep
 * @property {number} totalSteps
 * @property {string} label
 * @property {string} statusText
 */
/** @type {import('@storybook/react').StoryObj<ProgressBarStoryArgs>} */
// @ts-ignore

export const Basic = {
  args: meta.args,
  render: (args) => <ProgressBar {...args} />, 
};

export const Complete = {
  args: {
    currentStep: 5,
    totalSteps: 5,
    label: 'Complete',
    statusText: 'All done!',
  },
  render: (args) => <ProgressBar {...args} />, 
};

export const ZeroProgress = {
  args: {
    currentStep: 0,
    totalSteps: 5,
    label: 'Not Started',
    statusText: '0%',
  },
  render: (args) => <ProgressBar {...args} />, 
};

export const EdgeCases = {
  render: () => (
    <>
      <ProgressBar currentStep={1} totalSteps={1} label="Single Step" statusText="1/1" />
      <ProgressBar currentStep={0} totalSteps={0} label="No Steps" statusText="N/A" />
    </>
  ),
};
