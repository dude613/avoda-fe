"use client";

import type React from "react";

import { useState, useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "@/redux/Store";
import { Toaster, toast } from "react-hot-toast";
import { Button, Input, Tabs } from "@/components/ui";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card-b";
import {
  PlusCircle,
  Search,
  ListChecks,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock,
  Briefcase,
  MoreHorizontal,
  Calendar,
  User,
} from "lucide-react";
import {
  fetchTasks,
  fetchAssignedTasks,
  selectAllTasks,
  selectTasksLoading,
  selectTasksPagination,
  createTask,
  updateTask,
  deleteTask,
} from "@/redux/slice/TaskSlice";
import { FilterPanel, TextFilter } from "@/components/filter";
import { useNavigate } from "react-router-dom";
import PermissionGate from "@/components/PermissionGate";
import { useMediaQuery } from "react-responsive";
import { TASK_PERMISSIONS } from "@/constants/Permissions";
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
import { format } from "date-fns";
import TaskForm from "./TaskForm";
import type { Task } from "@/redux/slice/TaskSlice";

// Define status badges for tasks
const STATUS_BADGES: Record<string, { color: string; icon: React.ReactNode }> =
  {
    pending: {
      color: "bg-amber-100 text-amber-800",
      icon: <Clock className="w-4 h-4" />,
    },
    in_progress: {
      color: "bg-blue-100 text-blue-800",
      icon: <AlertCircle className="w-4 h-4" />,
    },
    completed: {
      color: "bg-green-100 text-green-800",
      icon: <CheckCircle2 className="w-4 h-4" />,
    },
    on_hold: {
      color: "bg-gray-100 text-gray-800",
      icon: <XCircle className="w-4 h-4" />,
    },
  };

// Define priority badges
const PRIORITY_BADGES: Record<string, { color: string }> = {
  low: { color: "bg-green-100 text-green-800" },
  medium: { color: "bg-amber-100 text-amber-800" },
  high: { color: "bg-red-100 text-red-800" },
};

export default function TasksPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ maxWidth: 768 });

  // Redux state
  const tasks = useSelector(selectAllTasks) || [];
  const loading = useSelector(selectTasksLoading);
  const { totalPages } = useSelector(selectTasksPagination);

  // Local state
  const [activeTab, setActiveTab] = useState("assigned");
  console.log("activeTab", activeTab);
  const [searchTerm, setSearchTerm] = useState("");
  const [projectFilter, setProjectFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize] = useState(10);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  // Fetch tasks based on view type (all or assigned)
  const loadTasks = useCallback(() => {
    const filters = {
      page: pageIndex + 1,
      limit: pageSize,
      projectId: projectFilter || undefined,
      status: statusFilter || undefined,
      priority: priorityFilter || undefined,
      name: searchTerm || undefined,
    };

    try {
      if (activeTab === "assigned") {
        dispatch(fetchAssignedTasks({}))
          .unwrap()
          .catch((error) => {
            console.warn("Could not fetch assigned tasks:", error);
            // Silently handle the error
          });
      } else {
        dispatch(fetchTasks(filters));
      }
    } catch (error) {
      console.error("Error loading tasks:", error);
      // Silently handle the error
    }
  }, [
    dispatch,
    activeTab,
    pageIndex,
    pageSize,
    projectFilter,
    statusFilter,
    priorityFilter,
    searchTerm,
  ]);

  // Initial load
  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // Handle search with debounce
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      loadTasks();
    }, 500);
  };

  // Apply filters
  const handleApplyFilters = () => {
    setPageIndex(0);
    loadTasks();
  };

  // Clear filters
  const handleClearFilters = () => {
    setProjectFilter("");
    setStatusFilter("");
    setPriorityFilter("");
    setSearchTerm("");
    setPageIndex(0);
    loadTasks();
  };

  // Task actions
  const handleAddTask = async (taskData: Partial<Task>) => {
    try {
      await dispatch(createTask(taskData)).unwrap();
      setShowAddModal(false);
      toast.success("Task created successfully");
      loadTasks();
    } catch (error) {
      toast.error("Failed to create task");
    }
  };

  const handleEditTask = async (taskData: Partial<Task>) => {
    if (!selectedTask) return;

    try {
      await dispatch(
        updateTask({
          id: selectedTask.id,
          data: taskData,
        })
      ).unwrap();
      setShowEditModal(false);
      toast.success("Task updated successfully");
      loadTasks();
    } catch (error) {
      toast.error("Failed to update task");
    }
  };

  const handleDeleteTask = async () => {
    if (!selectedTask) return;

    try {
      await dispatch(deleteTask(selectedTask.id)).unwrap();
      setShowDeleteModal(false);
      toast.success("Task deleted successfully");
      loadTasks();
    } catch (error) {
      toast.error("Failed to delete task");
    }
  };

  // Open modals
  const openAddModal = () => {
    setShowAddModal(true);
  };

  const openEditModal = (task: Task) => {
    setSelectedTask(task);
    setShowEditModal(true);
  };

  const openDeleteModal = (task: Task) => {
    setSelectedTask(task);
    setShowDeleteModal(true);
  };

  // View task details
  const handleViewTask = (id: string) => {
    navigate(`/tasks/${id}`);
  };

  // Pagination
  const handlePageChange = (newPage: number) => {
    setPageIndex(newPage);
  };

  // Mobile view component
  const MobileTaskCard = ({ task }: { task: Task }) => (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="font-medium">{task.name}</h3>
            <p className="text-sm text-muted-foreground">
              {task.project?.name || "No project"}
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="w-4 h-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleViewTask(task.id)}>
                View Details
              </DropdownMenuItem>

              <PermissionGate permissionName={TASK_PERMISSIONS.UPDATE_TASK}>
                <DropdownMenuItem onClick={() => openEditModal(task)}>
                  Edit Task
                </DropdownMenuItem>
              </PermissionGate>

              <PermissionGate permissionName={TASK_PERMISSIONS.DELETE_TASK}>
                <DropdownMenuItem
                  onClick={() => openDeleteModal(task)}
                  className="text-red-600"
                >
                  Delete Task
                </DropdownMenuItem>
              </PermissionGate>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-3">
          <div>
            <span
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                STATUS_BADGES[task.status]?.color || "bg-gray-100 text-gray-800"
              }`}
            >
              {STATUS_BADGES[task.status]?.icon}
              <span className="ml-1">{task.status.replace("_", " ")}</span>
            </span>
          </div>
          <div className="text-right">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                PRIORITY_BADGES[task.priority]?.color ||
                "bg-gray-100 text-gray-800"
              }`}
            >
              {task.priority}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span>
              {task.dueDate
                ? format(new Date(task.dueDate), "MMM dd, yyyy")
                : "No due date"}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <User className="w-4 h-4 text-muted-foreground" />
            <span>{task.assignedUser?.userName || "Unassigned"}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-4 md:p-8">
      <Toaster />

      <div className="mb-6">
        <h1 className="text-3xl font-bold">Tasks</h1>
        <p className="text-muted-foreground">Manage and track your tasks</p>
      </div>

      <Tabs
        tabs={[
          { value: "assigned", label: "My Tasks" },
          { value: "all", label: "Tasks" },
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        className="mb-4"
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex flex-col items-center justify-between sm:flex-row">
            <div className="flex items-center">
              <ListChecks className="w-5 h-5 mr-2" />
              {activeTab === "assigned" ? "My Tasks" : "All Tasks"}
            </div>

            <div className="flex items-center w-full gap-2 mt-2 sm:mt-0 sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tasks..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>

              <FilterPanel
                title="Filter Tasks"
                onApply={handleApplyFilters}
                onClear={handleClearFilters}
                hasActiveFilters={
                  !!(projectFilter || statusFilter || priorityFilter)
                }
              >
                <TextFilter
                  value={projectFilter}
                  onChange={setProjectFilter}
                  label="Project"
                  placeholder="Filter by project..."
                  icon={<Briefcase className="w-4 h-4 text-muted-foreground" />}
                />

                <div className="mt-4 space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="on_hold">On Hold</option>
                  </select>
                </div>

                <div className="mt-4 space-y-2">
                  <label className="text-sm font-medium">Priority</label>
                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="">All Priorities</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </FilterPanel>

              <PermissionGate permissionName={TASK_PERMISSIONS.CREATE_TASK}>
                <Button
                  onClick={openAddModal}
                  className="flex items-center gap-1"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span className="hidden sm:inline">New Task</span>
                </Button>
              </PermissionGate>
            </div>
          </CardTitle>
          <CardDescription className="hidden sm:flex">
            {activeTab === "assigned"
              ? "View and manage tasks assigned to you"
              : "View and manage all tasks"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-[400px]">
              <div className="w-8 h-8 border-b-2 rounded-full animate-spin border-primary"></div>
            </div>
          ) : tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10">
              <ListChecks className="w-12 h-12 mb-2 text-muted-foreground" />
              <p className="text-lg font-medium text-gray-600">
                No tasks found
              </p>
              <p className="mb-4 text-sm text-gray-500">
                Create a new task to get started
              </p>

              <PermissionGate permissionName={TASK_PERMISSIONS.CREATE_TASK}>
                <Button onClick={openAddModal}>
                  <PlusCircle className="w-4 h-4 mr-2" />
                  New Task
                </Button>
              </PermissionGate>
            </div>
          ) : isMobile ? (
            <div className="space-y-4">
              {tasks.map((task: Task) => (
                <MobileTaskCard key={task.id} task={task} />
              ))}
            </div>
          ) : (
            <div className="border rounded-md">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="px-4 py-3 font-medium">Task Name</th>
                      <th className="px-4 py-3 font-medium">Project</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 font-medium">Priority</th>
                      <th className="px-4 py-3 font-medium">Due Date</th>
                      <th className="px-4 py-3 font-medium">Assigned To</th>
                      <th className="px-4 py-3 font-medium text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.map((task: Task) => (
                      <tr key={task.id} className="border-b hover:bg-muted/50">
                        <td className="px-4 py-3 font-medium">{task.name}</td>
                        <td className="px-4 py-3">
                          {task.project?.name || "-"}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              STATUS_BADGES[task.status]?.color ||
                              "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {STATUS_BADGES[task.status]?.icon}
                            <span className="ml-1">
                              {task.status.replace("_", " ")}
                            </span>
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              PRIORITY_BADGES[task.priority]?.color ||
                              "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {task.priority}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {task.dueDate
                            ? format(new Date(task.dueDate), "MMM dd, yyyy")
                            : "-"}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {task.assignedUser ? (
                              <>
                                <div className="flex items-center justify-center w-6 h-6 text-xs text-white rounded-full bg-primary">
                                  {task.assignedUser.userName
                                    .charAt(0)
                                    .toUpperCase()}
                                </div>
                                <span>{task.assignedUser.userName}</span>
                              </>
                            ) : (
                              <span className="text-muted-foreground">
                                Unassigned
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="w-4 h-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleViewTask(task.id)}
                              >
                                View Details
                              </DropdownMenuItem>

                              <PermissionGate
                                permissionName={TASK_PERMISSIONS.UPDATE_TASK}
                              >
                                <DropdownMenuItem
                                  onClick={() => openEditModal(task)}
                                >
                                  Edit Task
                                </DropdownMenuItem>
                              </PermissionGate>

                              <PermissionGate
                                permissionName={TASK_PERMISSIONS.DELETE_TASK}
                              >
                                <DropdownMenuItem
                                  onClick={() => openDeleteModal(task)}
                                  className="text-red-600"
                                >
                                  Delete Task
                                </DropdownMenuItem>
                              </PermissionGate>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between px-4 py-3 border-t">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Showing{" "}
                    <span className="font-medium">
                      {pageIndex * pageSize + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium">
                      {Math.min((pageIndex + 1) * pageSize, tasks.length)}
                    </span>{" "}
                    of <span className="font-medium">{tasks.length}</span>{" "}
                    results
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pageIndex - 1)}
                    disabled={pageIndex === 0}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pageIndex + 1)}
                    disabled={pageIndex >= totalPages - 1}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Task Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
            <DialogDescription>
              Enter task details to create a new task
            </DialogDescription>
          </DialogHeader>
          <TaskForm
            onSubmit={handleAddTask}
            onCancel={() => setShowAddModal(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Task Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>Update task details</DialogDescription>
          </DialogHeader>
          {selectedTask && (
            <TaskForm
              task={selectedTask}
              onSubmit={handleEditTask}
              onCancel={() => setShowEditModal(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Task Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Task</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this task? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteTask}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
