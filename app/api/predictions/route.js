import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "وارد نشده‌اید." }, { status: 401 });
  if (!user.isAdmin && !user.approved) {
    return NextResponse.json({ error: "حساب شما هنوز توسط مدیر بازی تأیید نشده است." }, { status: 403 });
  }

  const { matchId, homeScore, awayScore } = await req.json().catch(() => ({}));
  const mId = parseInt(matchId, 10);
  const h = parseInt(homeScore, 10);
  const a = parseInt(awayScore, 10);

  if (Number.isNaN(mId) || Number.isNaN(h) || Number.isNaN(a)) {
    return NextResponse.json({ error: "لطفاً هر دو نتیجه را وارد کنید." }, { status: 400 });
  }
  if (h < 0 || a < 0 || h > 30 || a > 30) {
    return NextResponse.json({ error: "نتیجه باید بین ۰ تا ۳۰ باشد." }, { status: 400 });
  }

  const match = await prisma.match.findUnique({ where: { id: mId } });
  if (!match) return NextResponse.json({ error: "بازی یافت نشد." }, { status: 404 });

  if (new Date() >= match.kickoff) {
    return NextResponse.json({ error: "این بازی شروع شده است — پیش‌بینی قفل شده است." }, { status: 403 });
  }

  await prisma.prediction.upsert({
    where: { userId_matchId: { userId: user.id, matchId: mId } },
    update: { homeScore: h, awayScore: a },
    create: { userId: user.id, matchId: mId, homeScore: h, awayScore: a },
  });

  return NextResponse.json({ ok: true });
}
