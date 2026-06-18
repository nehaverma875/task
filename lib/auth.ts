import { createHmac, timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import type { AppUser, Role } from "@/types/domain";

type JwtPayload = {
  sub: string;
  name: string;
  email: string;
  role: Role;
  iat: number;
  exp: number;
};

const tokenTtlSeconds = 60 * 60 * 24;

export function signAuthToken(user: AppUser) {
  const now = Math.floor(Date.now() / 1000);
  const payload: JwtPayload = {
    sub: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    iat: now,
    exp: now + tokenTtlSeconds
  };

  const header = { alg: "HS256", typ: "JWT" };
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signature = sign(`${encodedHeader}.${encodedPayload}`);

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

export function verifyAuthToken(token: string): JwtPayload | null {
  const [encodedHeader, encodedPayload, signature] = token.split(".");
  if (!encodedHeader || !encodedPayload || !signature) return null;

  const expected = sign(`${encodedHeader}.${encodedPayload}`);
  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);

  if (signatureBuffer.length !== expectedBuffer.length || !timingSafeEqual(signatureBuffer, expectedBuffer)) {
    return null;
  }

  try {
    const payload = JSON.parse(base64UrlDecode(encodedPayload)) as JwtPayload;
    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

export function getAuthUser(request: NextRequest): AppUser | null {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : "";
  if (!token) return null;

  const payload = verifyAuthToken(token);
  if (!payload) return null;

  return {
    _id: payload.sub,
    name: payload.name,
    email: payload.email,
    role: payload.role,
    createdAt: ""
  };
}

export function requireAuth(request: NextRequest) {
  const user = getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized. Missing or invalid token." }, { status: 401 });
  }

  return user;
}

function sign(value: string) {
  return createHmac("sha256", jwtSecret()).update(value).digest("base64url");
}

function jwtSecret() {
  return process.env.JWT_SECRET || "dev-only-change-this-secret";
}

function base64UrlEncode(value: string) {
  return Buffer.from(value).toString("base64url");
}

function base64UrlDecode(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}
