import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import MatchRow from "./MatchRow";

export const dynamic = "force-dynamic";

const DAY_FMT = new Intl.DateTimeFormat("en-US", {
  weekday: "long", month: "long", day: "numeric", timeZone: "America/New_York",
});

export default async function GamesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const [matches, predictions] = await Promise.all([
    prisma.match.findMany({ orderBy: { kickoff: "asc" } }),
    prisma.prediction.findMany({ where: { userId: user.id } }),
  ]);

  const predByMatch = {};
  for (const p of predictions) predByMatch[p.matchId] = p;

  // Group matches by Eastern-time calendar day
  const groups = [];
  let current = null;
  for (const m of matches) {
    const day = DAY_FMT.format(m.kickoff);
    if (!current || current.day !== day) {
      current = { day, items: [] };
      groups.push(current);
    }
    current.items.push(m);
  }

  const now = Date.now();
  const made = predictions.filter((p) => {
    const m = matches.find((x) => x.id === p.matchId);
    return m && p.homeScore != null;
  }).length;

  return (
    <>
      <div className="card">
        <h1>Group Stage Fixtures</h1>
        <p className="muted">
          Enter your predicted scoreline for each match and hit save. Predictions lock at kickoff
          (times shown in US Eastern). You've made <strong>{made}</strong> of {matches.length}{" "}
          predictions. See <Link href="/rules">how points work</Link>.
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
                locked: m.kickoff.getTime() <= now,
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
