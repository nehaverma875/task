"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { fetchJson } from "@/lib/fetcher";
import { useAppStore } from "@/store/use-app-store";
import type { AppUser } from "@/types/domain";

export function LoginForm() {
  const router = useRouter();
  const { login } = useAppStore();
  const [email, setEmail] = useState("superadmin@example.com");
  const [password, setPassword] = useState("Password@123");
  const signIn = useMutation({
    mutationFn: () => fetchJson<{ user: AppUser; token: string }>("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
    onSuccess: ({ user, token }) => {
      login(user, token);
      router.replace("/dashboard");
    }
  });

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    signIn.mutate();
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <p className="text-sm text-muted-foreground">Use email and password to access the admin dashboard.</p>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={submit}>
          <Input type="email" placeholder="Email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          <Input type="password" placeholder="Password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          {signIn.isError ? <p className="text-sm text-destructive">{signIn.error.message}</p> : null}
          <Button className="w-full" disabled={signIn.isPending}>
            <LogIn className="h-4 w-4" />
            Sign In
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            New user?{" "}
            <Link href="/register" className="font-medium text-primary hover:underline">
              Create account
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
