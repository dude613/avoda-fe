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
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/Store";
import { fetchOrganizations } from "../../redux/slice/OrganizationUser";
import { Pencil, Trash } from "lucide-react";
import {
  AddTeamMemberAPI,
  ArchivedUser,
  EditTeamMemberAPI,
  fetchOrganization,
} from "@/service/api";
import toast, { Toaster } from "react-hot-toast";
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

interface FormData {
  name: string;
  email: string;
  role: string;
}

type FormErrors = Partial<Record<keyof FormData, string>>;
export default function TeamMembers() {
  const dispatch = useDispatch<AppDispatch>();
  const userId = localStorage.getItem("userId");
  const { teamMembers, loading } = useSelector(
    (state: RootState) => state.organization
  );
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const [globalFilter, setGlobalFilter] = useState("");
  const [rowSelection, setRowSelection] = useState({});
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [organizationId, setOrganizationId] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    role: "",
  });

  const [errors, setErrors] = useState<FormErrors>({
    name: "",
    email: "",
    role: "",
  });

  const openAddModal = () => {
    setFormData({ name: "", email: "", role: "" }); // Reset form
    setIsEditing(false);

    setShowAddModal(true);
  };

  // Open modal for editing an existing member
  const openEditModal = (member) => {
    console.log(member);
    setFormData(member);
    setIsEditing(true);

    setShowAddModal(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchOrganization();
        if (data && data.success && data.data.length > 0) {
          const orgId = data.data[0]._id;
          setOrganizationId(orgId);
        }
      } catch (error) {
        console.log("error for fetch Organization data", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (userId) {
      dispatch(fetchOrganizations(userId as string));
    }
  }, [dispatch, userId]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name in errors) {
      setErrors((prev) => ({
        ...prev,
        [name as keyof FormErrors]: undefined,
      }));
    }
  };
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.role.trim()) {
      newErrors.role = "Please select a role";
    }

    setErrors(newErrors);

    // Return true only if there are no errors
    return Object.keys(newErrors).length === 0;
  };

  const addTeamMember = async () => {
    setIsLoading(true);
    if (!validateForm()) return;
    if (isEditing) {
      const payload = { ...formData, orgId: organizationId };
      try {
        const response = await EditTeamMemberAPI({ members: payload });
        if (response?.success === true) {
          toast.success(response?.message, {
            duration: 2000,
          });
          setFormData({ name: "", email: "", role: "" });
          setShowAddModal(false);
          dispatch(fetchOrganizations(userId as string));
        } else {
          toast.error(response?.error || response?.response?.data?.error);
        }
      } catch (error) {
        console.error("Error during API call:", error);
      } finally {
        setIsLoading(false);
        setFormData({ name: "", email: "", role: "" });
        setShowAddModal(false);
      }
    } else {
      const payload = [{ ...formData, orgId: organizationId }];
      try {
        const response = await AddTeamMemberAPI({ members: payload });
        if (response?.success === true) {
          toast.success(response?.message, {
            duration: 2000,
          });
          setFormData({ name: "", email: "", role: "" });
          setShowAddModal(false);
          dispatch(fetchOrganizations(userId as string));
        } else {
          toast.error(response?.error || response?.response?.data?.error);
        }
      } catch (error) {
        console.error("Error during API call:", error);
      } finally {
        setIsLoading(false);
        setFormData({ name: "", email: "", role: "" });
        setShowAddModal(false);
      }
    }
  };

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
        dispatch(fetchOrganizations(userId as string));
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
              className={`px-2.5  text-sm rounded-full font-semibold ${
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
            <div className="">
              <Button
                size="icon"
                variant="ghost"
                className=" "
                onClick={() => openEditModal(row.original)}
              >
                <Pencil size={16} />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="  text-red-600"
                onClick={() => handleDeleteClick(id)}
              >
                <Trash size={16} />
              </Button>
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
              onClick={() => {
                console.log(row.original._id);
                setOpenDropdown(
                  openDropdown === row.original._id ? null : row.original._id
                );
              }}
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
              <p
                className={`font-medium ${
                  row.original.status === "Active"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {row.original.status}
              </p>
            </div>
          </div>
          {openDropdown === row.original._id && (
            <div className="">
              <Button
                size="icon"
                variant="ghost"
                className=" "
                onClick={() => openEditModal(row.original)}
              >
                <Pencil size={16} />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="  text-red-600"
                onClick={() => handleDeleteClick(row.original._id)}
              >
                <Trash size={16} />
              </Button>
            </div>
          )}
        </Card>
      ))}
    </div>
  );

  return (
    <div className="flex justify-center items-center min-h-screen w-full">
      <Toaster />
      <div className="p-4 md:p-8 text-center w-full">
        <div className="mb-6 mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold">Team Members</h1>
          <p className="text-gray-600">
            Manage your organization's team members
          </p>
        </div>

        <Card size="full" layout="responsive">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <div className="flex flex-col md:flex-row gap-4  md:w-[60%]">
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
                className="w-full text-center sm:w-[200px]"
              >
                <option value="">All Roles</option>
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="employee">Employee</option>
              </Select>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto sm:ml-auto">
              <Button variant="outline" className="sm:w-[120px] w-full">
                <VscSettings className="mr-2" />
                View
              </Button>
              <Button className="sm:w-[150px] w-full" onClick={openAddModal}>
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
            <div className="w-full overflow-x-auto relative">
              <div className="min-w-full inline-block align-middle">
                <div className="overflow-hidden">
                  <table className="min-w-full table-fixed border-collapse">
                    <thead>
                      {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                          {headerGroup.headers.map((header) => (
                            <th
                              key={header.id}
                              className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider bg-gray-50"
                              style={{
                                width:
                                  header.id === "select"
                                    ? "40px"
                                    : header.id === "actions"
                                    ? "100px"
                                    : "auto",
                              }}
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
                    <tbody className="bg-white ">
                      {table.getRowModel().rows.length > 0 ? (
                        table.getRowModel().rows.map((row) => (
                          <tr key={row.id} className="hover:bg-gray-50">
                            {row.getVisibleCells().map((cell) => (
                              <td
                                key={cell.id}
                                className="px-6 py-3 text-left whitespace-nowrap text-sm text-gray-600"
                                style={{
                                  width:
                                    cell.column.id === "select"
                                      ? "40px"
                                      : cell.column.id === "actions"
                                      ? "100px"
                                      : "auto",
                                }}
                              >
                                {flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext()
                                )}
                              </td>
                            ))}
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={columns.length}
                            className="px-6 py-24 text-center"
                          >
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
                              <h3 className="text-lg font-medium text-gray-900 mb-1">
                                No team members found
                              </h3>
                              <p className="text-gray-500 mb-4">
                                Get started by adding a new team member
                              </p>
                              <Button
                                onClick={openAddModal}
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
              <p className="text-gray-600 mb-4">
                Are you sure you want to archive this team member?
              </p>
              <div className="flex justify-end gap-4">
                <Button variant="outline" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleConfirmDelete}>
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
              <h2 className="text-xl font-bold mb-4">
                {" "}
                {isEditing ? "Edit Team Member" : "Add Team Member"}
              </h2>

              <div className="space-y-4 text-left">
                <div className="">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter team member name"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter email address"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <Select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                  >
                    <option value="">Select a role</option>
                    <option value="admin">Admin</option>
                    <option value="manager">Manager</option>
                    <option value="employee">Employee</option>
                  </Select>
                  {errors.role && (
                    <p className="text-red-500 text-xs mt-1">{errors.role}</p>
                  )}
                </div>
                <div className="flex justify-end gap-4 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={addTeamMember} disabled={isLoading}>
                    {isEditing ? "Update Member" : "Add Member"}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
