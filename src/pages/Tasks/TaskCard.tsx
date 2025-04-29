"use client";

import type React from "react";
import { useSelector } from "react-redux";
import {
  selectAllTasks,
  selectTasksLoading,
  Task,
} from "@/redux/slice/TaskSlice";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { MoreHorizontal, Calendar, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import PermissionGate from "@/components/PermissionGate";
import { TASK_PERMISSIONS } from "@/constants/Permissions";

interface TaskCardProps {
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  canEdit: boolean;
  statusBadges: Record<string, { color: string; icon: React.ReactNode }>;
  priorityBadges: Record<string, { color: string }>;
}

const TaskCard: React.FC<TaskCardProps> = ({
  onView,
  onEdit,
  canEdit,
  statusBadges,
  priorityBadges,
}) => {
  const tasks = useSelector(selectAllTasks);
  const loading = useSelector(selectTasksLoading);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[200px]">
        <div className="w-8 h-8 border-b-2 rounded-full animate-spin border-primary"></div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <p className="text-lg font-medium text-gray-600">No tasks found</p>
        <p className="text-sm text-gray-500">
          Create a new task to get started
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task: Task) => (
        <Card key={task.id} className="p-4">
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
                <DropdownMenuItem onClick={() => onView(task.id)}>
                  View Details
                </DropdownMenuItem>

                <PermissionGate permissionName={TASK_PERMISSIONS.UPDATE_TASK}>
                  {canEdit && (
                    <DropdownMenuItem onClick={() => onEdit(task.id)}>
                      Edit Task
                    </DropdownMenuItem>
                  )}
                </PermissionGate>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-3">
            <div>
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  statusBadges[task.status]?.color ||
                  "bg-gray-100 text-gray-800"
                }`}
              >
                {statusBadges[task.status]?.icon}
                <span className="ml-1">{task.status.replace("_", " ")}</span>
              </span>
            </div>
            <div className="text-right">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  priorityBadges[task.priority]?.color ||
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
        </Card>
      ))}
    </div>
  );
};

export default TaskCard;
