import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { createSession } from "@/lib/auth";

export async function POST(req) {
  const { firstName, lastName, email, password, code } = await req.json().catch(() => ({}));

  const first = String(firstName || "").trim();
  const last = String(lastName || "").trim();
  const name = `${first} ${last}`.trim();

  if (!first || !last || !email || !password) {
    return NextResponse.json({ error: "نام، نام خانوادگی، ایمیل و رمز عبور الزامی است." }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json({ error: "رمز عبور باید حداقل ۶ کاراکتر باشد." }, { status: 400 });
  }

  const required = process.env.REGISTRATION_CODE;
  if (required && code !== required) {
    return NextResponse.json({ error: "کد دعوت نامعتبر است." }, { status: 403 });
  }

  const normEmail = String(email).toLowerCase().trim();
  const existing = await prisma.user.findUnique({ where: { email: normEmail } });
  if (existing) {
    return NextResponse.json({ error: "حسابی با این ایمیل از قبل وجود دارد." }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name: String(name).trim(), email: normEmail, passwordHash },
  });

  await createSession(user);
  return NextResponse.json({ ok: true });
}
