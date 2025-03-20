import { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  ColumnDef,
  flexRender,
} from "@tanstack/react-table";
import { FaUserPlus, FaEllipsisV, FaEye } from "react-icons/fa";
import { IoMdAddCircleOutline } from "react-icons/io";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import Pagination from "../../util/Pagination";
import Button from "../../ui/Button";
import { VscSettings } from "react-icons/vsc";
import Input from "../../ui/Input";

const users = [
  { id: "00001", name: "Christina Brooks", email: "christina.brooks@gmail.com", address: "598 South Green Ave, 449", organization: "Electric", role: "Organization Admin", status: "Active" },
  { id: "00002", name: "Rosie Pearson", email: "rosie.pearson@gmail.com", address: "879 Pinocchio Ferry, 528", organization: "Bank", role: "Project Manager", status: "Active" },
  { id: "00003", name: "Daniel Caldwell", email: "daniel.caldwell@gmail.com", address: "837 Park Flo", organization: "Medicine", role: "User", status: "Active" },
];

export default function Dashboard() {
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
            className="text-text bg-background"
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
            className="text-text bg-background"
          />
        ),
      },
      { accessorKey: "id", header: "ID" },
      { accessorKey: "name", header: "Name" },
      { accessorKey: "email", header: "Email" },
      { accessorKey: "address", header: "Address" },
      { accessorKey: "organization", header: "Organization" },
      { accessorKey: "role", header: "Role" },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <span
            className={`px-2.5 py-1.5 text-sm cursor-pointer rounded-full font-semibold text-text ${row.original.status === "Active" ? "bg-background" : "bg-yellow-500"
              }`}
          >
            {row.original.status}
          </span>
        ),
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
    data: users,
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
          <p className="text-primary text-sm leading-5 font-semibold">Here's list to all users in your organizaiton</p>
        </div>
      </div>

      <div className="flex justify-between gap-4 mb-4">
        <div className="flex justify-start items-start gap-4">
          <Input
            type="text"
            placeholder="Filter users..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            error={""}
            className="border rounded-lg w-[250px]" />

          <button className="flex justify-center items-center gap-2 border border-dashed border-primary font-semibold w-28 h-11 rounded-lg">
            <IoMdAddCircleOutline size={20} /> Role
          </button>

          <button className="flex justify-center items-center gap-2 border border-dashed border-primary font-semibold w-28 h-11 rounded-lg">
            <IoMdAddCircleOutline size={20} /> Status
          </button>
        </div>
        <div className="flex justify-end items-end gap-2">
          {/* <Button text={"View"}
            icon={<FaEye />}
            className="bg-text text-background" /> */}
          <button className="flex justify-center items-center gap-2 border border-primary font-semibold w-28 h-12 mt-2 rounded-lg">
            <VscSettings size={20} /> View
          </button>
          <Button text={'Invite User'}
            className="w-40 h-14 mt-1 rounded-lg" />
        </div>

      </div>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {table.getRowModel().rows.length > 0 ? (
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-200">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="py-2 px-4">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-b hover:bg-gray-100 transition">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="py-2 px-4">
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
