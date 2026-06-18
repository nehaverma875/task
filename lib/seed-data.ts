import { hashPassword } from "@/lib/password";
import type { Creator, Lead, Project, Role, UserDocument } from "@/types/domain";

export const projectsSeed: Omit<Project, "_id">[] = [
  {
    name: "Creator Marketplace Revamp",
    client: "Northstar Media",
    owner: "Avery Stone",
    status: "active",
    budget: 128000,
    startDate: "2026-04-12",
    dueDate: "2026-08-30",
    description: "Rebuilding the creator discovery and campaign activation workflow."
  },
  {
    name: "Lead Intelligence Pipeline",
    client: "ScalePath",
    owner: "Mira Rao",
    status: "planning",
    budget: 76000,
    startDate: "2026-07-01",
    dueDate: "2026-10-18",
    description: "Centralizing inbound, partner, and event leads with scoring."
  },
  {
    name: "Brand Analytics Portal",
    client: "Cedar Labs",
    owner: "Jon Bell",
    status: "active",
    budget: 214000,
    startDate: "2026-03-04",
    dueDate: "2026-09-15",
    description: "Executive dashboards for campaign performance and ROI."
  },
  {
    name: "Creator Payout Audit",
    client: "BrightArc",
    owner: "Nina Patel",
    status: "on-hold",
    budget: 48000,
    startDate: "2026-02-20",
    dueDate: "2026-06-28",
    description: "Reviewing creator payment exceptions and approval trails."
  },
  {
    name: "Regional Launch Ops",
    client: "Orbit Retail",
    owner: "Theo Grant",
    status: "completed",
    budget: 93000,
    startDate: "2026-01-05",
    dueDate: "2026-05-20",
    description: "Campaign operations for the APAC marketplace launch."
  },
  {
    name: "Partner CRM Migration",
    client: "VantaWorks",
    owner: "Avery Stone",
    status: "active",
    budget: 156000,
    startDate: "2026-05-16",
    dueDate: "2026-11-06",
    description: "Migrating account, lead, and creator records into a unified CRM."
  }
];

export const leadsSeed: Omit<Lead, "_id">[] = [
  { name: "Hannah Lee", company: "BluePeak", value: 42000, source: "Web", status: "new", assignedTo: "Unassigned", createdAt: "2026-06-10" },
  { name: "Omar Khan", company: "Gridly", value: 88000, source: "Event", status: "assigned", assignedTo: "Mira Rao", createdAt: "2026-06-08" },
  { name: "Sara Chen", company: "Halo Foods", value: 134000, source: "Referral", status: "converted", assignedTo: "Theo Grant", createdAt: "2026-05-29" },
  { name: "Leo Martin", company: "Nimbus AI", value: 56000, source: "Partner", status: "assigned", assignedTo: "Avery Stone", createdAt: "2026-06-12" },
  { name: "Priya Shah", company: "Mosaic Health", value: 97000, source: "Web", status: "new", assignedTo: "Unassigned", createdAt: "2026-06-14" }
];

export const creatorsSeed: Omit<Creator, "_id">[] = [
  { name: "Elena Brooks", email: "elena@example.com", specialty: "Lifestyle", status: "active", projects: 8, rating: 4.8 },
  { name: "Marco Silva", email: "marco@example.com", specialty: "Technology", status: "active", projects: 5, rating: 4.7 },
  { name: "Isha Mehta", email: "isha@example.com", specialty: "Fashion", status: "inactive", projects: 3, rating: 4.4 },
  { name: "Noah Reed", email: "noah@example.com", specialty: "Finance", status: "active", projects: 6, rating: 4.9 }
];

const mockUsers: Array<{ name: string; email: string; password: string; role: Role }> = [
  { name: "Sam Super", email: "superadmin@example.com", password: "Password@123", role: "super-admin" },
  { name: "Anika Admin", email: "admin@example.com", password: "Password@123", role: "admin" },
  { name: "Arjun Agent", email: "agent@example.com", password: "Password@123", role: "agent" }
];

export function usersSeed(): UserDocument[] {
  return mockUsers.map((user) => ({
    name: user.name,
    email: user.email,
    role: user.role,
    passwordHash: hashPassword(user.password),
    createdAt: new Date().toISOString()
  }));
}
