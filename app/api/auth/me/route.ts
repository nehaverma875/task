import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { requireAuth } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import { sanitizeUser } from "@/lib/users";
import { apiError } from "@/lib/api-utils";
import type { UserDocument } from "@/types/domain";

export async function GET(request: NextRequest) {
  try {
    const authUser = requireAuth(request);
    if (authUser instanceof NextResponse) return authUser;

    if (!ObjectId.isValid(authUser._id)) {
      return NextResponse.json({ error: "Invalid token subject" }, { status: 401 });
    }

    const db = await getDb();
    const user = await db.collection<UserDocument>("users").findOne({ _id: new ObjectId(authUser._id) });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json({ user: sanitizeUser(user) });
  } catch (error) {
    return apiError(error);
  }
}
