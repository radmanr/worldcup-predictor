import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { toFa } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function LeaderboardPage() {
  const user = await getCurrentUser();

  // Aggregate points + counts per user (only approved players / admins)
  const users = await prisma.user.findMany({
    where: { OR: [{ approved: true }, { isAdmin: true }] },
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
      <h1>🏆 جدول امتیازات</h1>
      <p className="muted">
        رتبه‌بندی بر اساس مجموع امتیاز و سپس تعداد نتایج دقیق. با ثبت نتایج بازی‌ها امتیازها
        به‌روزرسانی می‌شوند.
      </p>
      {rows.length === 0 ? (
        <p className="muted">هنوز شرکت‌کننده‌ای نیست. اولین نفری باشید که ثبت‌نام می‌کند!</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>شرکت‌کننده</th>
              <th style={{ textAlign: "center" }}>پیش‌بینی</th>
              <th style={{ textAlign: "center" }}>دقیق</th>
              <th style={{ textAlign: "left" }}>امتیاز</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.id} className={user && r.id === user.id ? "me-row" : ""}>
                <td className={`rank r${i + 1}`}>{toFa(i + 1)}</td>
                <td>{r.name}{user && r.id === user.id ? " (شما)" : ""}</td>
                <td style={{ textAlign: "center" }}>{toFa(r.made)}</td>
                <td style={{ textAlign: "center" }}>{toFa(r.exact)}</td>
                <td className="pts">{toFa(r.points)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
