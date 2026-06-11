import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const user = await getCurrentUser();

  let stats = null;
  if (user) {
    const [players, predictions, myPoints] = await Promise.all([
      prisma.user.count(),
      prisma.prediction.count({ where: { userId: user.id } }),
      prisma.prediction.aggregate({ where: { userId: user.id }, _sum: { points: true } }),
    ]);
    stats = { players, predictions, points: myPoints._sum.points || 0 };
  }

  return (
    <>
      <div className="card hero">
        <h1>⚽ Office World Cup Predictor 2026</h1>
        <p className="muted" style={{ maxWidth: 560, margin: "0 auto 20px" }}>
          Predict every group-stage match of the FIFA World Cup 2026. Score 3 points for an exact
          result, 1 for the right outcome, and climb the office leaderboard.
        </p>
        {user ? (
          <Link href="/games" className="btn">Make your predictions</Link>
        ) : (
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <Link href="/register" className="btn">Register</Link>
            <Link href="/login" className="btn secondary">Log in</Link>
          </div>
        )}
      </div>

      {user && stats && (
        <div className="card">
          <h2>Welcome back, {user.name}</h2>
          <div className="points-grid">
            <div className="box"><div className="big">{stats.points}</div><div className="muted">Your points</div></div>
            <div className="box"><div className="big">{stats.predictions}</div><div className="muted">Predictions made</div></div>
            <div className="box"><div className="big">{stats.players}</div><div className="muted">Players registered</div></div>
          </div>
          <p className="muted">
            Head to <Link href="/games">Games</Link> to lock in your scores before kickoff, check the{" "}
            <Link href="/leaderboard">Leaderboard</Link>, or read the <Link href="/rules">Rules</Link>.
          </p>
        </div>
      )}

      {!user && (
        <div className="card">
          <h2>How it works</h2>
          <p className="muted">
            Register with the code from your organiser, predict the scoreline of each match before it
            kicks off, and earn points based on how close you get. Predictions lock automatically at
            kickoff, so get them in early. See the full <Link href="/rules">rules</Link>.
          </p>
        </div>
      )}
    </>
  );
}
