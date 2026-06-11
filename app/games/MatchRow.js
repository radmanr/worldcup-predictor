"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { teamLabel } from "@/lib/teams";
import { toFa, formatTime, groupLabel } from "@/lib/format";

export default function MatchRow({ match, prediction }) {
  const router = useRouter();
  const [home, setHome] = useState(prediction ? String(prediction.homeScore) : "");
  const [away, setAway] = useState(prediction ? String(prediction.awayScore) : "");
  // The currently saved prediction (authoritative), updated immediately on save.
  const [saved, setSaved] = useState(
    prediction ? { h: prediction.homeScore, a: prediction.awayScore } : null
  );
  const [status, setStatus] = useState(""); // "", "saving", "saved", or error text
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
      setSaved({ h: parseInt(home, 10), a: parseInt(away, 10) });
      setStatus("saved");
      router.refresh(); // keep the server-rendered counter / state in sync
      setTimeout(() => setStatus(""), 2000);
    } else {
      const data = await res.json().catch(() => ({}));
      setIsError(true);
      setStatus(data.error || "ذخیره نشد.");
    }
  }

  return (
    <div className={"match-row-wrap" + (saved ? " has-pick" : "")}>
      <div className="match">
        <div className="team home">{teamLabel(match.homeTeam)}</div>
        <div className="mid">
          {locked ? (
            <div className="score-inputs">
              <span>{saved ? toFa(saved.h) : "–"}</span>
              <span className="sep">:</span>
              <span>{saved ? toFa(saved.a) : "–"}</span>
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
          {saved ? (
            <span className="badge mypick">پیش‌بینی شما: {toFa(saved.h)}–{toFa(saved.a)}</span>
          ) : (
            !locked && <span className="badge">ثبت‌نشده</span>
          )}
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
                {status === "saving" ? "در حال ذخیره…" : saved ? "ویرایش پیش‌بینی" : "ثبت پیش‌بینی"}
              </button>
            </>
          )}
        </span>
      </div>
    </div>
  );
}
