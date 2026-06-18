"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchJson } from "@/lib/fetcher";
import { roleLabels } from "@/lib/rbac";
import { useAppStore } from "@/store/use-app-store";
import type { AppUser, Role } from "@/types/domain";

const roles: Role[] = ["super-admin", "admin", "agent"];

export function RegisterForm() {
  const router = useRouter();
  const { login } = useAppStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("agent");
  const register = useMutation({
    mutationFn: () =>
      fetchJson<{ user: AppUser; token: string }>("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password, role })
      }),
    onSuccess: ({ user, token }) => {
      login(user, token);
      router.replace("/dashboard");
    }
  });

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    register.mutate();
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Create Account</CardTitle>
        <p className="text-sm text-muted-foreground">Register a user with platform role permissions.</p>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={submit}>
          <Input placeholder="Name" value={name} onChange={(event) => setName(event.target.value)} required />
          <Input type="email" placeholder="Email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          <Input type="password" placeholder="Password" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={8} />
          <Select value={role} onValueChange={(value) => setRole(value as Role)}>
            <SelectTrigger>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              {roles.map((item) => (
                <SelectItem key={item} value={item}>
                  {roleLabels[item]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {register.isError ? <p className="text-sm text-destructive">{register.error.message}</p> : null}
          <Button className="w-full" disabled={register.isPending}>
            <UserPlus className="h-4 w-4" />
            Register
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Already registered?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
