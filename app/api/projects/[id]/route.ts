import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ObjectId } from "mongodb";
import { requireAuth } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import { apiError } from "@/lib/api-utils";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authUser = requireAuth(request);
    if (authUser instanceof NextResponse) return authUser;

    const { id } = await params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid project id" }, { status: 400 });
    }

    const db = await getDb();
    const project = await db.collection("projects").findOne({ _id: new ObjectId(id) });
    if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });

    return NextResponse.json({ ...project, _id: project._id.toString() });
  } catch (error) {
    return apiError(error);
  }
}
