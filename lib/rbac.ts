import { BarChart3, FolderKanban, LayoutDashboard, UserRoundCog, UsersRound } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Role } from "@/types/domain";

export type Permission =
  | "dashboard:view"
  | "projects:view"
  | "projects:detail"
  | "leads:view"
  | "creators:view"
  | "creators:create"
  | "creators:edit"
  | "creators:toggle";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  permission: Permission;
};

export const roleLabels: Record<Role, string> = {
  "super-admin": "Super Admin",
  admin: "Admin",
  agent: "Agent"
};

export const rolePermissions: Record<Role, Permission[]> = {
  "super-admin": [
    "dashboard:view",
    "projects:view",
    "projects:detail",
    "leads:view",
    "creators:view",
    "creators:create",
    "creators:edit",
    "creators:toggle"
  ],
  admin: [
    "dashboard:view",
    "projects:view",
    "projects:detail",
    "leads:view",
    "creators:view",
    "creators:edit"
  ],
  agent: ["dashboard:view", "projects:view", "projects:detail", "leads:view"]
};

export const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, permission: "dashboard:view" },
  { label: "Projects", href: "/projects", icon: FolderKanban, permission: "projects:view" },
  { label: "Leads", href: "/leads", icon: UsersRound, permission: "leads:view" },
  { label: "Creators", href: "/creators", icon: UserRoundCog, permission: "creators:view" }
];

export const metricIcon = BarChart3;

export function can(role: Role, permission: Permission) {
  return rolePermissions[role].includes(permission);
}

export function permittedNav(role: Role) {
  return navItems.filter((item) => can(role, item.permission));
}
