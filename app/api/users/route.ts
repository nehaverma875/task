import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import { sanitizeUser } from "@/lib/users";
import { apiError } from "@/lib/api-utils";
import type { UserDocument } from "@/types/domain";

export async function GET(request: NextRequest) {
  try {
    const authUser = requireAuth(request);
    if (authUser instanceof NextResponse) return authUser;

    const db = await getDb();
    const users = await db.collection<UserDocument>("users").find({}).sort({ role: 1, name: 1 }).toArray();
    return NextResponse.json(users.map(sanitizeUser));
  } catch (error) {
    return apiError(error);
  }
}
