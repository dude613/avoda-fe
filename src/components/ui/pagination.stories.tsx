import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import Pagination from "./pagination";

/**
 * Storybook stories for the Pagination component.
 * Demonstrates page navigation and edge cases with a mock table.
 * @module PaginationStories
 */

// Minimal mock for TanStack Table API
const mockTable = {
  setPageIndex: () => { },
  getFilteredSelectedRowModel: () => ({ rows: [1, 2] }),
  getFilteredRowModel: () => ({ rows: [1, 2, 3, 4, 5] }),
  getState: () => ({ pagination: { pageSize: 10 } }),
};

const meta: Meta = {
  title: "UI/Pagination",
  component: Pagination,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj;

export const Basic: Story = {
  render: () => (
    <Pagination table={mockTable as any} totalPages={5} currentPage={1} />
  ),
};

export const MiddlePage: Story = {
  render: () => (
    <Pagination table={mockTable as any} totalPages={10} currentPage={5} />
  ),
};

export const LastPage: Story = {
  render: () => (
    <Pagination table={mockTable as any} totalPages={10} currentPage={10} />
  ),
};

export const EdgeCases: Story = {
  render: () => (
    <>
      <Pagination table={mockTable as any} totalPages={1} currentPage={1} />
      <Pagination table={mockTable as any} totalPages={0} currentPage={0} />
    </>
  ),
};
