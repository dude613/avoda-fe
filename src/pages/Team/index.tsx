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
import { VscSettings } from "react-icons/vsc";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from "../../redux/Store";
import { fetchOrganizations } from "../../redux/slice/OrganizationUser";
import { ArchivedUser } from "@/service/api";
import toast from "react-hot-toast";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card } from "../../components/ui/card";
import { Avatar } from "../../components/ui/avatar";
import { Select } from "../../components/ui/select";
import { useMediaQuery } from "react-responsive";

interface TeamMember {
  _id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  avatar?: string;
  organizationName?: string;
  address?: string;
}

export default function TeamMembers() {
  const dispatch = useDispatch<AppDispatch>();
  const userId = localStorage.getItem("userId");
  const { teamMembers, loading } = useSelector(
    (state: RootState) => state.organization
  );
  const isMobile = useMediaQuery({ maxWidth: 768 });

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
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");

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
        toast.success(res?.message || "User archived successfully", { duration: 2000 });
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

  const columns = useMemo<ColumnDef<TeamMember>[]>(
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
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Avatar src={row.original.avatar} alt={row.original.name} />
            <span>{row.original.name}</span>
          </div>
        ),
      },
      { accessorKey: "email", header: "Email" },
      { accessorKey: "role", header: "Role" },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.original.status;
          return (
            <span
              className={`px-2.5 py-1.5 text-sm rounded-full font-semibold ${
                status === "Active" 
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
        cell: ({ row }) => {
          const id = row.original._id;
          return (
            <div className="relative inline-block text-left">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpenDropdown(openDropdown === id ? null : id)}
              >
                <HiOutlineDotsHorizontal className="h-5 w-5" />
              </Button>
              {openDropdown === id && (
                <div className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                  <div className="py-1">
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => {/* Handle edit */}}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-red-600"
                      onClick={() => handleDeleteClick(id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              )}
            </div>
          );
        },
      },
    ],
    [openDropdown]
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

  const MobileView = () => (
    <div className="space-y-4">
      {table.getRowModel().rows.map((row) => (
        <Card key={row.id} className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar src={row.original.avatar} alt={row.original.name} />
              <div>
                <h3 className="font-semibold">{row.original.name}</h3>
                <p className="text-sm text-gray-500">{row.original.email}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpenDropdown(openDropdown === row.original._id ? null : row.original._id)}
            >
              <HiOutlineDotsHorizontal className="h-5 w-5" />
            </Button>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <div>
              <span className="text-sm text-gray-500">Role</span>
              <p className="font-medium">{row.original.role}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Status</span>
              <p className={`font-medium ${
                row.original.status === "Active" 
                  ? "text-green-600" 
                  : "text-red-600"
              }`}>
                {row.original.status}
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Team Members</h1>
        <p className="text-gray-600">Manage your organization's team members</p>
      </div>

      <Card className="p-4 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-[60%]">
            <Input
              type="search"
              placeholder="Search team members..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="w-full md:w-[250px]"
            />
            <Select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full md:w-[200px]"
            >
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="member">Member</option>
            </Select>
          </div>
          <div className="flex gap-2 w-full md:w-auto ml-auto">
            <Button
              variant="outline"
              className="w-[120px]"
            >
              <VscSettings className="mr-2" />
              View
            </Button>
            <Button
              className="w-[150px]"
              onClick={() => setShowAddModal(true)}
            >
              <IoMdAddCircleOutline className="mr-2" />
              Add Member
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-[400px] w-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : isMobile ? (
          <MobileView />
        ) : (
          <div className="w-full overflow-x-auto">
            <div className="min-w-full inline-block align-middle">
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <th
                            key={header.id}
                            className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider bg-gray-50"
                            style={{ width: header.id === 'select' ? '40px' : header.id === 'actions' ? '100px' : 'auto' }}
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {table.getRowModel().rows.length > 0 ? (
                      table.getRowModel().rows.map((row) => (
                        <tr key={row.id} className="hover:bg-gray-50">
                          {row.getVisibleCells().map((cell) => (
                            <td 
                              key={cell.id} 
                              className="px-6 py-4 whitespace-nowrap text-sm text-gray-600"
                              style={{ width: cell.column.id === 'select' ? '40px' : cell.column.id === 'actions' ? '100px' : 'auto' }}
                            >
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </td>
                          ))}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={columns.length} className="px-6 py-24 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                              <svg
                                className="w-8 h-8 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                                />
                              </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-1">No team members found</h3>
                            <p className="text-gray-500 mb-4">Get started by adding a new team member</p>
                            <Button
                              onClick={() => setShowAddModal(true)}
                              className="w-[200px]"
                            >
                              <IoMdAddCircleOutline className="mr-2" />
                              Add Team Member
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Delete Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30 flex justify-center items-center">
          <Card className="p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-2">Confirm Deletion</h2>
            <p className="text-gray-600 mb-4">Are you sure you want to archive this team member?</p>
            <div className="flex justify-end gap-4">
              <Button
                variant="outline"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleConfirmDelete}
              >
                Archive
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Add Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30 flex justify-center items-center">
          <Card className="p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4">Add Team Member</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <Input type="email" placeholder="Enter email address" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <Select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                >
                  <option value="">Select a role</option>
                  <option value="admin">Admin</option>
                  <option value="member">Member</option>
                </Select>
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </Button>
                <Button>
                  Add Member
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
