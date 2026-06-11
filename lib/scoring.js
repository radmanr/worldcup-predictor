// Standard prediction scoring:
//   3 points  -> exact score correct
//   1 point   -> correct outcome (home win / draw / away win) but wrong score
//   0 points  -> wrong outcome
export function scorePrediction(pred, actualHome, actualAway) {
  if (actualHome == null || actualAway == null) return 0;
  if (pred.homeScore === actualHome && pred.awayScore === actualAway) return 3;
  const predOutcome = Math.sign(pred.homeScore - pred.awayScore);
  const actualOutcome = Math.sign(actualHome - actualAway);
  return predOutcome === actualOutcome ? 1 : 0;
}
