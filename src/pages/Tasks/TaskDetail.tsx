/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "@/redux/Store";
import { Toaster, toast } from "react-hot-toast";
import {
  fetchTaskById,
  updateTask,
  deleteTask,
  selectCurrentTask,
  selectTasksLoading,
} from "@/redux/slice/TaskSlice";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card-b";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Edit,
  Trash2,
  AlertCircle,
  XCircle,
  Briefcase,
  User,
  UserPlus,
} from "lucide-react";
import { format } from "date-fns";
import TaskForm from "./TaskForm";
import TaskAssignmentModal from "./TaskAssignmentModal";
import PermissionGate from "@/components/PermissionGate";
import { TASK_PERMISSIONS } from "@/constants/Permissions";
import usePermission from "@/hooks/usePermission";

// Define status badges for tasks
const STATUS_BADGES: Record<
  string,
  { color: string; icon: React.ReactNode; bgColor: string }
> = {
  pending: {
    color: "text-amber-800",
    bgColor: "bg-amber-100",
    icon: <Clock className="w-4 h-4" />,
  },
  in_progress: {
    color: "text-blue-800",
    bgColor: "bg-blue-100",
    icon: <AlertCircle className="w-4 h-4" />,
  },
  completed: {
    color: "text-green-800",
    bgColor: "bg-green-100",
    icon: <CheckCircle2 className="w-4 h-4" />,
  },
  on_hold: {
    color: "text-gray-800",
    bgColor: "bg-gray-100",
    icon: <XCircle className="w-4 h-4" />,
  },
};

// Define priority badges
const PRIORITY_BADGES: Record<string, { color: string; bgColor: string }> = {
  low: { color: "text-green-800", bgColor: "bg-green-100" },
  medium: { color: "text-amber-800", bgColor: "bg-amber-100" },
  high: { color: "text-red-800", bgColor: "bg-red-100" },
};

export default function TaskDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const task = useSelector(selectCurrentTask);
  const loading = useSelector(selectTasksLoading);

  // Permission hooks
  const { allowed: canUpdateTask } = usePermission(
    TASK_PERMISSIONS.UPDATE_TASK
  );
  const { allowed: canDeleteTask } = usePermission(
    TASK_PERMISSIONS.DELETE_TASK
  );

  // Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);

  // Fetch task details
  useEffect(() => {
    if (id) {
      dispatch(fetchTaskById(id));
    }
  }, [dispatch, id]);

  // Handle edit task
  const handleEditTask = async (taskData: any) => {
    if (!task) return;

    try {
      await dispatch(
        updateTask({
          id: task.id,
          data: taskData,
        })
      ).unwrap();

      setShowEditModal(false);
      toast.success("Task updated successfully");
      // Refresh task data
      dispatch(fetchTaskById(id!));
    } catch (error) {
      toast.error("Failed to update task");
    }
  };

  // Handle delete task
  const handleDeleteTask = async () => {
    if (!task) return;

    try {
      await dispatch(deleteTask(task.id)).unwrap();
      toast.success("Task deleted successfully");
      navigate("/tasks");
    } catch (error) {
      toast.error("Failed to delete task");
    }
  };

  // Format date helper
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not set";
    return format(new Date(dateString), "MMMM dd, yyyy");
  };

  if (loading) {
    return (
      <div className="p-4 md:p-8 flex justify-center items-center min-h-[400px]">
        <div className="w-8 h-8 border-b-2 rounded-full animate-spin border-primary"></div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="p-4 md:p-8">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/tasks")}
            className="mr-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tasks
          </Button>
        </div>

        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="w-12 h-12 mb-4 text-muted-foreground" />
            <h2 className="mb-2 text-xl font-semibold">Task Not Found</h2>
            <p className="mb-4 text-muted-foreground">
              The task you're looking for doesn't exist or has been deleted.
            </p>
            <Button onClick={() => navigate("/tasks")}>Return to Tasks</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <Toaster />

      <div className="flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/tasks")}
          className="mr-2"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Tasks
        </Button>

        <div className="flex gap-2">
          <PermissionGate permissionName={TASK_PERMISSIONS.UPDATE_TASK}>
            {canUpdateTask && (
              <>
                <Button
                  variant="outline"
                  onClick={() => setShowAssignModal(true)}
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Assign
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowEditModal(true)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Task
                </Button>
              </>
            )}
          </PermissionGate>

          <PermissionGate permissionName={TASK_PERMISSIONS.DELETE_TASK}>
            {canDeleteTask && (
              <Button
                variant="destructive"
                onClick={() => setShowDeleteModal(true)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Task
              </Button>
            )}
          </PermissionGate>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">{task.name}</CardTitle>
                  {task.project && (
                    <CardDescription className="flex items-center mt-1">
                      <Briefcase className="w-4 h-4 mr-1" />
                      {task.project.name}
                    </CardDescription>
                  )}
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      STATUS_BADGES[task.status]?.color
                    } ${STATUS_BADGES[task.status]?.bgColor}`}
                  >
                    {STATUS_BADGES[task.status]?.icon}
                    <span className="ml-1 capitalize">
                      {task.status.replace("_", " ")}
                    </span>
                  </div>

                  <div
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      PRIORITY_BADGES[task.priority]?.color
                    } ${PRIORITY_BADGES[task.priority]?.bgColor}`}
                  >
                    Priority:{" "}
                    <span className="ml-1 capitalize">{task.priority}</span>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="mb-2 text-lg font-medium">Description</h3>
                  <div className="p-4 rounded-md bg-muted/30">
                    {task.description ? (
                      <p className="whitespace-pre-wrap">{task.description}</p>
                    ) : (
                      <p className="italic text-muted-foreground">
                        No description provided
                      </p>
                    )}
                  </div>
                </div>

                {/* Comments section // TODO: - to be implemented later  */}
                {/* <TaskComments taskId={task.id} />  */}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Task Details</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="mb-1 text-sm font-medium text-muted-foreground">
                    Assigned To
                  </h4>
                  <div className="flex items-center gap-2">
                    {task.assignedUser ? (
                      <>
                        <div className="flex items-center justify-center w-8 h-8 text-white rounded-full bg-primary">
                          {task.assignedUser.userName.charAt(0).toUpperCase()}
                        </div>
                        <span>{task.assignedUser.userName}</span>
                      </>
                    ) : (
                      <span className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          Unassigned
                        </span>
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="mb-1 text-sm font-medium text-muted-foreground">
                    Due Date
                  </h4>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>
                      {task.dueDate ? formatDate(task.dueDate) : "No due date"}
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="mb-1 text-sm font-medium text-muted-foreground">
                    Created By
                  </h4>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span>{task.createdBy || "Unknown"}</span>
                  </div>
                </div>

                <div>
                  <h4 className="mb-1 text-sm font-medium text-muted-foreground">
                    Created At
                  </h4>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>{formatDate(task.createdAt)}</span>
                  </div>
                </div>

                <div>
                  <h4 className="mb-1 text-sm font-medium text-muted-foreground">
                    Last Updated
                  </h4>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>{formatDate(task.updatedAt)}</span>
                  </div>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col items-start">
              <h4 className="mb-2 text-sm font-medium text-muted-foreground">
                Quick Actions
              </h4>
              <div className="grid w-full grid-cols-2 gap-2">
                <PermissionGate
                  permissionName={TASK_PERMISSIONS.UPDATE_TASK}
                  fallback={<div></div>}
                >
                  {task.status !== "completed" ? (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() =>
                        handleEditTask({ ...task, status: "completed" })
                      }
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Mark Complete
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() =>
                        handleEditTask({ ...task, status: "in_progress" })
                      }
                    >
                      <AlertCircle className="w-4 h-4 mr-2" />
                      Reopen Task
                    </Button>
                  )}
                </PermissionGate>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate(`/tasks`)}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  All Tasks
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Edit Task Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>Update task details</DialogDescription>
          </DialogHeader>
          <TaskForm
            task={task}
            onSubmit={handleEditTask}
            onCancel={() => setShowEditModal(false)}
          />
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

      {/* Task Assignment Modal */}
      {task && (
        <TaskAssignmentModal
          open={showAssignModal}
          onOpenChange={setShowAssignModal}
          task={task}
        />
      )}
    </div>
  );
}
