import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import { apiError } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  try {
    const authUser = requireAuth(request);
    if (authUser instanceof NextResponse) return authUser;

    const db = await getDb();
    const searchParams = request.nextUrl.searchParams;
    const page = Math.max(Number(searchParams.get("page") || 1), 1);
    const pageSize = Math.min(Math.max(Number(searchParams.get("pageSize") || 5), 1), 20);
    const search = searchParams.get("search")?.trim();
    const status = searchParams.get("status")?.trim();

    const query: Record<string, unknown> = {};
    if (status && status !== "all") query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { client: { $regex: search, $options: "i" } },
        { owner: { $regex: search, $options: "i" } }
      ];
    }

    const [projects, total] = await Promise.all([
      db
        .collection("projects")
        .find(query)
        .sort({ dueDate: 1 })
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .toArray(),
      db.collection("projects").countDocuments(query)
    ]);

    return NextResponse.json({
      projects: projects.map((project) => ({ ...project, _id: project._id.toString() })),
      total,
      page,
      pageSize
    });
  } catch (error) {
    return apiError(error);
  }
}
