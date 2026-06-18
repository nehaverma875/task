"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Menu, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { fetchJson } from "@/lib/fetcher";
import { permittedNav, roleLabels } from "@/lib/rbac";
import { useAppStore } from "@/store/use-app-store";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { role, user, hydrated, hydrateAuth, logout, sidebarOpen, setSidebarOpen } = useAppStore();
  const items = permittedNav(role);

  useEffect(() => {
    hydrateAuth();
  }, [hydrateAuth]);

  useEffect(() => {
    if (hydrated && !user) router.replace("/login");
  }, [hydrated, router, user]);

  if (!hydrated || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="text-sm text-muted-foreground">Loading workspace...</div>
      </div>
    );
  }

  const sidebar = (
    <aside className="flex h-full w-72 flex-col border-r bg-card">
      <div className="flex h-16 items-center justify-between px-5">
        <div>
          <p className="text-sm text-muted-foreground">Platform Ops</p>
          <h1 className="text-lg font-semibold">Admin Console</h1>
        </div>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-3">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                "flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium transition",
                active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t p-4">
        <div className="flex items-center gap-2 rounded-md bg-muted p-3">
          <ShieldCheck className="h-5 w-5 text-primary" />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{roleLabels[role]}</p>
            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="hidden md:fixed md:inset-y-0 md:flex">{sidebar}</div>
      <div className="md:pl-72">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 px-4 backdrop-blur md:px-6">
          <div className="flex items-center gap-3">
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <Button className="md:hidden" variant="outline" size="icon" aria-label="Open menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0">
                {sidebar}
              </SheetContent>
            </Sheet>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Operations</p>
              <p className="font-semibold">Dashboard Workspace</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground">{roleLabels[user.role]}</p>
            </div>
            <Button
              variant="outline"
              aria-label="Logout"
              onClick={async () => {
                await fetchJson<{ loggedOut: boolean }>("/api/auth/logout", { method: "POST" }).catch(() => null);
                logout();
                router.replace("/login");
              }}
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </div>
        </header>
        <main className="mx-auto max-w-7xl px-4 py-6 md:px-6">{children}</main>
      </div>
    </div>
  );
}
