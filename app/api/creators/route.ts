import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import { apiError } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  try {
    const authUser = requireAuth(request);
    if (authUser instanceof NextResponse) return authUser;

    const db = await getDb();
    const creators = await db.collection("creators").find({}).sort({ name: 1 }).toArray();
    return NextResponse.json(creators.map((creator) => ({ ...creator, _id: creator._id.toString() })));
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const authUser = requireAuth(request);
    if (authUser instanceof NextResponse) return authUser;

    const body = await request.json();
    const creator = {
      name: String(body.name || "").trim(),
      email: String(body.email || "").trim(),
      specialty: String(body.specialty || "").trim(),
      status: "active",
      projects: 0,
      rating: 4.5
    };

    if (!creator.name || !creator.email || !creator.specialty) {
      return NextResponse.json({ error: "Name, email, and specialty are required" }, { status: 400 });
    }

    const db = await getDb();
    const result = await db.collection("creators").insertOne(creator);
    return NextResponse.json({ ...creator, _id: result.insertedId.toString() }, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}
