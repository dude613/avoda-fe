"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { DialogFooter } from "@/components/ui/dialog";
import { useSelector, useDispatch } from "react-redux";
import type { AppDispatch } from "@/redux/Store";
import { selectAllProjects } from "@/redux/slice/ProjectSlice";
import { fetchProjects } from "@/redux/slice/ProjectSlice";
import type { Task } from "@/redux/slice/TaskSlice";
import { Calendar, AlertCircle } from "lucide-react";

interface TaskFormProps {
  task?: Task;
  onSubmit: (data: Partial<Task>) => void;
  onCancel: () => void;
}

export default function TaskForm({ task, onSubmit, onCancel }: TaskFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const projects = useSelector(selectAllProjects);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Add this near the top of the component
  const projectsArray = Array.isArray(projects) ? projects : [];

  // Fetch projects for dropdown
  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Partial<Task>>({
    defaultValues: task || {
      name: "",
      description: "",
      projectId: "",
      priority: "medium",
      status: "pending",
      dueDate: "",
    },
  });

  const onFormSubmit = async (data: Partial<Task>) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="py-4 space-y-4">
      {/* Task Name */}
      <div className="space-y-2">
        <Label htmlFor="name">Task Name *</Label>
        <Controller
          name="name"
          control={control}
          rules={{ required: "Task name is required" }}
          render={({ field }) => (
            <Input
              id="name"
              placeholder="Enter task name"
              {...field}
              className={errors.name ? "border-destructive" : ""}
            />
          )}
        />
        {errors.name && (
          <p className="text-xs text-destructive">{errors.name.message}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <Textarea
              id="description"
              placeholder="Enter task description"
              className="min-h-[100px]"
              {...field}
            />
          )}
        />
      </div>

      {/* Project */}
      <div className="space-y-2">
        <Label htmlFor="projectId">Project</Label>
        <Controller
          name="projectId"
          control={control}
          render={({ field }) => (
            <Select
              id="projectId"
              {...field}
              className={errors.projectId ? "border-destructive" : ""}
            >
              <option value="">Select a project</option>
              {projectsArray.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </Select>
          )}
        />
      </div>

      {/* Status */}
      <div className="space-y-2">
        <Label htmlFor="status">Status *</Label>
        <Controller
          name="status"
          control={control}
          rules={{ required: "Status is required" }}
          render={({ field }) => (
            <Select
              id="status"
              {...field}
              className={errors.status ? "border-destructive" : ""}
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="on_hold">On Hold</option>
            </Select>
          )}
        />
        {errors.status && (
          <p className="text-xs text-destructive">{errors.status.message}</p>
        )}
      </div>

      {/* Priority */}
      <div className="space-y-2">
        <Label htmlFor="priority">Priority *</Label>
        <Controller
          name="priority"
          control={control}
          rules={{ required: "Priority is required" }}
          render={({ field }) => (
            <Select
              id="priority"
              {...field}
              className={errors.priority ? "border-destructive" : ""}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </Select>
          )}
        />
        {errors.priority && (
          <p className="text-xs text-destructive">{errors.priority.message}</p>
        )}
      </div>

      {/* Due Date */}
      <div className="space-y-2">
        <Label htmlFor="dueDate" className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Due Date
        </Label>
        <Controller
          name="dueDate"
          control={control}
          render={({ field }) => (
            <Input
              id="dueDate"
              type="date"
              {...field}
              value={
                field.value
                  ? new Date(field.value).toISOString().split("T")[0]
                  : ""
              }
            />
          )}
        />
      </div>

      {/* Form validation message */}
      {Object.keys(errors).length > 0 && (
        <div className="flex items-center gap-2 p-3 text-sm border rounded-md bg-destructive/10 border-destructive/20 text-destructive">
          <AlertCircle className="w-4 h-4" />
          <span>Please fix the errors above before submitting</span>
        </div>
      )}

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : task ? "Update Task" : "Create Task"}
        </Button>
      </DialogFooter>
    </form>
  );
}
