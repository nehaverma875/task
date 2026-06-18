"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge } from "@/components/ui/status-badge";
import { fetchJson } from "@/lib/fetcher";
import { formatCurrency, titleCase } from "@/lib/utils";
import type { PaginatedProjects, ProjectStatus } from "@/types/domain";

const statuses: Array<ProjectStatus | "all"> = ["all", "planning", "active", "on-hold", "completed"];

export default function ProjectsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ProjectStatus | "all">("all");
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const query = useMemo(() => {
    const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize), status });
    if (search.trim()) params.set("search", search.trim());
    return params.toString();
  }, [page, search, status]);
  const projects = useQuery({
    queryKey: ["projects", query],
    queryFn: () => fetchJson<PaginatedProjects>(`/api/projects?${query}`)
  });
  const totalPages = Math.max(Math.ceil((projects.data?.total ?? 0) / pageSize), 1);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-semibold">Projects</h2>
        <p className="text-sm text-muted-foreground">Search, filter, and inspect project delivery records.</p>
      </div>
      <Card>
        <CardHeader className="gap-3">
          <CardTitle>Project Listing</CardTitle>
          <div className="grid gap-3 md:grid-cols-[1fr_220px]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => {
                  setPage(1);
                  setSearch(event.target.value);
                }}
                placeholder="Search projects, clients, owners"
                className="pl-9"
              />
            </div>
            <Select
              value={status}
              onValueChange={(value) => {
                setPage(1);
                setStatus(value as ProjectStatus | "all");
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item === "all" ? "All statuses" : titleCase(item)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-md border">
            <div className="hidden grid-cols-[1.5fr_1fr_1fr_120px_120px] bg-muted px-4 py-3 text-xs font-medium uppercase text-muted-foreground md:grid">
              <span>Project</span>
              <span>Owner</span>
              <span>Due</span>
              <span>Status</span>
              <span className="text-right">Budget</span>
            </div>
            <div className="divide-y">
              {projects.data?.projects.map((project) => (
                <Link
                  href={`/projects/${project._id}`}
                  key={project._id}
                  className="grid gap-2 px-4 py-4 transition hover:bg-muted/60 md:grid-cols-[1.5fr_1fr_1fr_120px_120px] md:items-center"
                >
                  <div>
                    <p className="font-medium">{project.name}</p>
                    <p className="text-sm text-muted-foreground">{project.client}</p>
                  </div>
                  <span className="text-sm">{project.owner}</span>
                  <span className="text-sm">{project.dueDate}</span>
                  <StatusBadge value={project.status} />
                  <span className="text-sm font-medium md:text-right">{formatCurrency(project.budget)}</span>
                </Link>
              ))}
              {!projects.isLoading && projects.data?.projects.length === 0 ? (
                <div className="px-4 py-8 text-center text-sm text-muted-foreground">No projects match the current filters.</div>
              ) : null}
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" disabled={page === 1} onClick={() => setPage((value) => value - 1)} aria-label="Previous page">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" disabled={page >= totalPages} onClick={() => setPage((value) => value + 1)} aria-label="Next page">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
