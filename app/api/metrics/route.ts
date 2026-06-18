import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import { apiError } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  try {
    const authUser = requireAuth(request);
    if (authUser instanceof NextResponse) return authUser;

    const db = await getDb();
    const [clients, totalProjects, activeProjects, revenueAgg, leads] = await Promise.all([
      db.collection("projects").distinct("client"),
      db.collection("projects").countDocuments(),
      db.collection("projects").countDocuments({ status: "active" }),
      db.collection("projects").aggregate([{ $group: { _id: null, revenue: { $sum: "$budget" } } }]).toArray(),
      db.collection("leads").countDocuments()
    ]);

    return NextResponse.json({
      totalClients: clients.length,
      totalProjects,
      activeProjects,
      revenue: revenueAgg[0]?.revenue ?? 0,
      leads
    });
  } catch (error) {
    return apiError(error);
  }
}
