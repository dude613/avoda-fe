"use client";

import type React from "react";
import { useSelector } from "react-redux";
import {
  selectAllTasks,
  selectTasksLoading,
  Task,
} from "@/redux/slice/TaskSlice";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import PermissionGate from "@/components/PermissionGate";
import { TASK_PERMISSIONS } from "@/constants/Permissions";

interface TaskTableProps {
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  statusBadges: Record<string, { color: string; icon: React.ReactNode }>;
  priorityBadges: Record<string, { color: string }>;
  canEdit: boolean;
}

const TaskTable: React.FC<TaskTableProps> = ({
  onView,
  onEdit,
  statusBadges,
  priorityBadges,
  canEdit,
}) => {
  const tasks = useSelector(selectAllTasks);
  const loading = useSelector(selectTasksLoading);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[400px]">
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
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task: Task) => (
              <tr key={task.id} className="border-b hover:bg-muted/50">
                <td className="px-4 py-3 font-medium">{task.name}</td>
                <td className="px-4 py-3">{task.project?.name || "-"}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      statusBadges[task.status]?.color ||
                      "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {statusBadges[task.status]?.icon}
                    <span className="ml-1">
                      {task.status.replace("_", " ")}
                    </span>
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      priorityBadges[task.priority]?.color ||
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
                          {task.assignedUser.userName.charAt(0).toUpperCase()}
                        </div>
                        <span>{task.assignedUser.userName}</span>
                      </>
                    ) : (
                      <span className="text-muted-foreground">Unassigned</span>
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
                      <DropdownMenuItem onClick={() => onView(task.id)}>
                        View Details
                      </DropdownMenuItem>

                      <PermissionGate
                        permissionName={TASK_PERMISSIONS.UPDATE_TASK}
                      >
                        {canEdit && (
                          <DropdownMenuItem onClick={() => onEdit(task.id)}>
                            Edit Task
                          </DropdownMenuItem>
                        )}
                      </PermissionGate>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskTable;
