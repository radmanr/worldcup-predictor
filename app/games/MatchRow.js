"use client";

import { useState } from "react";

const TIME_FMT = new Intl.DateTimeFormat("en-US", {
  hour: "numeric", minute: "2-digit", timeZone: "America/New_York",
});

export default function MatchRow({ match, prediction }) {
  const [home, setHome] = useState(prediction ? String(prediction.homeScore) : "");
  const [away, setAway] = useState(prediction ? String(prediction.awayScore) : "");
  const [status, setStatus] = useState(""); // "", "saving", "saved", error text
  const [isError, setIsError] = useState(false);

  const kickoffTime = TIME_FMT.format(new Date(match.kickoff));
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
      setStatus(data.error || "Could not save.");
    }
  }

  return (
    <div className="match-row-wrap">
      <div className="match">
        <div className="team home">{match.homeTeam}</div>
        <div className="mid">
          {locked ? (
            <div className="score-inputs">
              <span>{prediction ? prediction.homeScore : "–"}</span>
              <span className="sep">:</span>
              <span>{prediction ? prediction.awayScore : "–"}</span>
            </div>
          ) : (
            <div className="score-inputs">
              <input type="number" min="0" max="30" value={home}
                onChange={(e) => setHome(e.target.value)} aria-label={`${match.homeTeam} score`} />
              <span className="sep">:</span>
              <input type="number" min="0" max="30" value={away}
                onChange={(e) => setAway(e.target.value)} aria-label={`${match.awayTeam} score`} />
            </div>
          )}
        </div>
        <div className="team away">{match.awayTeam}</div>
      </div>

      <div className="match-foot">
        <span className="meta">
          <span className="badge">Group {match.groupName}</span>{" "}
          {kickoffTime} ET
          {match.finished && match.homeScore != null && (
            <> · Final: <strong>{match.homeScore}–{match.awayScore}</strong></>
          )}
        </span>

        <span style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {match.finished && prediction && (
            <span className="badge points">+{prediction.points} pts</span>
          )}
          {locked && !match.finished && <span className="badge locked">Locked</span>}
          {!locked && (
            <>
              {status && status !== "saving" && status !== "saved" && (
                <span className="error" style={{ margin: 0 }}>{status}</span>
              )}
              {status === "saved" && <span className="success" style={{ margin: 0 }}>Saved ✓</span>}
              <button className="btn secondary" onClick={save} disabled={status === "saving"}>
                {status === "saving" ? "Saving…" : prediction ? "Update" : "Save"}
              </button>
            </>
          )}
        </span>
      </div>
    </div>
  );
}
