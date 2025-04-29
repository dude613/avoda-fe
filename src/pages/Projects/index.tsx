"use client";

import type React from "react";

import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast, Toaster } from "react-hot-toast";
import {
  Search,
  FileText,
  Calendar,
  DollarSign,
  Building,
  MoreHorizontal,
  Edit,
  Trash2,
} from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card-b";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FilterPanel, TextFilter, DateRangeFilter } from "@/components/filter";

import type { AppDispatch } from "@/redux/Store";
import {
  fetchProjects,
  deleteProject,
  selectAllProjects,
  selectProjectStatus,
  updateProject,
} from "@/redux/slice/ProjectSlice";
import { fetchClients, selectClients } from "@/redux/slice/ClientSlice";
import type { Project, ProjectFilters } from "@/types/Project";
import type { Client } from "@/types/Client";

import PermissionGate from "@/components/PermissionGate";
import { PROJECT_PERMISSIONS } from "@/constants/Permissions";
import { ProjectForm } from "../Clients/ProjectForm";

export default function ProjectsPage() {
  const dispatch = useDispatch<AppDispatch>();

  // Redux state
  const projects = useSelector(selectAllProjects);
  const clients = useSelector(selectClients);
  const loading = useSelector(selectProjectStatus) === "loading";

  // Local state
  const [searchQuery, setSearchQuery] = useState("");
  const [nameFilter, setNameFilter] = useState("");
  const [clientFilter, setClientFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [startDateFrom, setStartDateFrom] = useState<Date | undefined>(
    undefined
  );
  const [startDateTo, setStartDateTo] = useState<Date | undefined>(undefined);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  // Fetch projects with filters
  const fetchFilteredProjects = useCallback(
    (filters?: ProjectFilters) => {
      dispatch(fetchProjects(filters));
    },
    [dispatch]
  );

  // Initial fetch
  useEffect(() => {
    fetchFilteredProjects(undefined);
    dispatch(fetchClients());
  }, [dispatch, fetchFilteredProjects]);

  // Helper function to build filters object
  const buildFilters = (): ProjectFilters => {
    const filters: ProjectFilters = {};
    if (nameFilter) filters.name = nameFilter;
    if (clientFilter) filters.clientId = clientFilter;
    if (statusFilter) filters.status = statusFilter;
    if (startDateFrom) filters.startDateFrom = startDateFrom;
    if (startDateTo) filters.startDateTo = startDateTo;
    return filters;
  };

  // Filter handlers
  const handleApplyFilters = () => {
    fetchFilteredProjects(buildFilters());
  };

  const handleClearFilters = () => {
    setNameFilter("");
    setClientFilter("");
    setStatusFilter("");
    setStartDateFrom(undefined);
    setStartDateTo(undefined);
    setSearchQuery("");
    fetchFilteredProjects(undefined);
  };

  // Handle search input
  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setNameFilter(value);
    fetchFilteredProjects(value ? { name: value } : undefined);
  };

  // Handle project actions
  const handleEditProject = async (updatedProject: Omit<Project, "id">) => {
    if (!selectedProject) return;

    try {
      const projectToUpdate: Project = {
        ...updatedProject,
        id: selectedProject.id,
      };
      await dispatch(updateProject(projectToUpdate)).unwrap();
      setShowEditModal(false);
      toast.success("Project updated successfully");
      fetchFilteredProjects(buildFilters());
    } catch (error) {
      toast.error("Failed to update project");
    }
  };

  const handleDeleteProject = async () => {
    if (!selectedProject) return;

    try {
      await dispatch(deleteProject(selectedProject.id)).unwrap();
      toast.success("Project deleted successfully");
      fetchFilteredProjects(buildFilters());
    } catch (error) {
      toast.error("Failed to delete project");
    } finally {
      setShowDeleteModal(false);
      setSelectedProject(null);
    }
  };

  // Open modals
  const openEditModal = (project: Project) => {
    const client = clients.find((c) => c.id === project.clientId);
    if (client) {
      setSelectedClient(client);
      setSelectedProject(project);
      setShowEditModal(true);
    } else {
      toast.error("Client information not found");
    }
  };

  const openDeleteModal = (project: Project) => {
    setSelectedProject(project);
    setShowDeleteModal(true);
  };

  const hasActiveFilters = !!(
    nameFilter ||
    clientFilter ||
    statusFilter ||
    startDateFrom ||
    startDateTo
  );

  // Get status badge variant
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return "outline";
      case "planned":
        return "secondary";
      case "completed":
        return "default";
      case "on-hold":
        return "destructive";
      default:
        return "outline";
    }
  };

  // Format date or return placeholder
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not set";
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch (error) {
      return "Invalid date";
    }
  };

  // Get client name by ID
  const getClientName = (clientId: string) => {
    const client = clients.find((c) => c.id === clientId);
    return client ? client.name : "Unknown Client";
  };

  return (
    <div className="p-4 md:p-8">
      <Toaster />

      <div className="mb-6">
        <h1 className="text-3xl font-bold">Projects</h1>
        <p className="text-muted-foreground">Manage your projects</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex flex-col items-center justify-between sm:flex-row">
            <div className="flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Projects
            </div>
            <div className="flex items-center w-full gap-2 mt-2 sm:mt-0 sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search projects..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={handleSearchInput}
                />
              </div>

              <FilterPanel
                title="Filter Projects"
                onApply={handleApplyFilters}
                onClear={handleClearFilters}
                hasActiveFilters={hasActiveFilters}
              >
                <TextFilter
                  value={nameFilter}
                  onChange={setNameFilter}
                  label="Project Name"
                  placeholder="Filter by name..."
                />

                <div className="mt-4">
                  <label className="text-sm font-medium">Client</label>
                  <select
                    value={clientFilter}
                    onChange={(e) => setClientFilter(e.target.value)}
                    className="mt-1"
                  >
                    <option value="">All Clients</option>
                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mt-4">
                  <label className="text-sm font-medium">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="mt-1"
                  >
                    <option value="">All Statuses</option>
                    <option value="planned">Planned</option>
                    <option value="active">Active</option>
                    <option value="on-hold">On Hold</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <DateRangeFilter
                  startDate={startDateFrom}
                  endDate={startDateTo}
                  onStartDateChange={setStartDateFrom}
                  onEndDateChange={setStartDateTo}
                  className="mt-4"
                />
              </FilterPanel>

              {/* <PermissionGate permissionName={PROJECT_PERMISSIONS.CREATE_PROJECT}> // TODO: Implement New project functionality with a client name/email field so that BE can pick the id
                <Button className="flex items-center gap-1">
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">New Project</span>
                </Button>
              </PermissionGate> */}
            </div>
          </CardTitle>
          <CardDescription className="hidden sm:flex">
            View and manage all your projects across clients
          </CardDescription>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-[400px]">
              <div className="w-8 h-8 border-b-2 rounded-full animate-spin border-primary"></div>
            </div>
          ) : projects.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <Card key={project.id} className="overflow-hidden">
                  <CardHeader className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">
                          {project.name}
                        </CardTitle>
                        <CardDescription className="flex items-center mt-1">
                          <Building className="w-3 h-3 mr-1" />
                          {getClientName(project.clientId)}
                        </CardDescription>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <PermissionGate
                            permissionName={PROJECT_PERMISSIONS.UPDATE_PROJECT}
                          >
                            <DropdownMenuItem
                              onClick={() => openEditModal(project)}
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                          </PermissionGate>
                          <PermissionGate
                            permissionName={PROJECT_PERMISSIONS.DELETE_PROJECT}
                          >
                            <DropdownMenuItem
                              onClick={() => openDeleteModal(project)}
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </PermissionGate>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <Badge
                      variant={getStatusBadge(project.status)}
                      className="mt-2"
                    >
                      {project.status.charAt(0).toUpperCase() +
                        project.status.slice(1)}
                    </Badge>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    {project.description && (
                      <p className="mb-3 text-sm text-muted-foreground line-clamp-2">
                        {project.description}
                      </p>
                    )}
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1 text-muted-foreground" />
                        <span>{formatDate(project.startDate)}</span>
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-1 text-muted-foreground" />
                        <span>${project.budget.toFixed(2)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center">
              <FileText className="w-12 h-12 mx-auto text-muted-foreground" />
              <h3 className="mt-2 text-lg font-medium">No projects found</h3>
              <p className="text-muted-foreground">
                {hasActiveFilters
                  ? "Try adjusting your filters"
                  : "Create your first project to get started"}
              </p>
              {/* {!hasActiveFilters && (
                <PermissionGate permissionName={PROJECT_PERMISSIONS.CREATE_PROJECT}>
                  <Button onClick={} className="mt-4">
                    <Plus className="w-4 h-4 mr-2" />
                    New Project
                  </Button>
                </PermissionGate>
              )} */}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedProject?.name}? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteProject}>
              Delete Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Project Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>Update project details</DialogDescription>
          </DialogHeader>
          {selectedProject && selectedClient && (
            <ProjectForm
              client={selectedClient}
              project={selectedProject}
              onSubmit={handleEditProject}
              onCancel={() => setShowEditModal(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
