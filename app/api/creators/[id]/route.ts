import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { requireAuth } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import { apiError } from "@/lib/api-utils";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authUser = requireAuth(request);
    if (authUser instanceof NextResponse) return authUser;

    const { id } = await params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid creator id" }, { status: 400 });
    }

    const body = await request.json();
    const update: Record<string, unknown> = {};
    for (const key of ["name", "email", "specialty", "status"] as const) {
      if (body[key] !== undefined) update[key] = body[key];
    }

    const db = await getDb();
    const result = await db.collection("creators").findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: update },
      { returnDocument: "after" }
    );

    if (!result) return NextResponse.json({ error: "Creator not found" }, { status: 404 });
    return NextResponse.json({ ...result, _id: result._id.toString() });
  } catch (error) {
    return apiError(error);
  }
}
