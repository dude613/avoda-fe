"use client"

/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Table } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { useDispatch } from "react-redux"
import type { AppDispatch } from "@/redux/Store"
import { fetchTimerHistory } from "@/redux/slice/Timer"

interface PaginationProps<T> {
  table: Table<T>
  totalPages: number
  currentPage: number
}

export default function Pagination<T>({ table, totalPages, currentPage }: PaginationProps<T>) {
  const dispatch = useDispatch<AppDispatch>()

  const handlePageChange = (page: number) => {
    if (page < 1) page = 1
    if (page > totalPages) page = totalPages

    table.setPageIndex(page - 1)
    dispatch(fetchTimerHistory({ page }))
  }

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-4 p-4 border-t gap-4">
      <div>
        {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
      </div>

      <div className="flex flex-wrap gap-2 md:gap-4 items-center justify-start md:justify-end w-full md:w-auto">
        {/* <div className="flex items-center gap-2">
          <span className="text-sm">Rows per page:</span>
          <select
            className="border p-1 rounded text-sm"
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              const newPageSize = Number(e.target.value)
              table.setPageSize(newPageSize)
              // When changing page size, we typically want to go back to page 1
              // handlePageChange(1)
            }}
          >
            {[5, 10, 20, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div> */}

        <span className="text-sm">
          Page {currentPage} of {totalPages || 1}
        </span>

        <div className="flex gap-1">
          <Button
            className="p-2 border border-gray-300 rounded disabled:opacity-50"
            onClick={() => handlePageChange(1)}
            disabled={currentPage <= 1}
          >
            {"<<"}
          </Button>
          <Button
            className="p-2 border border-gray-300 rounded disabled:opacity-50"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            {"<"}
          </Button>
          <Button
            className="p-2 border border-gray-300 rounded disabled:opacity-50"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            {">"}
          </Button>
          <Button
            className="p-2 border border-gray-300 rounded disabled:opacity-50"
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage >= totalPages}
          >
            {">>"}
          </Button>
        </div>
      </div>
    </div>
  )
}
