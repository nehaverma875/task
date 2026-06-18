"use client";

import { FormEvent, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Power } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/status-badge";
import { fetchJson } from "@/lib/fetcher";
import { can } from "@/lib/rbac";
import { useAppStore } from "@/store/use-app-store";
import type { Creator } from "@/types/domain";

type CreatorForm = {
  name: string;
  email: string;
  specialty: string;
};

const emptyForm: CreatorForm = { name: "", email: "", specialty: "" };

export default function CreatorsPage() {
  const { role } = useAppStore();
  const queryClient = useQueryClient();
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const creators = useQuery({
    queryKey: ["creators"],
    queryFn: () => fetchJson<Creator[]>("/api/creators")
  });
  const createCreator = useMutation({
    mutationFn: (payload: CreatorForm) => fetchJson<Creator>("/api/creators", { method: "POST", body: JSON.stringify(payload) }),
    onSuccess: () => {
      setForm(emptyForm);
      queryClient.invalidateQueries({ queryKey: ["creators"] });
    }
  });
  const updateCreator = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Creator> }) =>
      fetchJson<Creator>(`/api/creators/${id}`, { method: "PATCH", body: JSON.stringify(payload) }),
    onSuccess: () => {
      setForm(emptyForm);
      setEditingId(null);
      queryClient.invalidateQueries({ queryKey: ["creators"] });
    }
  });

  const canCreate = can(role, "creators:create");
  const canEdit = can(role, "creators:edit");
  const canToggle = can(role, "creators:toggle");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (editingId) updateCreator.mutate({ id: editingId, payload: form });
    else createCreator.mutate(form);
  }

  function edit(creator: Creator) {
    setEditingId(creator._id);
    setForm({ name: creator.name, email: creator.email, specialty: creator.specialty });
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-semibold">Creator Management</h2>
        <p className="text-sm text-muted-foreground">Create, edit, activate, and deactivate creators based on role permissions.</p>
      </div>

      {(canCreate || (canEdit && editingId)) && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Edit Creator" : "Create Creator"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="grid gap-3 md:grid-cols-[1fr_1fr_1fr_auto]" onSubmit={submit}>
              <Input required placeholder="Name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
              <Input required type="email" placeholder="Email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
              <Input required placeholder="Specialty" value={form.specialty} onChange={(event) => setForm({ ...form, specialty: event.target.value })} />
              <Button disabled={createCreator.isPending || updateCreator.isPending}>
                {editingId ? <Pencil className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                {editingId ? "Save" : "Create"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {creators.data?.map((creator) => (
          <Card key={creator._id}>
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardTitle>{creator.name}</CardTitle>
                  <p className="mt-1 text-sm text-muted-foreground">{creator.email}</p>
                </div>
                <StatusBadge value={creator.status} />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Specialty</p>
                  <p className="font-medium">{creator.specialty}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Projects</p>
                  <p className="font-medium">{creator.projects}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Rating</p>
                  <p className="font-medium">{creator.rating}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {canEdit ? (
                  <Button variant="outline" size="sm" onClick={() => edit(creator)}>
                    <Pencil className="h-4 w-4" />
                    Edit
                  </Button>
                ) : null}
                {canToggle ? (
                  <Button
                    variant={creator.status === "active" ? "destructive" : "secondary"}
                    size="sm"
                    onClick={() =>
                      updateCreator.mutate({
                        id: creator._id,
                        payload: { status: creator.status === "active" ? "inactive" : "active" }
                      })
                    }
                  >
                    <Power className="h-4 w-4" />
                    {creator.status === "active" ? "Deactivate" : "Activate"}
                  </Button>
                ) : null}
                {!canEdit && !canToggle ? <p className="text-sm text-muted-foreground">No creator actions for this role.</p> : null}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
