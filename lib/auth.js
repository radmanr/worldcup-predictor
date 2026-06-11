import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { prisma } from "./db";

const COOKIE = "wc_session";
const ALG = "HS256";

function secret() {
  const s = process.env.AUTH_SECRET;
  if (!s) throw new Error("AUTH_SECRET is not set");
  return new TextEncoder().encode(s);
}

export async function createSession(user) {
  const token = await new SignJWT({ uid: user.id, isAdmin: user.isAdmin })
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret());

  cookies().set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export function clearSession() {
  cookies().set(COOKIE, "", { path: "/", maxAge: 0 });
}

export async function getSessionPayload() {
  const token = cookies().get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    return payload;
  } catch {
    return null;
  }
}

// Returns the full user record or null. Use in server components / route handlers.
export async function getCurrentUser() {
  const payload = await getSessionPayload();
  if (!payload?.uid) return null;
  const user = await prisma.user.findUnique({
    where: { id: payload.uid },
    select: { id: true, name: true, email: true, isAdmin: true },
  });
  return user;
}
