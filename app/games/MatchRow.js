"use client";

import { useState } from "react";
import { teamLabel } from "@/lib/teams";
import { toFa, formatTime, groupLabel } from "@/lib/format";

export default function MatchRow({ match, prediction }) {
  const [home, setHome] = useState(prediction ? String(prediction.homeScore) : "");
  const [away, setAway] = useState(prediction ? String(prediction.awayScore) : "");
  const [status, setStatus] = useState(""); // "", "saving", "saved", error text
  const [isError, setIsError] = useState(false);

  const kickoffTime = formatTime(new Date(match.kickoff));
  const locked = match.locked;

  async function save() {
    setIsError(false);
    setStatus("saving");
    const res = await fetch("/api/predictions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ matchId: match.id, homeScore: home, awayScore: away }),
    });
    if (res.ok) {
      setStatus("saved");
      setTimeout(() => setStatus(""), 1800);
    } else {
      const data = await res.json().catch(() => ({}));
      setIsError(true);
      setStatus(data.error || "ذخیره نشد.");
    }
  }

  return (
    <div className="match-row-wrap">
      <div className="match">
        <div className="team home">{teamLabel(match.homeTeam)}</div>
        <div className="mid">
          {locked ? (
            <div className="score-inputs">
              <span>{prediction ? toFa(prediction.homeScore) : "–"}</span>
              <span className="sep">:</span>
              <span>{prediction ? toFa(prediction.awayScore) : "–"}</span>
            </div>
          ) : (
            <div className="score-inputs">
              <input type="number" min="0" max="30" value={home}
                onChange={(e) => setHome(e.target.value)} aria-label="گل تیم میزبان" />
              <span className="sep">:</span>
              <input type="number" min="0" max="30" value={away}
                onChange={(e) => setAway(e.target.value)} aria-label="گل تیم میهمان" />
            </div>
          )}
        </div>
        <div className="team away">{teamLabel(match.awayTeam)}</div>
      </div>

      <div className="match-foot">
        <span className="meta">
          <span className="badge">{groupLabel(match.groupName)}</span>{" "}
          {kickoffTime} به وقت ایران
          {match.finished && match.homeScore != null && (
            <> · نتیجه: <strong>{toFa(match.homeScore)}–{toFa(match.awayScore)}</strong></>
          )}
        </span>

        <span style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {match.finished && prediction && (
            <span className="badge points">{toFa(prediction.points)}+ امتیاز</span>
          )}
          {locked && !match.finished && <span className="badge locked">قفل شد</span>}
          {!locked && (
            <>
              {status && status !== "saving" && status !== "saved" && (
                <span className="error" style={{ margin: 0 }}>{status}</span>
              )}
              {status === "saved" && <span className="success" style={{ margin: 0 }}>ذخیره شد ✓</span>}
              <button className="btn secondary" onClick={save} disabled={status === "saving"}>
                {status === "saving" ? "در حال ذخیره…" : prediction ? "ویرایش" : "ذخیره"}
              </button>
            </>
          )}
        </span>
      </div>
    </div>
  );
}
