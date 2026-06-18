import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { creatorsSeed, leadsSeed, projectsSeed, usersSeed } from "@/lib/seed-data";
import { apiError } from "@/lib/api-utils";

export async function POST() {
  try {
    const db = await getDb();
    const [projects, leads, creators, users] = await Promise.all([
      db.collection("projects").countDocuments(),
      db.collection("leads").countDocuments(),
      db.collection("creators").countDocuments(),
      db.collection("users").countDocuments()
    ]);

    if (projects === 0) await db.collection("projects").insertMany(projectsSeed);
    if (leads === 0) await db.collection("leads").insertMany(leadsSeed);
    if (creators === 0) await db.collection("creators").insertMany(creatorsSeed);
    if (users === 0) {
      await db.collection("users").createIndex({ email: 1 }, { unique: true });
      await db.collection("users").insertMany(usersSeed());
    }

    return NextResponse.json({ seeded: true });
  } catch (error) {
    return apiError(error);
  }
}
