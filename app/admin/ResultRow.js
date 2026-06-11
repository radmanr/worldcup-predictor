"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { teamLabel } from "@/lib/teams";
import { groupLabel } from "@/lib/format";

export default function ResultRow({ match }) {
  const router = useRouter();
  const [home, setHome] = useState(match.homeScore != null ? String(match.homeScore) : "");
  const [away, setAway] = useState(match.awayScore != null ? String(match.awayScore) : "");
  const [status, setStatus] = useState("");
  const [isError, setIsError] = useState(false);

  async function send(payload, okMsg) {
    setIsError(false);
    setStatus("saving");
    const res = await fetch("/api/admin/results", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      setStatus(okMsg);
      router.refresh();
      setTimeout(() => setStatus(""), 2000);
    } else {
      const data = await res.json().catch(() => ({}));
      setIsError(true);
      setStatus(data.error || "ذخیره نشد.");
    }
  }

  return (
    <div className="match-row-wrap" style={{ borderBottom: "1px solid var(--line)", paddingBottom: 12 }}>
      <div className="match" style={{ background: "transparent", border: "none", padding: "6px 0" }}>
        <div className="team home">{teamLabel(match.homeTeam)}</div>
        <div className="mid">
          <div className="score-inputs">
            <input type="number" min="0" value={home} onChange={(e) => setHome(e.target.value)} />
            <span className="sep">:</span>
            <input type="number" min="0" value={away} onChange={(e) => setAway(e.target.value)} />
          </div>
        </div>
        <div className="team away">{teamLabel(match.awayTeam)}</div>
      </div>
      <div className="match-foot">
        <span className="meta">
          <span className="badge">{groupLabel(match.groupName)}</span> {match.when}
          {match.finished && <span className="badge points" style={{ marginInlineStart: 6 }}>نتیجه ثبت شد</span>}
          {!match.started && <span className="badge" style={{ marginInlineStart: 6 }}>شروع‌نشده</span>}
        </span>
        <span style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {status && status !== "saving" && (
            <span className={isError ? "error" : "success"} style={{ margin: 0 }}>{status}</span>
          )}
          {match.finished && (
            <button className="btn secondary" onClick={() => send({ matchId: match.id, clear: true }, "پاک شد")}>
              پاک کردن
            </button>
          )}
          <button
            className="btn"
            disabled={status === "saving"}
            onClick={() => send({ matchId: match.id, homeScore: home, awayScore: away }, "ذخیره شد ✓")}
          >
            {status === "saving" ? "در حال ذخیره…" : "ثبت نتیجه"}
          </button>
        </span>
      </div>
    </div>
  );
}
