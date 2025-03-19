import React, { ReactNode, useMemo, useState } from 'react'
import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  ColumnDef,
  flexRender,
} from "@tanstack/react-table";

const Dashboard: React.FC = () => {

  const [selectList, setSelectList] = useState<number[]>([]);

  const columnHelper = createColumnHelper<any>();
  const columns: ColumnDef<any>[] = useMemo(
    () => [
      // columnHelper.accessor("CreatedAt", {
      //   header: t("order_date"),
      //   cell: (info) => info.getValue(),
      // }),
      // columnHelper.accessor("State", {
      //   header: t("status"),
      //   cell: (info) => {
      //     const value = info.getValue();
      //     return (
      //       <div
      //         className={`${
      //           (statusMapping[value as number] || value) === "Paid"
      //             ? "bg-green-600 opacity-85 text-white"
      //             : "bg-yellow-100"
      //         } px-2.5 py-1 rounded-md`}
      //       >
      //         {statusMapping[value as number] || (value as string)}
      //       </div>
      //     );
      //   },
      // }),
    ],
    [columnHelper]
  );

  const table = useReactTable({
    data: [],
    columns,
    // state: {
    //   sorting: sortBy,
    //   pagination: {
    //     pageIndex: page - 1 || 0,
    //     pageSize: pageSize || 10,
    //   },
    // },
    // onSortingChange: (updater) => {
    //   const updatedSortBy =
    //     typeof updater === "function" ? updater(sortBy) : updater;
    //   dispatch(setSortBy(updatedSortBy));
    // },
    onPaginationChange: (paginationState: any) => {
      // dispatch(setPage(paginationState.pageIndex + 1));
      // dispatch(setPageSize(paginationState.pageSize));
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    // pageCount: pagination?.totalPages || 1,
  });
  return (
    <div>

      <div>
        <div className=" overflow-x-auto px-2 sm:px-4 lg:mt-1  mt-20 md:px-8">
          <table className="datatable-table w-full table-auto border-collapse text-sm sm:text-base">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  <th className="px-2 py-2 border-t border-gray-300 text-center">
                    <div className="flex justify-center items-center">
                      <input
                        type="checkbox"
                        className="form-checkbox h-1 w-1 text-blue-600 rounded scale-75"
                      // onChange={handleHeaderClick}
                      // checked={selectAll}
                      />
                    </div>
                  </th>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      className="px-2 py-2 border-t border-gray-300 text-left text-gray-800 cursor-pointer"
                    >
                      {header.isPlaceholder ? null : (
                        <span className="flex items-center">
                          {header.column.columnDef.header as ReactNode}
                          {header.column.columnDef.header !== "Actions" && (
                            <span className="ml-1 flex flex-col gap-1 justify-center">
                              <svg
                                className="fill-current"
                                width="10"
                                height="5"
                                viewBox="0 0 10 5"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path d="M5 0L0 5H10L5 0Z" fill="" />
                              </svg>

                              <svg
                                className="fill-current"
                                width="10"
                                height="5"
                                viewBox="0 0 10 5"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path d="M5 5L10 0L0 0L5 5Z" fill="" />
                              </svg>
                            </span>
                          )}
                        </span>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            <tbody>
              {table.getRowModel().rows.map((row) => {
                const isSelected = selectList.includes(
                  row.original.BillBeeOrderId
                );
                return (
                  <tr
                    key={row.id}
                    className={`${isSelected
                        ? "bg-[#9ab8c1] text-black rounded-sm bottom-2"
                        : "text-black rounded-sm"
                      }`}
                    onClick={() =>
                      console.log('click')
                      // handleRowClick(row.original.BillBeeOrderId)
                    }
                  >
                    <td className="px-4 py-2 border-t border-gray-300 text-center">
                      <input
                        type="checkbox"
                        className="form-checkbox h-4 w-4 text-blue-600 rounded"
                        checked={isSelected}
                        id={row.id}
                      />
                    </td>
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="px-4 py-2 border-t border-gray-300  text-wrap break-words"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                );
              })}

              {/* {loading && (
                  <tr>
                    <td colSpan={table.getVisibleFlatColumns().length}>
                      <div className="absolute  top-4 left-0 right-0 bottom-0 flex items-center justify-center backdrop-blur-sm">
                        <ClipLoader
                          color={"#000"}
                          loading={loading}
                          size={35}
                          speedMultiplier={1.1}
                        />
                      </div>
                    </td>
                  </tr>
                )} */}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Dashboard