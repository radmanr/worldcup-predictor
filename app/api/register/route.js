import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { createSession } from "@/lib/auth";

export async function POST(req) {
  const { name, email, password, code } = await req.json().catch(() => ({}));

  if (!name || !email || !password) {
    return NextResponse.json({ error: "Name, email and password are required." }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json({ error: "Password must be at least 6 characters." }, { status: 400 });
  }

  const required = process.env.REGISTRATION_CODE;
  if (required && code !== required) {
    return NextResponse.json({ error: "Invalid registration code." }, { status: 403 });
  }

  const normEmail = String(email).toLowerCase().trim();
  const existing = await prisma.user.findUnique({ where: { email: normEmail } });
  if (existing) {
    return NextResponse.json({ error: "An account with that email already exists." }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name: String(name).trim(), email: normEmail, passwordHash },
  });

  await createSession(user);
  return NextResponse.json({ ok: true });
}
