import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { scorePrediction } from "@/lib/scoring";

export async function POST(req) {
  const user = await getCurrentUser();
  if (!user?.isAdmin) {
    return NextResponse.json({ error: "Admins only." }, { status: 403 });
  }

  const body = await req.json().catch(() => ({}));
  const mId = parseInt(body.matchId, 10);
  const clear = body.clear === true;

  const match = await prisma.match.findUnique({ where: { id: mId } });
  if (!match) return NextResponse.json({ error: "Match not found." }, { status: 404 });

  if (clear) {
    // Remove the result and zero out points for this match.
    await prisma.$transaction([
      prisma.match.update({
        where: { id: mId },
        data: { homeScore: null, awayScore: null, finished: false },
      }),
      prisma.prediction.updateMany({ where: { matchId: mId }, data: { points: 0 } }),
    ]);
    return NextResponse.json({ ok: true, cleared: true });
  }

  const h = parseInt(body.homeScore, 10);
  const a = parseInt(body.awayScore, 10);
  if (Number.isNaN(h) || Number.isNaN(a) || h < 0 || a < 0) {
    return NextResponse.json({ error: "Enter both final scores (0 or more)." }, { status: 400 });
  }

  const predictions = await prisma.prediction.findMany({ where: { matchId: mId } });

  await prisma.$transaction([
    prisma.match.update({
      where: { id: mId },
      data: { homeScore: h, awayScore: a, finished: true },
    }),
    ...predictions.map((p) =>
      prisma.prediction.update({
        where: { id: p.id },
        data: { points: scorePrediction(p, h, a) },
      })
    ),
  ]);

  return NextResponse.json({ ok: true, scored: predictions.length });
}
