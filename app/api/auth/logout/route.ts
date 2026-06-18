import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const authUser = requireAuth(request);
  if (authUser instanceof NextResponse) return authUser;

  return NextResponse.json({ loggedOut: true });
}
