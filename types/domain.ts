export type Role = "super-admin" | "admin" | "agent";

export type ProjectStatus = "planning" | "active" | "on-hold" | "completed";
export type LeadStatus = "new" | "assigned" | "converted";
export type CreatorStatus = "active" | "inactive";

export type Project = {
  _id: string;
  name: string;
  client: string;
  owner: string;
  status: ProjectStatus;
  budget: number;
  startDate: string;
  dueDate: string;
  description: string;
};

export type Lead = {
  _id: string;
  name: string;
  company: string;
  value: number;
  source: string;
  status: LeadStatus;
  assignedTo: string;
  createdAt: string;
};

export type Creator = {
  _id: string;
  name: string;
  email: string;
  specialty: string;
  status: CreatorStatus;
  projects: number;
  rating: number;
};

export type AppUser = {
  _id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
};

export type UserDocument = Omit<AppUser, "_id"> & {
  passwordHash: string;
};

export type Metrics = {
  totalClients: number;
  totalProjects: number;
  activeProjects: number;
  revenue: number;
  leads: number;
};

export type PaginatedProjects = {
  projects: Project[];
  total: number;
  page: number;
  pageSize: number;
};
