"use client"

import type React from "react"

import { useState, useEffect, useCallback, useRef } from "react" // Import useRef
import { toast, Toaster } from "react-hot-toast"
import {
  UserPlus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Archive,
  Building,
  Mail,
  Phone,
  DollarSign,
  RefreshCw,
  AtSign,
} from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch } from "@/redux/Store"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card-b"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { FilterPanel, TextFilter } from "@/components/filter"
import { useMediaQuery } from "react-responsive"

import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
  type SortingState,
  type ColumnDef,
} from "@tanstack/react-table"

import { ClientForm } from "./ClientForm"
import {
  fetchClients,
  fetchArchivedClients,
  createClient,
  updateClient,
  archiveClient as archiveClientAction,
  restoreClient as restoreClientAction,
  deleteClient as deleteClientAction,
  selectClients,
  selectArchivedClients,
  selectClientsLoading,
  type ClientFilters,
} from "@/redux/slice/ClientSlice"
import { Client } from "@/types/Client"

export default function ClientsPage() {
  const dispatch = useDispatch<AppDispatch>()
  const isMobile = useMediaQuery({ maxWidth: 768 })

  // Redux state
  const clients = useSelector(selectClients)
  const archivedClients = useSelector(selectArchivedClients)
  const loading = useSelector(selectClientsLoading)

  // Local state
  const [activeTab, setActiveTab] = useState("active")
  const [globalFilter, setGlobalFilter] = useState("")
  const [nameFilter, setNameFilter] = useState("")
  const [emailFilter, setEmailFilter] = useState("")
  const [industryFilter, setIndustryFilter] = useState("")
  const [sorting, setSorting] = useState<SortingState>([])
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null) // Use useRef

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showArchiveModal, setShowArchiveModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showRestoreModal, setShowRestoreModal] = useState(false)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)

  // Fetch clients with filters
  const fetchFilteredClients = useCallback(
    (filters?: ClientFilters) => {
      dispatch(fetchClients(filters))
    },
    [dispatch],
  )
  const fetchArchivedFilteredClients = useCallback(
    (filters?: ClientFilters) => {
      dispatch(fetchArchivedClients(filters))
    },
    [dispatch],
  )

  // Initial fetch
  useEffect(() => {
    fetchFilteredClients()
    fetchArchivedFilteredClients()
  }, [fetchFilteredClients, fetchArchivedFilteredClients])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [])

  // Handle client actions
  const handleAddClient = async (newClient: Omit<Client, "id" | "status" | "projects">) => {
    try {
      await dispatch(createClient(newClient)).unwrap()
      setShowAddModal(false)
      toast.success("Client added successfully")
      // Refresh the client list
      fetchFilteredClients(buildFilters())
      fetchArchivedFilteredClients(buildFilters())
    } catch (error) {
      toast.error("Failed to add client")
    }
  }

  const handleEditClient = async (updatedClient: Client) => {
    try {
      await dispatch(updateClient(updatedClient)).unwrap()
      setShowEditModal(false)
      toast.success("Client updated successfully")
      // Refresh the client list
      fetchFilteredClients(buildFilters())
      fetchArchivedFilteredClients(buildFilters())
    } catch (error) {
      toast.error("Failed to update client")
    }
  }

  const handleArchiveClient = async () => {
    if (!selectedClient) return

    try {
      await dispatch(archiveClientAction(selectedClient.id)).unwrap()
      toast.success("Client archived successfully")
      // Refresh the client list
      fetchFilteredClients(buildFilters())
      fetchArchivedFilteredClients(buildFilters())
    } catch (error) {
      toast.error("Failed to archive client")
    } finally {
      setShowArchiveModal(false)
      setSelectedClient(null)
    }
  }

  const handleDeleteClient = async () => {
    if (!selectedClient) return

    try {
      await dispatch(deleteClientAction(selectedClient.id)).unwrap()
      toast.success("Client deleted permanently")
      // Refresh the client list
      fetchFilteredClients(buildFilters())
      fetchArchivedFilteredClients(buildFilters())
    } catch (error) {
      toast.error("Failed to delete client")
    } finally {
      setShowDeleteModal(false)
      setSelectedClient(null)
    }
  }

  const handleRestoreClient = async () => {
    if (!selectedClient) return

    try {
      await dispatch(restoreClientAction(selectedClient.id)).unwrap()
      toast.success("Client restored successfully")
      // Refresh the client list
      fetchFilteredClients(buildFilters())
      fetchArchivedFilteredClients(buildFilters())
    } catch (error) {
      toast.error("Failed to restore client")
    } finally {
      setShowRestoreModal(false)
      setSelectedClient(null)
    }
  }

  // Open modals
  const openEditModal = (client: Client) => {
    setSelectedClient(client)
    setShowEditModal(true)
  }

  const openArchiveModal = (client: Client) => {
    setSelectedClient(client)
    setShowArchiveModal(true)
  }

  const openDeleteModal = (client: Client) => {
    setSelectedClient(client)
    setShowDeleteModal(true)
  }

  const openRestoreModal = (client: Client) => {
    setSelectedClient(client)
    setShowRestoreModal(true)
  }

  // Helper function to build filters object
  const buildFilters = (): ClientFilters => {
    const filters: ClientFilters = {}
    if (nameFilter) filters.name = nameFilter
    if (emailFilter) filters.email = emailFilter
    if (industryFilter) filters.industry = industryFilter
    return filters
  }

  // Filter handlers
  const handleApplyFilters = () => {
    fetchFilteredClients(buildFilters())
    fetchArchivedFilteredClients(buildFilters())
  }

  const handleClearFilters = () => {
    setNameFilter("")
    setEmailFilter("")
    setIndustryFilter("")
    setGlobalFilter("")
    fetchFilteredClients() // Fetch without filters
    fetchArchivedFilteredClients() // Fetch without filters
  }

  // Handle search input with debounce
  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setGlobalFilter(value)

    // Clear any existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    // Set a new timeout
    searchTimeoutRef.current = setTimeout(() => {
      // If global search is used, apply it to all filter fields
      if (value) {
        setNameFilter(value)
      } else {
        setNameFilter("")
        setEmailFilter("")
        setIndustryFilter("")
      }

      fetchFilteredClients(value ? { name: value } : undefined)
      fetchArchivedFilteredClients(value ? { name: value } : undefined)
    }, 500) // 500ms debounce
  }

  const hasActiveFilters = !!(nameFilter || emailFilter || industryFilter || globalFilter)

  // Table columns
  const columns: ColumnDef<Client>[] = [
    {
      accessorKey: "name",
      header: "Client Name",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
            <div className="font-medium">{row.original.name}</div>
            <div className="text-sm text-muted-foreground">{row.original.industry}</div>
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: "Contact",
      cell: ({ row }) => (
        <div>
          <div className="flex items-center gap-1">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <span>{row.original.email}</span>
          </div>
          {row.original.phone && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Phone className="w-3 h-3" />
              <span>{row.original.phone}</span>
            </div>
          )}
        </div>
      ),
    },
    {
      accessorKey: "billingRate",
      header: "Billing Rate",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <DollarSign className="w-4 h-4 text-muted-foreground" />
          <span>{row.original.billingRate?.toFixed(2)}/hr</span>
        </div>
      ),
    },
    {
      accessorKey: "projects",
      header: "Projects",
      cell: ({ row }) => <Badge variant="outline">{row.original.projects || 0}</Badge>,
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="w-4 h-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => openEditModal(row.original)}>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </DropdownMenuItem>
            {activeTab === "active" ? (
              <DropdownMenuItem onClick={() => openArchiveModal(row.original)} className="text-amber-600">
                <Archive className="w-4 h-4 mr-2" />
                Archive
              </DropdownMenuItem>
            ) : (
              <>
                <DropdownMenuItem onClick={() => openRestoreModal(row.original)} className="text-green-600">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Restore
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => openDeleteModal(row.original)} className="text-red-600">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Permanently
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  // Setup tables
  const activeTable = useReactTable({
    data: clients,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      globalFilter,
      pagination: {
        pageIndex: 0,
        pageSize: 10,
      },
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
  })

  const archivedTable = useReactTable({
    data: archivedClients,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      globalFilter,
      pagination: {
        pageIndex: 0,
        pageSize: 10,
      },
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
  })

  // Mobile view component
  const MobileClientCard = ({ client, isArchived = false }: { client: Client; isArchived?: boolean }) => (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div>
              <h3 className="font-medium">{client.name}</h3>
              <p className="text-sm text-muted-foreground">{client.industry}</p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="w-4 h-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => openEditModal(client)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
              {!isArchived ? (
                <DropdownMenuItem onClick={() => openArchiveModal(client)} className="text-amber-600">
                  <Archive className="w-4 h-4 mr-2" />
                  Archive
                </DropdownMenuItem>
              ) : (
                <>
                  <DropdownMenuItem onClick={() => openRestoreModal(client)} className="text-green-600">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Restore
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => openDeleteModal(client)} className="text-red-600">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Permanently
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex justify-between gap-2 mb-2">
          <div className="flex items-center gap-1">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">{client.email}</span>
          </div>
          <div className="flex items-center justify-end gap-1">
            <DollarSign className="w-4 h-4 text-muted-foreground" />
            <span className="-ml-1 text-sm">{client.billingRate?.toFixed(2)}/hr</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
        {client.phone && (
            <div className="flex items-center gap-1">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">{client.phone}</span>
            </div>
          )}
          <Badge variant="outline">{client.projects || 0} Projects</Badge>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="p-4 md:p-8">
      <Toaster />

      <div className="mb-6">
        <h1 className="text-3xl font-bold">Clients</h1>
        <p className="text-muted-foreground">Manage your clients</p>
      </div>

      <Tabs
        tabs={[
          { value: "active", label: "Active Clients" },
          { value: "archived", label: "Archived Clients" },
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        className="mb-4"
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex flex-col items-center justify-between sm:flex-row">
            <div className="flex items-center">
              <Building className="w-5 h-5 mr-2" />
              {activeTab === "active" ? "Active Clients" : "Archived Clients"}
            </div>
            <div className="flex items-center w-full gap-2 mt-2 sm:mt-0 sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search clients..."
                  className="pl-8"
                  value={globalFilter}
                  onChange={handleSearchInput}
                />
              </div>

              <FilterPanel
                title="Filter Clients"
                onApply={handleApplyFilters}
                onClear={handleClearFilters}
                hasActiveFilters={hasActiveFilters}
              >
                <TextFilter
                  value={nameFilter}
                  onChange={setNameFilter}
                  label="Client Name"
                  placeholder="Filter by name..."
                />

                <TextFilter
                  value={emailFilter}
                  onChange={setEmailFilter}
                  label="Email"
                  placeholder="Filter by email..."
                  className="mt-4"
                  icon={<AtSign className="w-4 h-4 text-muted-foreground" />}
                />

                <TextFilter
                  value={industryFilter}
                  onChange={setIndustryFilter}
                  label="Industry"
                  placeholder="Filter by industry..."
                  className="mt-4"
                  icon={<Building className="w-4 h-4 text-muted-foreground" />}
                />
              </FilterPanel>

              {activeTab === "active" && (
                <Button onClick={() => setShowAddModal(true)} className="flex items-center gap-1">
                  <UserPlus className="w-4 h-4" />
                  <span className="hidden sm:inline">Add Client</span>
                </Button>
              )}
            </div>
          </CardTitle>
          <CardDescription className="hidden sm:flex">
            {activeTab === "active" ? "View and manage your active clients" : "View and restore archived clients"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-[400px]">
              <div className="w-8 h-8 border-b-2 rounded-full animate-spin border-primary"></div>
            </div>
          ) : isMobile ? (
            <div>
              {activeTab === "active" ? (
                clients.length > 0 ? (
                  clients.map((client) => <MobileClientCard key={client.id} client={client} />)
                ) : (
                  <div className="py-8 text-center">
                    <Building className="w-12 h-12 mx-auto text-muted-foreground" />
                    <h3 className="mt-2 text-lg font-medium">No clients found</h3>
                    <p className="text-muted-foreground">Add your first client to get started</p>
                    <Button onClick={() => setShowAddModal(true)} className="mt-4">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Add Client
                    </Button>
                  </div>
                )
              ) : archivedClients.length > 0 ? (
                archivedClients.map((client) => <MobileClientCard key={client.id} client={client} isArchived />)
              ) : (
                <div className="py-8 text-center">
                  <Archive className="w-12 h-12 mx-auto text-muted-foreground" />
                  <h3 className="mt-2 text-lg font-medium">No archived clients</h3>
                  <p className="text-muted-foreground">Archived clients will appear here</p>
                </div>
              )}
            </div>
          ) : (
            <div className="border rounded-md">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    {(activeTab === "active" ? activeTable : archivedTable).getHeaderGroups().map((headerGroup) => (
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
                    {(activeTab === "active" ? activeTable : archivedTable).getRowModel().rows.length > 0 ? (
                      (activeTab === "active" ? activeTable : archivedTable).getRowModel().rows.map((row) => (
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
                          {activeTab === "active" ? (
                            <div>
                              <Building className="w-8 h-8 mx-auto text-muted-foreground" />
                              <p className="mt-2">No clients found</p>
                              <Button onClick={() => setShowAddModal(true)} className="mt-4">
                                <UserPlus className="w-4 h-4 mr-2" />
                                Add Client
                              </Button>
                            </div>
                          ) : (
                            <div>
                              <Archive className="w-8 h-8 mx-auto text-muted-foreground" />
                              <p className="mt-2">No archived clients</p>
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Client Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Client</DialogTitle>
            <DialogDescription>Enter the client details to create a new client profile.</DialogDescription>
          </DialogHeader>
          <ClientForm onSubmit={handleAddClient} onCancel={() => setShowAddModal(false)} />
        </DialogContent>
      </Dialog>

      {/* Edit Client Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Client</DialogTitle>
            <DialogDescription>Update the client's information.</DialogDescription>
          </DialogHeader>
          {selectedClient && (
            <ClientForm client={selectedClient} onSubmit={handleEditClient} onCancel={() => setShowEditModal(false)} />
          )}
        </DialogContent>
      </Dialog>

      {/* Archive Confirmation Modal */}
      <Dialog open={showArchiveModal} onOpenChange={setShowArchiveModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Archive Client</DialogTitle>
            <DialogDescription>
              Are you sure you want to archive {selectedClient?.name}? They will be moved to the archived clients list.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowArchiveModal(false)}>
              Cancel
            </Button>
            <Button variant="default" onClick={handleArchiveClient}>
              Archive Client
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Client Permanently</DialogTitle>
            <DialogDescription>
              Are you sure you want to permanently delete {selectedClient?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteClient}>
              Delete Permanently
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Restore Confirmation Modal */}
      <Dialog open={showRestoreModal} onOpenChange={setShowRestoreModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Restore Client</DialogTitle>
            <DialogDescription>
              Are you sure you want to restore {selectedClient?.name}? They will be moved back to the active clients
              list.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRestoreModal(false)}>
              Cancel
            </Button>
            <Button variant="default" onClick={handleRestoreClient}>
              Restore Client
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
