import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req) {
  const admin = await getCurrentUser();
  if (!admin?.isAdmin) {
    return NextResponse.json({ error: "فقط مدیر بازی." }, { status: 403 });
  }

  const { userId, approved } = await req.json().catch(() => ({}));
  if (!userId || typeof approved !== "boolean") {
    return NextResponse.json({ error: "درخواست نامعتبر." }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: userId },
    data: { approved },
  });

  return NextResponse.json({ ok: true });
}
