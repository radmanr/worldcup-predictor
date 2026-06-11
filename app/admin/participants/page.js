import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { toFa, formatDate } from "@/lib/format";
import ApproveButton from "./ApproveButton";

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
    orderBy: [{ approved: "asc" }, { createdAt: "asc" }],
    select: {
      id: true, name: true, email: true, isAdmin: true, approved: true, createdAt: true,
      predictions: { select: { points: true } },
    },
  });

  const rows = users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    isAdmin: u.isAdmin,
    approved: u.approved,
    joined: u.createdAt,
    made: u.predictions.length,
    points: u.predictions.reduce((s, p) => s + p.points, 0),
  }));

  const pending = rows.filter((r) => !r.approved && !r.isAdmin).length;

  return (
    <div className="card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <h1 style={{ margin: 0 }}>👥 شرکت‌کنندگان</h1>
        <Link href="/admin" className="btn secondary">→ بازگشت به ثبت نتایج</Link>
      </div>
      <p className="muted">
        مجموعاً <strong>{toFa(rows.length)}</strong> نفر ثبت‌نام کرده‌اند
        {pending > 0 && <> · <strong style={{ color: "var(--gold)" }}>{toFa(pending)}</strong> نفر در انتظار تأیید</>}.
        تا زمانی که حساب یک نفر را تأیید نکنید، نمی‌تواند پیش‌بینی ثبت کند.
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
              <th style={{ textAlign: "center" }}>وضعیت</th>
              <th style={{ textAlign: "center" }}>پیش‌بینی‌ها</th>
              <th style={{ textAlign: "center" }}>امتیاز</th>
              <th style={{ textAlign: "center" }}>اقدام</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.id} className={!r.approved && !r.isAdmin ? "me-row" : ""}>
                <td>{toFa(i + 1)}</td>
                <td>
                  {r.name}
                  {r.isAdmin && <span className="badge" style={{ marginInlineStart: 6 }}>مدیر</span>}
                </td>
                <td dir="ltr" style={{ textAlign: "right" }}>{r.email}</td>
                <td>{formatDate(r.joined)}</td>
                <td style={{ textAlign: "center" }}>
                  {r.isAdmin || r.approved ? (
                    <span className="badge points">تأیید‌شده</span>
                  ) : (
                    <span className="badge locked">در انتظار</span>
                  )}
                </td>
                <td style={{ textAlign: "center" }}>{toFa(r.made)}</td>
                <td className="pts" style={{ textAlign: "center" }}>{toFa(r.points)}</td>
                <td style={{ textAlign: "center" }}>
                  {r.isAdmin ? (
                    <span className="muted">—</span>
                  ) : (
                    <ApproveButton userId={r.id} approved={r.approved} />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
