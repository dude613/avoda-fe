export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  industry?: string;
  billingRate: number;
  notes?: string;
  status: "active" | "archived";
  projects?: Project[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  clientId: string;
  startDate: string;
  endDate: string;
  budget: number;
  status: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}
