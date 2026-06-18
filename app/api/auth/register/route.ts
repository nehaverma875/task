import { NextRequest, NextResponse } from "next/server";
import { signAuthToken } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import { hashPassword } from "@/lib/password";
import { apiError } from "@/lib/api-utils";
import type { Role, UserDocument } from "@/types/domain";

const roles: Role[] = ["super-admin", "admin", "agent"];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");
    const role = String(body.role || "") as Role;

    if (!name || !email || !password || !roles.includes(role)) {
      return NextResponse.json({ error: "Name, email, password, and valid role are required" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }

    const db = await getDb();
    await db.collection("users").createIndex({ email: 1 }, { unique: true });

    const exists = await db.collection<UserDocument>("users").findOne({ email });
    if (exists) {
      return NextResponse.json({ error: "A user with this email already exists" }, { status: 409 });
    }

    const user: UserDocument = {
      name,
      email,
      role,
      passwordHash: hashPassword(password),
      createdAt: new Date().toISOString()
    };

    const result = await db.collection<UserDocument>("users").insertOne(user);
    const safeUser = {
      _id: result.insertedId.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    };

    return NextResponse.json(
      {
        user: safeUser,
        token: signAuthToken(safeUser)
      },
      { status: 201 }
    );
  } catch (error) {
    return apiError(error);
  }
}
