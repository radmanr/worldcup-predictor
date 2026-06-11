import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import ResultRow from "./ResultRow";

export const dynamic = "force-dynamic";

const DT_FMT = new Intl.DateTimeFormat("en-US", {
  weekday: "short", month: "short", day: "numeric",
  hour: "numeric", minute: "2-digit", timeZone: "America/New_York",
});

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (!user.isAdmin) {
    return (
      <div className="card">
        <h1>Admin</h1>
        <p className="error">This area is for organisers only.</p>
      </div>
    );
  }

  const matches = await prisma.match.findMany({ orderBy: { kickoff: "asc" } });
  const now = Date.now();

  return (
    <div className="card">
      <h1>🛠️ Admin — enter results</h1>
      <p className="muted">
        Enter the final score for each completed match and save. Points for every player are
        recalculated automatically. You can re-save to correct a result, or clear it.
      </p>
      <div style={{ marginTop: 16 }}>
        {matches.map((m) => (
          <ResultRow
            key={m.id}
            match={{
              id: m.id,
              groupName: m.groupName,
              homeTeam: m.homeTeam,
              awayTeam: m.awayTeam,
              when: DT_FMT.format(m.kickoff) + " ET",
              started: m.kickoff.getTime() <= now,
              homeScore: m.homeScore,
              awayScore: m.awayScore,
              finished: m.finished,
            }}
          />
        ))}
      </div>
    </div>
  );
}
