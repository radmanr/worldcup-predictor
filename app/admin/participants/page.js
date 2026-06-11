import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { toFa, formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function ParticipantsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (!user.isAdmin) {
    return (
      <div className="card">
        <h1>شرکت‌کنندگان</h1>
        <p className="error">این بخش فقط برای مدیر بازی است.</p>
      </div>
    );
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "asc" },
    select: {
      id: true, name: true, email: true, isAdmin: true, createdAt: true,
      predictions: { select: { points: true } },
    },
  });

  const rows = users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    isAdmin: u.isAdmin,
    joined: u.createdAt,
    made: u.predictions.length,
    points: u.predictions.reduce((s, p) => s + p.points, 0),
  }));

  return (
    <div className="card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <h1 style={{ margin: 0 }}>👥 شرکت‌کنندگان</h1>
        <Link href="/admin" className="btn secondary">→ بازگشت به ثبت نتایج</Link>
      </div>
      <p className="muted">
        مجموعاً <strong>{toFa(rows.length)}</strong> نفر ثبت‌نام کرده‌اند. این فهرست فقط برای شما (مدیر بازی) قابل مشاهده است.
      </p>

      {rows.length === 0 ? (
        <p className="muted">هنوز کسی ثبت‌نام نکرده است.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>نام</th>
              <th>ایمیل</th>
              <th>تاریخ عضویت</th>
              <th style={{ textAlign: "center" }}>پیش‌بینی‌ها</th>
              <th style={{ textAlign: "left" }}>امتیاز</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.id}>
                <td>{toFa(i + 1)}</td>
                <td>
                  {r.name}
                  {r.isAdmin && <span className="badge" style={{ marginInlineStart: 6 }}>مدیر</span>}
                </td>
                <td dir="ltr" style={{ textAlign: "right" }}>{r.email}</td>
                <td>{formatDate(r.joined)}</td>
                <td style={{ textAlign: "center" }}>{toFa(r.made)}</td>
                <td className="pts">{toFa(r.points)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
