//src/util/Pagination.tsx
import { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";

interface PaginationProps<T> {
  table: Table<T>;
}

export default function Pagination<T>({ table }: PaginationProps<T>) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-4 p-4 border-t gap-4">
      <div>
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected.
      </div>

      <div className="flex flex-wrap gap-2 md:gap-4 items-center justify-start md:justify-end w-full md:w-auto">
        <div className="flex items-center gap-2">
          <span className="text-sm">Rows per page:</span>
          <select
            className="border p-1 rounded text-sm"
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
          >
            {[5, 10, 20, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        <span className="text-sm">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </span>

        <div className="flex gap-1">
          <Button
            className="p-2 border border-gray-300 rounded disabled:opacity-50"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            {"<<"}
          </Button>
          <Button
            className="p-2 border border-gray-300 rounded disabled:opacity-50"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {"<"}
          </Button>
          <Button
            className="p-2 border border-gray-300 rounded disabled:opacity-50"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {">"}
          </Button>
          <Button
            className="p-2 border border-gray-300 rounded disabled:opacity-50"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            {">>"}
          </Button>
        </div>
      </div>
    </div>
  );
}
