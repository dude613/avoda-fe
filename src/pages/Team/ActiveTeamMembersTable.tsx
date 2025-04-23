import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import {
  PencilIcon,
  ArchiveIcon,
  TrashIcon,
  ArrowUpDownIcon,
  RefreshCwIcon,
} from "lucide-react";
import { Card } from "@/components/ui/card";

interface TeamMember {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: string;
  status: string;
  avatar?: string;
  organizationName?: string;
  address?: string;
  userDeleteStatus?: string;
}

interface ActiveTeamMembersTableProps {
  teamMembers: TeamMember[];
  loading: boolean;
  isMobile: boolean;
  isAdmin: boolean;
  openEditModal: (member: TeamMember) => void;
  openArchiveModal: (id: string, name: string) => void;
  openDeleteModal: (id: string, name: string) => void;
}

const ActiveTeamMembersTable: React.FC<ActiveTeamMembersTableProps> = ({
  teamMembers,
  loading,
  isMobile,
  isAdmin,
  openEditModal,
  openArchiveModal,
  openDeleteModal,
}) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState<string>("");

  const columns: ColumnDef<TeamMember, any>[] = React.useMemo(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => (
          <div className="flex items-center">
            Name
            <ArrowUpDownIcon
              className="w-4 h-4 ml-2 cursor-pointer"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            />
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Avatar src={row.original.avatar} alt={row.original.name} />
            <span>{row.original.name}</span>
          </div>
        ),
      },
      {
        accessorKey: "email",
        header: ({ column }) => (
          <div className="flex items-center">
            Email
            <ArrowUpDownIcon
              className="w-4 h-4 ml-2 cursor-pointer"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            />
          </div>
        ),
        cell: ({ row }) => row.original.email,
      },
      {
        accessorKey: "role",
        header: ({ column }) => (
          <div className="flex items-center">
            Role
            <ArrowUpDownIcon
              className="w-4 h-4 ml-2 cursor-pointer"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            />
          </div>
        ),
        cell: ({ row }) => row.original.role,
      },
      {
        accessorKey: "status",
        header: ({ column }) => (
          <div className="flex items-center">
            Status
            <ArrowUpDownIcon
              className="w-4 h-4 ml-2 cursor-pointer"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            />
          </div>
        ),
        cell: ({ row }) => {
          const status = row.original.status;
          return (
            <span
              className={`px-2.5 py-1 text-sm rounded-full font-semibold ${
                status === "active"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {status}
            </span>
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        accessorFn: (row) => row.id,
        cell: ({ row }) => {
          const member = row.original;
          return (
            <div className="flex items-center gap-2">
              {isAdmin && (
                <>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => openEditModal(member)}
                  >
                    <PencilIcon className="w-4 h-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  {member.userDeleteStatus === "active" && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                      onClick={() => openArchiveModal(member.userId, member.name)}
                    >
                      <ArchiveIcon className="w-4 h-4" />
                      <span className="sr-only">Archive</span>
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => openDeleteModal(member.userId, member.name)}
                  >
                    <TrashIcon className="w-4 h-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </>
              )}
            </div>
          );
        },
      },
    ],
    [isAdmin, openArchiveModal, openDeleteModal, openEditModal]
  );

  const table = useReactTable({
    data: teamMembers,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        <div className="w-8 h-8 border-b-2 rounded-full animate-spin border-primary"></div>
      </div>
    );
  }

  return isMobile ? (
    <div className="space-y-4">
      {teamMembers.map((member) => (
        <Card key={member.id} className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar src={member.avatar} alt={member.name} />
              <div>
                <h3 className="font-semibold">{member.name}</h3>
                <p className="text-sm text-gray-500">{member.email}</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div>
              <span className="text-sm text-gray-500">Role</span>
              <p className="font-medium">{member.role}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Status</span>
              <p
                className={`font-medium ${
                  member.status === "active" ? "text-green-600" : "text-red-600"
                }`}
              >
                {member.status}
              </p>
            </div>
          </div>
          {isAdmin && (
            <div className="flex justify-end gap-2 mt-4">
              <Button
                size="sm"
                variant="outline"
                onClick={() => openEditModal(member)}
              >
                <PencilIcon className="w-4 h-4 mr-1" />
                Edit
              </Button>
              {member.userDeleteStatus === "active" ? (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-amber-600 border-amber-600"
                    onClick={() => openArchiveModal(member.userId, member.name)}
                  >
                    <ArchiveIcon className="w-4 h-4 mr-1" />
                    Archive
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600 border-red-600"
                    onClick={() => openDeleteModal(member.userId, member.name)}
                  >
                    <TrashIcon className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openArchiveModal(member.userId, member.name)}
                >
                  <RefreshCwIcon className="w-4 h-4 mr-1" />
                  Unarchive
                </Button>
              )}
            </div>
          )}
        </Card>
      ))}
    </div>
  ) : (
    <div className="border rounded-md">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b bg-muted/50">
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-4 py-3 font-medium">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="transition-colors border-b hover:bg-muted/50">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="h-24 text-center">
                  No team members found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* <Pagination table={table} /> */}
    </div>
  );
};

export default ActiveTeamMembersTable;
