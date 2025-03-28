import { useState, useMemo, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  ColumnDef,
  flexRender,
} from "@tanstack/react-table";
import { IoMdAddCircleOutline } from "react-icons/io";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import Pagination from "../../util/Pagination";
import {Button} from "../../ui/Button";
import { VscSettings } from "react-icons/vsc";
import { Input } from "../../components/ui/input";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from "../../redux/Store";
import { fetchOrganizations } from "../../redux/slice/OrganizationUser";

export default function Dashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const userId = localStorage.getItem("userId")
  const { teamMembers } = useSelector(
    (state: RootState) => state.organization
  );

  useEffect(() => {
    if (userId) {
      dispatch(fetchOrganizations(userId as string));
    }
  }, [dispatch, userId]);

  const [globalFilter, setGlobalFilter] = useState("");
  const [rowSelection, setRowSelection] = useState({});

  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <input
            type="checkbox"
            onChange={(e) => table.toggleAllRowsSelected(e.target.checked)}
            checked={table.getIsAllRowsSelected()}
            className="cursor-pointer"
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
            className="cursor-pointer"
          />
        ),
      },
      { accessorKey: "_id", header: "ID" },
      { accessorKey: "name", header: "Name" },
      { accessorKey: "email", header: "Email" },
      { accessorKey: "address", header: "Address" },
      { accessorKey: "organizationName", header: "Organization" },
      { accessorKey: "role", header: "Role" },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.original.status;
          const formattedStatus = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

          return (
            <span
              className={`px-2.5 py-1.5 text-sm rounded-full font-semibold ${status === "Active" ? "bg-primary text-white" : "text-primary border border-gray-300"
                }`}
            >
              {formattedStatus}
            </span>
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: () => <HiOutlineDotsHorizontal className="cursor-pointer text-background ml-4" />,
      },
    ],
    []
  );

  const table = useReactTable({
    data: teamMembers || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: { rowSelection, globalFilter },
    onRowSelectionChange: setRowSelection,
  });

  return (
    <div className="p-8">
      <div className="flex mb-4 w-full">
        <div className=" mb-4 w-full">
          <h1 className="text-3xl font-bold">Users</h1>
          <p className="text-primary text-sm leading-5 font-semibold">Here's list to all users in your organization</p>
        </div>
      </div>

      <div className="flex justify-between items-center gap-4 mb-4">
        <div className="flex justify-start items-start gap-4">
          <Input
            type="search"
            placeholder="Filter users..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
          />

          <Button
            className="flex justify-center items-center gap-1 border border-dashed border-primary font-semibold w-36 h-9 rounded-lg"
          >{"Role"}<IoMdAddCircleOutline/></Button>
          <Button
            className="flex justify-center items-center gap-1 border border-dashed border-primary font-semibold  w-40 h-9 rounded-lg"
          >{"Status"}<IoMdAddCircleOutline/></Button>
        </div>
        <div className="flex justify-end items-center gap-2">
          <Button
            className="flex justify-center items-center gap-2 border border-primary font-semibold px-4 h-9 rounded-lg"
          >{"View"}<VscSettings/></Button>
          <Button
            className="bg-primary text-lg text-white font-bold py-2 px-4 w-full rounded-xl hover:bg-gray-900 transition cursor-pointer flex items-center justify-center"
          >{"Invite User"}</Button>
        </div>

      </div>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {table.getRowModel().rows.length > 0 ? (
          <table className="w-full text-left border-collapse border border-gray-400">
            <thead className="border border-gray-300">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="py-4 px-4 text-[#444444] font-semibold text-sm">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border border-gray-300 hover:bg-gray-100 transition">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="py-4 px-4">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="p-4">No records found.</p>
        )}
      </div>
      <Pagination table={table} />
    </div>
  );
}
