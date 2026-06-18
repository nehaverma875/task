"use client";

import { create } from "zustand";
import zukeeper from "zukeeper";
import type { StateCreator, StoreApi, UseBoundStore } from "zustand";
import type { AppUser, Role } from "@/types/domain";

type AppState = {
  role: Role;
  user: AppUser | null;
  token: string | null;
  hydrated: boolean;
  sidebarOpen: boolean;
  login: (user: AppUser, token: string) => void;
  logout: () => void;
  hydrateAuth: () => void;
  setRole: (role: Role) => void;
  setSidebarOpen: (open: boolean) => void;
};

type AppStore = UseBoundStore<StoreApi<AppState>>;

declare global {
  interface Window {
    store?: AppStore;
  }
}

const createAppStore: StateCreator<AppState> = (set) => ({
  role: "super-admin",
  user: null,
  token: null,
  hydrated: false,
  sidebarOpen: false,
  login: (user, token) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("ops-admin-user", JSON.stringify(user));
      window.localStorage.setItem("ops-admin-token", token);
    }
    set({ user, token, role: user.role });
  },
  logout: () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("ops-admin-user");
      window.localStorage.removeItem("ops-admin-token");
    }
    set({ user: null, token: null, role: "agent", sidebarOpen: false });
  },
  hydrateAuth: () => {
    if (typeof window === "undefined") return;
    const storedUser = window.localStorage.getItem("ops-admin-user");
    const storedToken = window.localStorage.getItem("ops-admin-token");
    if (!storedUser || !storedToken) {
      set({ hydrated: true, role: "agent" });
      return;
    }

    try {
      const user = JSON.parse(storedUser) as AppUser;
      set({ user, token: storedToken, role: user.role, hydrated: true });
    } catch {
      window.localStorage.removeItem("ops-admin-user");
      window.localStorage.removeItem("ops-admin-token");
      set({ user: null, token: null, role: "agent", hydrated: true });
    }
  },
  setRole: (role) => set({ role }),
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen })
});

export const useAppStore = create<AppState>(
  zukeeper(createAppStore) as StateCreator<AppState>
);

if (typeof window !== "undefined") {
  window.store = useAppStore;
}
