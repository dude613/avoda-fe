export interface Project {
  id: string;
  name: string;
  description?: string;
  clientId: string;
  startDate?: string;
  endDate?: string;
  budget: number;
  status: "planned" | "active" | "completed" | "on-hold";
  clientName?: string; // For display purposes
  createdAt?: string;
  updatedAt?: string;
}

export interface ProjectFilters {
  name?: string;
  clientId?: string;
  status?: string;
  startDateFrom?: string | Date;
  startDateTo?: string | Date;
}
