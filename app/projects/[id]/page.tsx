"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { fetchJson } from "@/lib/fetcher";
import { formatCurrency } from "@/lib/utils";
import type { Project } from "@/types/domain";

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>();
  const project = useQuery({
    queryKey: ["project", params.id],
    queryFn: () => fetchJson<Project>(`/api/projects/${params.id}`)
  });

  return (
    <div className="space-y-5">
      <Link href="/projects" className="inline-flex h-9 items-center gap-2 rounded-md px-3 text-sm font-medium hover:bg-muted">
        <ArrowLeft className="h-4 w-4" />
        Projects
      </Link>
      {project.isError ? <p className="text-sm text-destructive">{project.error.message}</p> : null}
      {project.data ? (
        <Card>
          <CardHeader>
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
              <div>
                <CardTitle className="text-2xl">{project.data.name}</CardTitle>
                <p className="mt-2 text-sm text-muted-foreground">{project.data.description}</p>
              </div>
              <StatusBadge value={project.data.status} />
            </div>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Detail label="Client" value={project.data.client} />
            <Detail label="Owner" value={project.data.owner} />
            <Detail label="Budget" value={formatCurrency(project.data.budget)} />
            <Detail label="Timeline" value={`${project.data.startDate} to ${project.data.dueDate}`} />
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 font-medium">{value}</p>
    </div>
  );
}
