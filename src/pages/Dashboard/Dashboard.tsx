"use client"

/* eslint-disable @typescript-eslint/no-explicit-any */
//src/pages/Dashboard/Dashboard.tsx
import { useState, useMemo, useEffect } from "react"
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table"
import { IoMdAddCircleOutline } from "react-icons/io"
import { HiOutlineDotsHorizontal } from "react-icons/hi"
import Pagination from "../../util/Pagination"
import { Button } from "../../components/ui/button"
import { VscSettings } from "react-icons/vsc"
import { Input } from "../../components/ui/input"
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/Store";
import { fetchOrganizations } from "../../redux/slice/OrganizationUser";
import { ArchivedUser } from "@/service/api";
import toast, { Toaster } from "react-hot-toast";

import { TeamMember } from "../../types/TeamMember";
import { ColumnDef } from "@tanstack/react-table";

export default function Dashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const userId = localStorage.getItem("userId");
  const { teamMembers } = useSelector((state: RootState) => state.organization);

  useEffect(() => {
    if (userId) {
      dispatch(fetchOrganizations(userId as string));
    }
  }, [dispatch, userId]);

  const [globalFilter, setGlobalFilter] = useState("");
  const [rowSelection, setRowSelection] = useState({});
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setSelectedUserId(id);
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      if (!selectedUserId) {
        toast.error("No user ID selected for Archived", { duration: 2000 });
        return;
      }
      const res = await ArchivedUser(selectedUserId);
      if (res?.success === true) {
        toast.success(res?.message || "User archived successfully", {
          duration: 2000,
        });
      } else {
        toast.error(res?.error || "Something went wrong", { duration: 2000 });
        console.error("Failed to delete user:", res);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
      setShowModal(false);
    }
  };

  const columns: ColumnDef<TeamMember>[] = useMemo(() => {
    const cols: ColumnDef<TeamMember>[] = [
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
      {
        accessorKey: "id",
        header: "ID",
      },
      {
        accessorKey: "name",
        header: "Name",
      },
      {
        accessorKey: "email",
        header: "Email",
      },
      {
        accessorKey: "address",
        header: "Address",
      },
      {
        accessorKey: "organizationName",
        header: "Organization",
      },
      {
        accessorKey: "role",
        header: "Role",
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.original.status;
          const formattedStatus =
            status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

          return (
            <span
              className={`px-2.5 py-1.5 text-sm rounded-full font-semibold ${status === "Active"
                ? "bg-primary text-white"
                : "text-primary border border-gray-300"
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
        cell: ({ row }) => {
          const id = row.original.id;
          return (
            <div className="relative">
              <HiOutlineDotsHorizontal
                className="cursor-pointer text-primary text-xl mr-4"
                role="menu"
                id="menu-button"
                aria-expanded="true"
                aria-haspopup="true"
                tabIndex={-1}
                onClick={(e) => {
                  e.stopPropagation(); // Prevent event bubbling
                  setOpenDropdown(openDropdown === id ? null : id);
                }}
              />
              {openDropdown === id && (
                <div
                  className="absolute right-0 z-[9999] mt-2 w-56 bg-white shadow-lg"
                  style={{
                    top: "100%",
                    zIndex: 1000,
                  }}
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="menu-button"
                >
                  <button className="block px-4 py-2 text-left w-full hover:bg-gray-100">
                    Edit
                  </button>
                  <button className="block px-4 py-2 text-left w-full hover:bg-gray-100">
                    Make a Copy
                  </button>
                  <button className="block px-4 py-2 text-left w-full hover:bg-gray-100">
                    Favorite
                  </button>
                  <button className="block px-4 py-2 text-left w-full hover:bg-gray-100">
                    Labels
                  </button>
                  <button
                    className="block px-4 py-2 text-left w-full hover:bg-gray-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClick(id);
                      setOpenDropdown(null); // Close dropdown after clicking
                    }}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          );
        },
      },
    ];
    return cols;
  }, [openDropdown]);

  const table = useReactTable<TeamMember>({
    data: teamMembers || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: { rowSelection, globalFilter },
    onRowSelectionChange: setRowSelection,
  });

  return (
    <>
      <Toaster />
      <div className="p-4 sm:p-6 md:p-8 w-full">
        <div className="flex flex-col mb-4 w-full text-center">
          <div className=" mb-4 w-full">
            <h1 className="text-2xl sm:text-3xl font-bold">Users</h1>
            <p className="text-primary text-sm leading-5 font-semibold">
              Here's list to all users in your organization
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <div className="flex flex-col sm:flex-row justify-start items-stretch gap-4 w-full md:w-auto">
            <Input
              type="search"
              placeholder="Filter users..."
              className="w-full sm:w-64"
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
            />

            <Button>
              {<IoMdAddCircleOutline size={20} />}
              {"Role"}
            </Button>
            <Button>
              {<IoMdAddCircleOutline size={20} />}
              {"Status"}
            </Button>
          </div>
          <div className="flex justify-end items-center gap-2 w-full md:w-auto">
            <Button className="w-full sm:w-auto">{"View"}</Button>
            <Button className="w-full sm:w-auto">
              {<VscSettings size={20} />}
              {"Invite User"}
            </Button>
          </div>
        </div>
        <div className="bg-white shadow-md rounded-lg overflow-x-auto relative">
          {table.getRowModel().rows.length > 0 ? (
            <table className="w-full text-left border-collapse border border-gray-400 relative">
              <thead className="border border-gray-300">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="py-4 px-4 text-[#444444] font-semibold text-sm"
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border border-gray-300 hover:bg-gray-100 transition"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="py-4 px-4">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
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

        {showModal && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30 flex justify-center items-center p-4">
            <div className="bg-white p-6 rounded-md shadow-md">
              <h2 className="text-xl font-bold mb-2">Confirm Deletion</h2>
              <p>Are you sure you want to Archive this user?</p>
              <div className="flex justify-center mt-4 gap-4">
                <Button
                  onClick={() => setShowModal(false)}
                  variant={"destructive"}
                >
                  {"Cancel"}
                </Button>
                <Button onClick={handleConfirmDelete} variant={"outline"}>
                  {"Archive"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
