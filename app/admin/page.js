import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatDateTime } from "@/lib/format";
import ResultRow from "./ResultRow";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (!user.isAdmin) {
    return (
      <div className="card">
        <h1>مدیریت</h1>
        <p className="error">این بخش فقط برای مدیر بازی است.</p>
      </div>
    );
  }

  const matches = await prisma.match.findMany({ orderBy: { kickoff: "asc" } });
  const now = Date.now();

  return (
    <div className="card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <h1 style={{ margin: 0 }}>🛠️ مدیریت — ثبت نتایج</h1>
        <Link href="/admin/participants" className="btn secondary">👥 مشاهدهٔ شرکت‌کنندگان</Link>
      </div>
      <p className="muted">
        نتیجهٔ نهایی هر بازی تمام‌شده را وارد و ذخیره کنید. امتیاز همهٔ شرکت‌کنندگان به‌صورت خودکار
        دوباره محاسبه می‌شود. برای اصلاح نتیجه می‌توانید دوباره ذخیره کنید یا آن را پاک کنید.
      </p>
      <div style={{ marginTop: 16 }}>
        {matches.map((m) => (
          <ResultRow
            key={m.id}
            match={{
              id: m.id,
              groupName: m.groupName,
              homeTeam: m.homeTeam,
              awayTeam: m.awayTeam,
              when: formatDateTime(m.kickoff) + " به وقت ایران",
              started: m.kickoff.getTime() <= now,
              homeScore: m.homeScore,
              awayScore: m.awayScore,
              finished: m.finished,
            }}
          />
        ))}
      </div>
    </div>
  );
}
