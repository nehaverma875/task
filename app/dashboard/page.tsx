"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Activity, BriefcaseBusiness, DollarSign, FolderOpen, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchJson } from "@/lib/fetcher";
import { formatCurrency } from "@/lib/utils";
import type { Metrics } from "@/types/domain";

const cards = [
  { key: "totalClients", label: "Total Clients", icon: Users },
  { key: "totalProjects", label: "Total Projects", icon: FolderOpen },
  { key: "activeProjects", label: "Active Projects", icon: Activity },
  { key: "revenue", label: "Revenue", icon: DollarSign },
  { key: "leads", label: "Leads", icon: BriefcaseBusiness }
] as const;

export default function DashboardPage() {
  const queryClient = useQueryClient();
  const metrics = useQuery({
    queryKey: ["metrics"],
    queryFn: () => fetchJson<Metrics>("/api/metrics")
  });
  const seed = useMutation({
    mutationFn: () => fetchJson<{ seeded: boolean }>("/api/seed", { method: "POST" }),
    onSuccess: () => queryClient.invalidateQueries()
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <h2 className="text-2xl font-semibold">Dashboard</h2>
          <p className="text-sm text-muted-foreground">Live operating metrics from MongoDB-backed collections.</p>
        </div>
        <Button variant="secondary" onClick={() => seed.mutate()} disabled={seed.isPending}>
          Seed MongoDB
        </Button>
      </div>

      {metrics.isError ? (
        <Card>
          <CardContent className="pt-5 text-sm text-destructive">{metrics.error.message}</CardContent>
        </Card>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {cards.map((item) => {
          const Icon = item.icon;
          const rawValue = metrics.data?.[item.key] ?? 0;
          const value = item.key === "revenue" ? formatCurrency(rawValue) : rawValue.toLocaleString();
          return (
            <Card key={item.key}>
              <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{item.label}</CardTitle>
                <Icon className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">{metrics.isLoading ? "-" : value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <section>
        <Card>
          <CardHeader>
            <CardTitle>Operational Focus</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-3">
            {["Creators", "Projects", "Leads"].map((label, index) => (
              <div key={label} className="rounded-md border p-4">
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="mt-2 text-xl font-semibold">{["Capacity", "Delivery", "Pipeline"][index]}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
