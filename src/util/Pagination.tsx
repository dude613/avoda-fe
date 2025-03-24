import { Table } from "@tanstack/react-table";

interface PaginationProps {
    table: Table<any>;
}

export default function Pagination({ table }: PaginationProps) {
    return (
        <div className="flex justify-between items-center mt-4 p-4 border-t">
            <div>
                {table.getFilteredSelectedRowModel().rows.length} of{" "}
                {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <span>Rows per page:</span>
                    <select
                        className="border p-1 rounded"
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
                <span>
                    Page {table.getState().pagination.pageIndex + 1} of{" "}
                    {table.getPageCount()}
                </span>
                <button
                    className="p-2 border border-gray-300 rounded disabled:opacity-50 cursor-pointer"
                    onClick={() => table.setPageIndex(0)}
                    disabled={!table.getCanPreviousPage()}
                >
                    {"<<"}
                </button>
                <button
                    className="p-2 border border-gray-300 rounded disabled:opacity-50 cursor-pointer"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    {"<"}
                </button>

                <button
                    className="p-2 border border-gray-300 rounded disabled:opacity-50 cursor-pointer"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    {">"}
                </button>
                <button
                    className="p-2 border border-gray-300 rounded disabled:opacity-50 cursor-pointer"
                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                    disabled={!table.getCanNextPage()}
                >
                    {">>"}
                </button>
            </div>
        </div>
    );
}
