"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { Table } from "@tanstack/react-table";

interface PaginationProps<TData> {
  table: Table<TData>;
  totalPages?: number;
  currentPage?: number;
}

export default function Pagination<TData>({
  table,
  totalPages,
  currentPage,
}: PaginationProps<TData>) {
  const pages = React.useMemo(() => {
    const pageCount = totalPages || table.getPageCount();
    const currentPageIndex = currentPage
      ? currentPage - 1
      : table.getState().pagination.pageIndex;

    // Always show first and last page
    // Show 2 pages before and after current page
    const visiblePages = [];

    // Always add first page
    visiblePages.push(0);

    // Add pages around current page
    for (
      let i = Math.max(1, currentPageIndex - 2);
      i <= Math.min(pageCount - 2, currentPageIndex + 2);
      i++
    ) {
      visiblePages.push(i);
    }

    // Always add last page if there is more than one page
    if (pageCount > 1) {
      visiblePages.push(pageCount - 1);
    }

    // Add ellipses where needed
    const pagesWithEllipses = [];
    for (let i = 0; i < visiblePages.length; i++) {
      const page = visiblePages[i];

      // Add the page
      pagesWithEllipses.push(page);

      // Check if we need an ellipsis
      if (i < visiblePages.length - 1 && visiblePages[i + 1] - page > 1) {
        pagesWithEllipses.push(-1); // -1 represents an ellipsis
      }
    }

    return pagesWithEllipses;
  }, [table, totalPages, currentPage]);

  return (
    <div className="flex items-center justify-between px-2 mt-4">
      <div className="flex-1 text-sm text-muted-foreground">
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected.
      </div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <select
            className="w-16 h-8 bg-transparent border rounded-md border-input"
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
          >
            {[5, 10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {currentPage || table.getState().pagination.pageIndex + 1} of{" "}
          {totalPages || table.getPageCount()}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden w-8 h-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronLeft className="w-4 h-4" />
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            className="w-8 h-8 p-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center">
            {pages.map((page, index) => {
              if (page === -1) {
                return (
                  <Button
                    key={`ellipsis-${index}`}
                    variant="outline"
                    className="w-8 h-8 p-0"
                    disabled
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                );
              }

              const isCurrentPage =
                page ===
                (currentPage
                  ? currentPage - 1
                  : table.getState().pagination.pageIndex);

              return (
                <Button
                  key={page}
                  variant={isCurrentPage ? "default" : "outline"}
                  className={cn(
                    "h-8 w-8 p-0",
                    isCurrentPage &&
                      "bg-primary text-primary-foreground hover:bg-primary/90"
                  )}
                  onClick={() => table.setPageIndex(page)}
                >
                  <span>{page + 1}</span>
                </Button>
              );
            })}
          </div>
          <Button
            variant="outline"
            className="w-8 h-8 p-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden w-8 h-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronRight className="w-4 h-4" />
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
