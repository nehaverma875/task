import { NextRequest, NextResponse } from "next/server";
import { signAuthToken } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import { verifyPassword } from "@/lib/password";
import { sanitizeUser } from "@/lib/users";
import { apiError } from "@/lib/api-utils";
import type { UserDocument } from "@/types/domain";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const db = await getDb();
    const user = await db.collection<UserDocument>("users").findOne({ email });
    if (!user || !verifyPassword(password, user.passwordHash)) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const safeUser = sanitizeUser(user);
    return NextResponse.json({ user: safeUser, token: signAuthToken(safeUser) });
  } catch (error) {
    return apiError(error);
  }
}
