"use client";

import { useQuery } from "@tanstack/react-query";
import { StatusBadge } from "@/components/ui/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchJson } from "@/lib/fetcher";
import { formatCurrency } from "@/lib/utils";
import type { Lead, LeadStatus } from "@/types/domain";

const groups: { status: LeadStatus; label: string }[] = [
  { status: "new", label: "New Leads" },
  { status: "assigned", label: "Assigned Leads" },
  { status: "converted", label: "Converted Leads" }
];

export default function LeadsPage() {
  const leads = useQuery({
    queryKey: ["leads"],
    queryFn: () => fetchJson<Lead[]>("/api/leads")
  });

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-semibold">Leads</h2>
        <p className="text-sm text-muted-foreground">Pipeline grouped by new, assigned, and converted stages.</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {groups.map((group) => {
          const items = leads.data?.filter((lead) => lead.status === group.status) ?? [];
          return (
            <Card key={group.status}>
              <CardHeader className="flex-row items-center justify-between">
                <CardTitle>{group.label}</CardTitle>
                <StatusBadge value={group.status} />
              </CardHeader>
              <CardContent className="space-y-3">
                {items.map((lead) => (
                  <div key={lead._id} className="rounded-md border p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium">{lead.name}</p>
                        <p className="text-sm text-muted-foreground">{lead.company}</p>
                      </div>
                      <p className="text-sm font-semibold">{formatCurrency(lead.value)}</p>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                      <span>{lead.source}</span>
                      <span>{lead.assignedTo}</span>
                    </div>
                  </div>
                ))}
                {!leads.isLoading && items.length === 0 ? <p className="text-sm text-muted-foreground">No leads in this stage.</p> : null}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
