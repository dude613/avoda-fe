/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import type React from "react"
import { capitalizeFirstLetter } from "@/lib/utils"

import { useState, useMemo, useEffect } from "react"
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
  type SortingState,
} from "@tanstack/react-table"
import type { ColumnDef } from "@tanstack/react-table"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "../../redux/Store"
import { fetchOrganizations } from "../../redux/slice/OrganizationUser"
import {
  AddTeamMemberAPI,
  ArchiveTeamMember,
  EditTeamMemberAPI,
  fetchOrganization,
  unarchiveTeamMember,
  deleteTeamMember,
  fetchArchivedTeamMembers,
} from "@/service/api"
import toast, { Toaster } from "react-hot-toast"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card-b"
import { Avatar } from "../../components/ui/avatar"
import { Select } from "../../components/ui/select"
import { useMediaQuery } from "react-responsive"
import { FilterPanel, TextFilter } from "@/components/filter"
import {
  PencilIcon,
  TrashIcon,
  UserPlusIcon,
  UsersIcon,
  ArchiveIcon,
  RefreshCwIcon,
  ArrowUpDownIcon,
  ShieldIcon,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Tabs } from "@/components/ui/tabs"
import { PermissionManager } from "@/components/permissions/PermissionManager"

interface TeamMember {
  id: string
  userId: string
  name: string
  email: string
  role: string
  status: string
  avatar?: string
  organizationName?: string
  address?: string
  userDeleteStatus?: string
}

interface FormData {
  name: string
  email: string
  role: string
}

type FormErrors = Partial<Record<keyof FormData, string>>

export default function TeamMembers() {
  const dispatch = useDispatch<AppDispatch>()
  const userId = localStorage.getItem("userId")
  const userRole = localStorage.getItem("userRole")
  const isAdmin = userRole === "admin"
  const { teamMembers, loading } = useSelector((state: RootState) => state.organization)
  const isMobile = useMediaQuery({ maxWidth: 768 })

  // State
  const [globalFilter, setGlobalFilter] = useState("")
  const [nameFilter, setNameFilter] = useState("")
  const [emailFilter, setEmailFilter] = useState("")
  const [roleFilter, setRoleFilter] = useState("")
  const [sorting, setSorting] = useState<SortingState>([])
  const [organizationId, setOrganizationId] = useState("")
  const [organizationName, setOrganizationName] = useState("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [archivedTeamMembers, setArchivedTeamMembers] = useState<TeamMember[]>([])
  const [archivedLoading, setArchivedLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("active")
  const [activeSection, setActiveSection] = useState<"members" | "permissions">("members")

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false)
  const [showArchiveModal, setShowArchiveModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showUnarchiveModal, setShowUnarchiveModal] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [selectedUserName, setSelectedUserName] = useState<string>("")
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    role: "employee",
  })
  const [errors, setErrors] = useState<FormErrors>({
    name: "",
    email: "",
    role: "",
  })
  const [currentPage] = useState(1)
  const [pageSize] = useState(10)

  // Filter active team members vs archived team members
  const activeTeamMembers = useMemo(
    () => teamMembers.filter((member) => member?.userDeleteStatus !== "archive"),
    [teamMembers],
  )

  // Modal handlers
  const openAddModal = () => {
    setFormData({ name: "", email: "", role: "employee" })
    setIsEditing(false)
    setShowAddModal(true)
  }

  const openEditModal = (member: TeamMember) => {
    setFormData(member)
    setIsEditing(true)
    setShowAddModal(true)
  }

  const openArchiveModal = (id: string, name: string) => {
    setSelectedUserId(id)
    setSelectedUserName(name)
    setShowArchiveModal(true)
  }

  const openDeleteModal = (id: string, name: string) => {
    setSelectedUserId(id)
    setSelectedUserName(name)
    setShowDeleteModal(true)
  }

  const openUnarchiveModal = (id: string, name: string) => {
    setSelectedUserId(id)
    setSelectedUserName(name)
    setShowUnarchiveModal(true)
  }

  // Fetch organization data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchOrganization()
        if (data && data.success && data.data.length > 0) {
          const orgId = data.data[0].id
          const orgName = data.data[0].name
          setOrganizationId(orgId)
          setOrganizationName(orgName)
        }
      } catch (error) {
        console.log("error for fetch Organization data", error)
      }
    }
    fetchData()
  }, [])

  // Fetch team members
  useEffect(() => {
    if (userId) {
      dispatch(fetchOrganizations(userId as string))
    }
  }, [dispatch, userId])

  // Add a function to fetch archived team members
  const fetchArchivedMembers = async () => {
    if (!userId) return

    setArchivedLoading(true)
    try {
      const response = await fetchArchivedTeamMembers()
      if (response.success) {
        setArchivedTeamMembers(response.archivedTeamMembers || [])
      } else {
        toast.error(response.error || "Failed to fetch archived team members")
      }
    } catch (error) {
      console.error("Error fetching archived team members:", error)
      toast.error("An error occurred while fetching archived team members")
    } finally {
      setArchivedLoading(false)
    }
  }

  // Add a new useEffect to fetch archived team members when the tab changes
  useEffect(() => {
    if (activeTab === "archived" && userId) {
      fetchArchivedMembers()
    }
  }, [activeTab, userId])

  // Form handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (name in errors) {
      setErrors((prev) => ({
        ...prev,
        [name as keyof FormErrors]: undefined,
      }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    if (!formData.role.trim()) {
      newErrors.role = "Please select a role"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // API handlers
  const handleAddTeamMember = async () => {
    setIsLoading(true)
    if (!validateForm()) {
      setIsLoading(false)
      return
    }

    if (isEditing) {
      const payload = { ...formData, orgId: organizationId }
      try {
        const response = await EditTeamMemberAPI(payload)
        if (response?.success === true) {
          toast.success(response?.message || "Team member updated successfully")
          setFormData({ name: "", email: "", role: "employee" })
          setShowAddModal(false)
          dispatch(fetchOrganizations(userId as string))
        } else {
          toast.error(response?.error || response?.response?.data?.error || "Failed to update team member")
        }
      } catch (error) {
        console.error("Error during API call:", error)
        toast.error("An error occurred while updating team member")
      } finally {
        setIsLoading(false)
      }
    } else {
      const payload = [{ ...formData, orgId: organizationId }]
      try {
        const response = await AddTeamMemberAPI({ members: payload })
        if (response?.success === true) {
          toast.success(response?.message || "Team member added successfully")
          setFormData({ name: "", email: "", role: "employee" })
          setShowAddModal(false)
          dispatch(fetchOrganizations(userId as string))
        } else {
          toast.error(response?.error || response?.response?.data?.error || "Failed to add team member")
        }
      } catch (error) {
        console.error("Error during API call:", error)
        toast.error("An error occurred while adding team member")
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleArchiveTeamMember = async () => {
    try {
      if (!selectedUserId) {
        toast.error("No team member selected for archiving")
        return
      }

      const res = await ArchiveTeamMember(selectedUserId, organizationName)
      if (res?.success === true) {
        toast.success(res?.message || "Team member archived successfully")
        dispatch(fetchOrganizations(userId as string))
        // Refresh archived members if we're on that tab
        if (activeTab === "archived") {
          fetchArchivedMembers()
        }
      } else {
        toast.error(res?.error || "Failed to archive team member")
      }
    } catch (error) {
      console.error("Error archiving user:", error)
      toast.error("An error occurred while archiving team member")
    } finally {
      setShowArchiveModal(false)
      setSelectedUserId(null)
    }
  }

  const handleUnarchiveTeamMember = async () => {
    try {
      if (!selectedUserId) {
        toast.error("No team member selected for unarchiving")
        return
      }

      const res = await unarchiveTeamMember(selectedUserId, organizationName)
      if (res?.success === true) {
        toast.success(res?.message || "Team member unarchived successfully")
        // Refresh both lists
        dispatch(fetchOrganizations(userId as string))
        fetchArchivedMembers()
      } else {
        toast.error(res?.error || "Failed to unarchive team member")
      }
    } catch (error) {
      console.error("Error unarchiving team member:", error)
      toast.error("An error occurred while unarchiving team member")
    } finally {
      setShowUnarchiveModal(false)
      setSelectedUserId(null)
    }
  }

  const handleDeleteUser = async () => {
    try {
      if (!selectedUserId) {
        toast.error("No team member selected for deletion")
        return
      }
      const res = await deleteTeamMember(selectedUserId, organizationName)
      if (res?.success === true) {
        toast.success(res?.message || "Team member deleted successfully")
        dispatch(fetchOrganizations(userId as string))
      } else {
        toast.error(res?.error || "Failed to delete team member")
      }
      dispatch(fetchOrganizations(userId as string))
    } catch (error) {
      console.error("Error deleting team member:", error)
      toast.error("An error occurred while deleting team member")
    } finally {
      setShowDeleteModal(false)
      setSelectedUserId(null)
    }
  }

  // Filter handlers
  const handleApplyFilters = () => {}

  const handleClearFilters = () => {
    setNameFilter("")
    setEmailFilter("")
    setRoleFilter("")
    setGlobalFilter("")
  }

  const hasActiveFilters = !!(nameFilter || emailFilter || roleFilter || globalFilter)

  // Table columns
  const columns: ColumnDef<TeamMember, any>[] = useMemo(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => (
          <div className="flex items-center">
            Name
            <ArrowUpDownIcon
              className="w-4 h-4 ml-2 cursor-pointer"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
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
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            />
          </div>
        ),
      },
      {
        accessorKey: "role",
        header: ({ column }) => (
          <div className="flex items-center">
            Role
            <ArrowUpDownIcon
              className="w-4 h-4 ml-2 cursor-pointer"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            />
          </div>
        ),
        cell: ({ row }) => {
          const role = row.original.status
          return (
            <span
            >
              {capitalizeFirstLetter(role)}
            </span>
          )
        },
      },
      {
        accessorKey: "status",
        header: ({ column }) => (
          <div className="flex items-center">
            Status
            <ArrowUpDownIcon
              className="w-4 h-4 ml-2 cursor-pointer"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            />
          </div>
        ),
        cell: ({ row }) => {
          const status = row.original.status
          return (
            <span
              className={`px-2.5 py-1 text-sm rounded-full font-semibold ${
                status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}
            >
              {capitalizeFirstLetter(status)}
            </span>
          )
        },
      },
      {
        id: "actions",
        header: () => (
          <div className="flex items-center justify-center">
            Actions
          </div>
        ),
        accessorFn: (row) => row.id,
        cell: ({ row }) => {
          const member = row.original
          return (
            <div className="flex items-center gap-2">
              {isAdmin && (
                <>
                  <Button size="sm" variant="ghost" onClick={() => openEditModal(member)}>
                    <PencilIcon className="w-4 h-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                    onClick={() => openArchiveModal(member.userId, member.name)}
                  >
                    <ArchiveIcon className="w-4 h-4" />
                    <span className="sr-only">Archive</span>
                  </Button>
                  {/* remove delete funtionality for now */}
                  {/* <Button 
                    size="sm"
                    variant="ghost"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => openDeleteModal(member.userId, member.name)}
                  >
                    <TrashIcon className="w-4 h-4" />
                    <span className="sr-only">Delete</span>
                  </Button> */}
                </>
              )}
            </div>
          )
        },
      },
    ],
    [isAdmin],
  )

  // Archived team members columns
  const archivedColumns: ColumnDef<TeamMember, any>[] = useMemo(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => (
          <div className="flex items-center">
            Name
            <ArrowUpDownIcon
              className="w-4 h-4 ml-2 cursor-pointer"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
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
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            />
          </div>
        ),
      },
      {
        accessorKey: "role",
        header: ({ column }) => (
          <div className="flex items-center">
            Role
            <ArrowUpDownIcon
              className="w-4 h-4 ml-2 cursor-pointer"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            />
          </div>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        accessorFn: (row) => row.id,
        cell: ({ row }) => {
          const member = row.original
          return (
            <div className="flex items-center gap-2">
              {isAdmin && (
                <Button
                  size="sm"
                  variant="outline"
                  className="flex items-center gap-1"
                  onClick={() => openUnarchiveModal(member.userId, member.name)}
                >
                  <RefreshCwIcon className="w-4 h-4" />
                  Unarchive
                </Button>
              )}
            </div>
          )
        },
      },
    ],
    [isAdmin],
  )

  // Setup tables
  const activeTable = useReactTable({
    data: activeTeamMembers,
    columns: columns as any,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      globalFilter,
      pagination: {
        pageIndex: currentPage - 1,
        pageSize,
      },
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
  })

  const archivedTable = useReactTable({
    data: archivedTeamMembers,
    columns: archivedColumns as any,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      globalFilter,
      pagination: {
        pageIndex: 0,
        pageSize: 5,
      },
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
  })

  // Mobile view component
  const MobileView = ({ data }: { data: TeamMember[] }) => (
    <div className="space-y-4">
      {data.map((member) => (
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
              <p className={`font-medium ${member.status === "active" ? "text-green-600" : "text-red-600"}`}>
                {member.status}
              </p>
            </div>
          </div>
          {isAdmin && (
            <div className="flex justify-end gap-2 mt-4">
              <Button size="sm" variant="outline" onClick={() => openEditModal(member)}>
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
                <Button size="sm" variant="outline" onClick={() => openUnarchiveModal(member.userId, member.name)}>
                  <RefreshCwIcon className="w-4 h-4 mr-1" />
                  Unarchive
                </Button>
              )}
            </div>
          )}
        </Card>
      ))}
    </div>
  )

  return (
    <div className="p-4 md:p-8">
      <Toaster />

      <div className="mb-6">
        <h1 className="text-3xl font-bold">Team Management</h1>
        <p className="text-muted-foreground">Manage your organization's team members</p>
      </div>

      {/* Section tabs for admin users */}
      {isAdmin && (
        <div className="mb-6">
          <div className="flex space-x-4 border-b">
            <button
              className={`pb-2 px-1 ${
                activeSection === "members"
                  ? "border-b-2 border-primary font-medium text-primary"
                  : "text-muted-foreground"
              }`}
              onClick={() => setActiveSection("members")}
            >
              <div className="flex items-center gap-2">
                <UsersIcon className="w-4 h-4" />
                Team Members
              </div>
            </button>
            <button
              className={`pb-2 px-1 ${
                activeSection === "permissions"
                  ? "border-b-2 border-primary font-medium text-primary"
                  : "text-muted-foreground"
              }`}
              onClick={() => setActiveSection("permissions")}
            >
              <div className="flex items-center gap-2">
                <ShieldIcon className="w-4 h-4" />
                Role Permissions
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Permissions Management Section */}
      {isAdmin && activeSection === "permissions" && <PermissionManager />}

      {/* Team Members Section */}
      {activeSection === "members" && (
        <>
          <Tabs
            tabs={[
              { value: "active", label: "Active Members" },
              { value: "archived", label: "Archived Members" },
            ]}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            className="mb-4"
          />

          {activeTab === "active" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex flex-col items-center justify-between sm:flex-row">
                  <div className="flex items-center">
                    <UsersIcon className="w-5 h-5 mr-2" />
                    Team Members
                  </div>
                  <div className="flex items-center w-full gap-2 mt-2 sm:mt-0 sm:w-2/5">
                    <FilterPanel
                      title="Filter Members"
                      onApply={handleApplyFilters}
                      onClear={handleClearFilters}
                      hasActiveFilters={hasActiveFilters}
                    >
                      <TextFilter
                        value={nameFilter}
                        onChange={setNameFilter}
                        label="Name"
                        placeholder="Filter by name..."
                      />

                      <TextFilter
                        value={emailFilter}
                        onChange={setEmailFilter}
                        label="Email"
                        placeholder="Filter by email..."
                        className="mt-4"
                      />

                      <TextFilter
                        value={roleFilter}
                        onChange={setRoleFilter}
                        label="Role"
                        placeholder="Filter by role..."
                        className="mt-4"
                      />
                    </FilterPanel>

                    {isAdmin && (
                      <Button onClick={openAddModal} size="sm" className="flex items-center gap-1">
                        <UserPlusIcon className="w-4 h-4" />
                        Add Member
                      </Button>
                    )}
                  </div>
                </CardTitle>
                <CardDescription className="hidden sm:flex">View and manage your team members</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center items-center h-[400px]">
                    <div className="w-8 h-8 border-b-2 rounded-full animate-spin border-primary"></div>
                  </div>
                ) : isMobile ? (
                  <MobileView data={activeTeamMembers} />
                ) : (
                  <div className="border rounded-md">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          {activeTable.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id} className="border-b bg-muted/50">
                              {headerGroup.headers.map((header) => (
                                <th key={header.id} className="px-4 py-3 font-medium">
                                  {header.isPlaceholder
                                    ? null
                                    : flexRender(header.column.columnDef.header, header.getContext())}
                                </th>
                              ))}
                            </tr>
                          ))}
                        </thead>
                        <tbody>
                          {activeTable.getRowModel().rows.length > 0 ? (
                            activeTable.getRowModel().rows.map((row) => (
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
                    {/* <Pagination table={activeTable} /> */}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === "archived" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ArchiveIcon className="w-5 h-5 mr-2" />
                  Archived Team Members
                </CardTitle>
                <CardDescription>View and manage archived team members</CardDescription>
              </CardHeader>
              <CardContent>
                {archivedLoading ? (
                  <div className="flex justify-center items-center h-[200px]">
                    <div className="w-8 h-8 border-b-2 rounded-full animate-spin border-primary"></div>
                  </div>
                ) : isMobile ? (
                  <MobileView data={archivedTeamMembers} />
                ) : (
                  <div className="border rounded-md">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          {archivedTable.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id} className="border-b bg-muted/50">
                              {headerGroup.headers.map((header) => (
                                <th key={header.id} className="px-4 py-3 font-medium">
                                  {header.isPlaceholder
                                    ? null
                                    : flexRender(header.column.columnDef.header, header.getContext())}
                                </th>
                              ))}
                            </tr>
                          ))}
                        </thead>
                        <tbody>
                          {archivedTable.getRowModel().rows.length > 0 ? (
                            archivedTable.getRowModel().rows.map((row) => (
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
                              <td colSpan={archivedColumns.length} className="h-24 text-center">
                                No archived team members found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                    {/* <Pagination table={archivedTable} /> */}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Add/Edit Member Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Team Member" : "Add Team Member"}</DialogTitle>
            <DialogDescription>
              {isEditing ? "Update the team member's information" : "Enter the details of the new team member"}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter full name"
              />
              {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter email address"
              />
              {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select id="role" name="role" value={formData.role} onChange={handleInputChange}>
                <option value="">Select a role</option>
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="employee">Employee</option>
              </Select>
              {errors.role && <p className="text-xs text-destructive">{errors.role}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddTeamMember} disabled={isLoading}>
              {isLoading ? "Processing..." : isEditing ? "Update Member" : "Add Member"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Archive Confirmation Modal */}
      <Dialog open={showArchiveModal} onOpenChange={setShowArchiveModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Archive Team Member</DialogTitle>
            <DialogDescription>
              Are you sure you want to archive {selectedUserName}? They will no longer appear in the active team members
              list.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowArchiveModal(false)}>
              Cancel
            </Button>
            <Button variant="default" onClick={handleArchiveTeamMember}>
              Archive Member
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Team Member</DialogTitle>
            <DialogDescription>
              Are you sure you want to permanently delete {selectedUserName}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser}>
              Delete Permanently
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Unarchive Confirmation Modal */}
      <Dialog open={showUnarchiveModal} onOpenChange={setShowUnarchiveModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Unarchive Team Member</DialogTitle>
            <DialogDescription>
              Are you sure you want to unarchive {selectedUserName}? They will appear in the active team members list
              again.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUnarchiveModal(false)}>
              Cancel
            </Button>
            <Button variant="default" onClick={handleUnarchiveTeamMember}>
              Unarchive Member
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
