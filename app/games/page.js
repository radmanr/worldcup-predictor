import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatDay, toFa } from "@/lib/format";
import MatchRow from "./MatchRow";

export const dynamic = "force-dynamic";

export default async function GamesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const [matches, predictions] = await Promise.all([
    prisma.match.findMany({ orderBy: { kickoff: "asc" } }),
    prisma.prediction.findMany({ where: { userId: user.id } }),
  ]);

  const predByMatch = {};
  for (const p of predictions) predByMatch[p.matchId] = p;

  // Group matches by Tehran-time calendar day
  const groups = [];
  let current = null;
  for (const m of matches) {
    const day = formatDay(m.kickoff);
    if (!current || current.day !== day) {
      current = { day, items: [] };
      groups.push(current);
    }
    current.items.push(m);
  }

  const made = predictions.filter((p) => p.homeScore != null).length;

  return (
    <>
      <div className="card">
        <h1>بازی‌های مرحلهٔ گروهی</h1>
        <p className="muted">
          برای هر بازی نتیجهٔ پیش‌بینی خود را وارد و ذخیره کنید. پیش‌بینی هر بازی در زمان شروع آن قفل
          می‌شود (زمان‌ها به وقت ایران). شما تاکنون <strong>{toFa(made)}</strong> از {toFa(matches.length)}{" "}
          پیش‌بینی را ثبت کرده‌اید. <Link href="/rules">نحوهٔ امتیازدهی</Link> را ببینید.
        </p>
      </div>

      {groups.map((g) => (
        <div key={g.day}>
          <div className="day-head">{g.day}</div>
          {g.items.map((m) => (
            <MatchRow
              key={m.id}
              match={{
                id: m.id,
                groupName: m.groupName,
                homeTeam: m.homeTeam,
                awayTeam: m.awayTeam,
                kickoff: m.kickoff.toISOString(),
                homeScore: m.homeScore,
                awayScore: m.awayScore,
                finished: m.finished,
                locked: m.kickoff.getTime() <= Date.now(),
              }}
              prediction={
                predByMatch[m.id]
                  ? {
                      homeScore: predByMatch[m.id].homeScore,
                      awayScore: predByMatch[m.id].awayScore,
                      points: predByMatch[m.id].points,
                    }
                  : null
              }
            />
          ))}
        </div>
      ))}
    </>
  );
}
