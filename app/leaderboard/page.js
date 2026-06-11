import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function LeaderboardPage() {
  const user = await getCurrentUser();

  // Aggregate points + counts per user
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      predictions: { select: { points: true } },
    },
  });

  const rows = users
    .map((u) => {
      const points = u.predictions.reduce((s, p) => s + p.points, 0);
      const exact = u.predictions.filter((p) => p.points === 3).length;
      const made = u.predictions.length;
      return { id: u.id, name: u.name, points, exact, made };
    })
    .sort((a, b) => b.points - a.points || b.exact - a.exact || a.name.localeCompare(b.name));

  return (
    <div className="card">
      <h1>🏆 Leaderboard</h1>
      <p className="muted">
        Ranked by total points, then by number of exact-score hits. Points update as match results
        are entered.
      </p>
      {rows.length === 0 ? (
        <p className="muted">No players yet. Be the first to register!</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Player</th>
              <th style={{ textAlign: "center" }}>Predicted</th>
              <th style={{ textAlign: "center" }}>Exact</th>
              <th style={{ textAlign: "right" }}>Points</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.id} className={user && r.id === user.id ? "me-row" : ""}>
                <td className={`rank r${i + 1}`}>{i + 1}</td>
                <td>{r.name}{user && r.id === user.id ? " (you)" : ""}</td>
                <td style={{ textAlign: "center" }}>{r.made}</td>
                <td style={{ textAlign: "center" }}>{r.exact}</td>
                <td className="pts">{r.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
