export const metadata = { title: "Rules — Office World Cup Predictor" };

export default function RulesPage() {
  return (
    <div className="card rules">
      <h1>📋 Game Rules</h1>
      <p className="muted">
        A simple, friendly office prediction game for the 2026 FIFA World Cup, based on the most
        popular formats (Kicktipp / Superbru style).
      </p>

      <h3>How to play</h3>
      <p>
        Register an account, then predict the exact final score of each group-stage match. You can
        change your prediction as many times as you like up until kickoff. Once a match starts, your
        prediction for that match is locked.
      </p>

      <h3>Scoring</h3>
      <div className="points-grid">
        <div className="box"><div className="big">3</div><div className="muted">Exact score<br />(e.g. you said 2–1, it finished 2–1)</div></div>
        <div className="box"><div className="big">1</div><div className="muted">Correct outcome<br />(right winner or draw, wrong score)</div></div>
        <div className="box"><div className="big">0</div><div className="muted">Wrong outcome</div></div>
      </div>
      <p>
        "Outcome" means home win, draw, or away win. So if you predict <strong>2–0</strong> and the
        match ends <strong>3–1</strong>, you get <strong>1 point</strong> (you correctly picked the
        home team to win). Predict <strong>1–1</strong> and it ends <strong>1–1</strong> and you bag
        the full <strong>3 points</strong>.
      </p>

      <h3>Deadlines</h3>
      <p>
        Each match locks at its kickoff time. Late predictions can't be entered, so get yours in
        early — ideally well before the first whistle. All kickoff times are displayed in US Eastern
        Time (the host time zone).
      </p>

      <h3>The leaderboard</h3>
      <p>
        Everyone's points are totalled on the <a href="/leaderboard">leaderboard</a>. Ties are broken
        by the number of exact-score predictions, and then alphabetically. The leaderboard updates
        automatically as the organiser enters official results.
      </p>

      <h3>Results &amp; fairness</h3>
      <p>
        Official final scores are entered by the game organiser after each match. Points are then
        calculated automatically and identically for everyone — no manual fiddling. If a result is
        ever corrected, all affected points are recalculated.
      </p>

      <h3>Spirit of the game</h3>
      <p>
        It's for fun and office bragging rights. Predict every game to maximise your points, check
        back during the tournament, and may the best forecaster win. Good luck! ⚽
      </p>
    </div>
  );
}
