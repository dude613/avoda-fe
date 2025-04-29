"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Calendar, Clock, FileText, DollarSign, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DialogFooter } from "@/components/ui/dialog";
import { Select } from "@/components/ui/select";
import type { Client } from "@/types/Client";
import type { Project } from "@/types/Project";

interface ProjectFormProps {
  client: Client;
  onSubmit: (project: Omit<Project, "id">) => void;
  onCancel: () => void;
  project?: Project; // For editing existing projects
}

export function ProjectForm({
  client,
  onSubmit,
  onCancel,
  project,
}: ProjectFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!project;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Omit<Project, "id">>({
    defaultValues: {
      name: project?.name || "",
      description: project?.description || "",
      startDate: project?.startDate || new Date().toISOString().split("T")[0],
      endDate: project?.endDate || "",
      budget: project?.budget || 0,
      status: project?.status || "planned",
      clientId: client.id,
    },
  });

  const onFormSubmit = async (data: Omit<Project, "id">) => {
    setIsSubmitting(true);
    try {
      onSubmit({
        ...data,
        clientId: client.id,
      });
    } catch (error) {
      toast.error(
        isEditing ? "Failed to update project" : "Failed to create project"
      );
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="py-4 space-y-4">
      {/* Client Info (non-editable) */}
      <div className="p-3 mb-2 border rounded-md bg-muted/30">
        <div className="flex items-center gap-2 mb-1">
          <Building className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">Client:</span>
          <span className="text-sm">{client.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">Billing Rate:</span>
          <span className="text-sm">${client.billingRate}/hr</span>
        </div>
      </div>

      {/* Project Name */}
      <div className="space-y-2">
        <Label htmlFor="name" className="flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Project Name *
        </Label>
        <Controller
          name="name"
          control={control}
          rules={{ required: "Project name is required" }}
          render={({ field }) => (
            <Input
              id="name"
              placeholder="Enter project name"
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
              placeholder="Project description (optional)"
              className="min-h-[100px]"
              {...field}
            />
          )}
        />
      </div>

      {/* Start Date */}
      <div className="space-y-2">
        <Label htmlFor="startDate" className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Start Date
        </Label>
        <Controller
          name="startDate"
          control={control}
          render={({ field }) => (
            <Input id="startDate" type="date" {...field} />
          )}
        />
      </div>

      {/* End Date */}
      <div className="space-y-2">
        <Label htmlFor="endDate" className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          End Date (Optional)
        </Label>
        <Controller
          name="endDate"
          control={control}
          render={({ field }) => <Input id="endDate" type="date" {...field} />}
        />
      </div>

      {/* Budget */}
      <div className="space-y-2">
        <Label htmlFor="budget" className="flex items-center gap-2">
          <DollarSign className="w-4 h-4" />
          Budget *
        </Label>
        <Controller
          name="budget"
          control={control}
          rules={{
            required: "Budget is required",
            min: {
              value: 0,
              message: "Budget must be a positive number",
            },
          }}
          render={({ field }) => (
            <Input
              id="budget"
              type="number"
              placeholder="0.00"
              {...field}
              onChange={(e) => {
                const value = Number.parseFloat(e.target.value);
                field.onChange(isNaN(value) ? 0 : value);
              }}
              className={errors.budget ? "border-destructive" : ""}
            />
          )}
        />
        {errors.budget && (
          <p className="text-xs text-destructive">{errors.budget.message}</p>
        )}
      </div>

      {/* Status */}
      <div className="space-y-2">
        <Label htmlFor="status" className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Status *
        </Label>
        <Controller
          name="status"
          control={control}
          rules={{ required: "Status is required" }}
          render={({ field }) => (
            <Select
              value={field.value}
              onChange={field.onChange}
              className={errors.status ? "border-destructive" : ""}
            >
              <option value="planned">Planned</option>
              <option value="active">Active</option>
              <option value="on-hold">On Hold</option>
              <option value="completed">Completed</option>
            </Select>
          )}
        />
        {errors.status && (
          <p className="text-xs text-destructive">{errors.status.message}</p>
        )}
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? isEditing
              ? "Updating..."
              : "Creating..."
            : isEditing
            ? "Update Project"
            : "Create Project"}
        </Button>
      </DialogFooter>
    </form>
  );
}
