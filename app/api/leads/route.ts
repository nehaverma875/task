import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import { apiError } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  try {
    const authUser = requireAuth(request);
    if (authUser instanceof NextResponse) return authUser;

    const db = await getDb();
    const leads = await db.collection("leads").find({}).sort({ createdAt: -1 }).toArray();
    return NextResponse.json(leads.map((lead) => ({ ...lead, _id: lead._id.toString() })));
  } catch (error) {
    return apiError(error);
  }
}
