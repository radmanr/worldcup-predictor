import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { toFa } from "@/lib/format";
import LogoMark from "./components/LogoMark";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const user = await getCurrentUser();

  let stats = null;
  if (user) {
    const [players, predictions, myPoints] = await Promise.all([
      prisma.user.count(),
      prisma.prediction.count({ where: { userId: user.id } }),
      prisma.prediction.aggregate({ where: { userId: user.id }, _sum: { points: true } }),
    ]);
    stats = { players, predictions, points: myPoints._sum.points || 0 };
  }

  return (
    <>
      <div className="card hero">
        <LogoMark size="lg" />
        <h1>پیش‌بینی جام جهانی ۲۰۲۶</h1>
        <p className="muted" style={{ maxWidth: 560, margin: "0 auto 20px" }}>
          نتیجهٔ همهٔ بازی‌های مرحلهٔ گروهی جام جهانی ۲۰۲۶ را پیش‌بینی کنید. برای نتیجهٔ دقیق ۳ امتیاز،
          برای حدس درست برنده یا تساوی ۱ امتیاز بگیرید و در جدول امتیازات همکاران بالا بروید.
        </p>
        {user ? (
          <Link href="/games" className="btn">ثبت پیش‌بینی‌ها</Link>
        ) : (
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <Link href="/register" className="btn">ثبت‌نام</Link>
            <Link href="/login" className="btn secondary">ورود</Link>
          </div>
        )}
      </div>

      {user && stats && (
        <div className="card">
          <h2>خوش آمدید، {user.name}</h2>
          <div className="points-grid">
            <div className="box"><div className="big">{toFa(stats.points)}</div><div className="muted">امتیاز شما</div></div>
            <div className="box"><div className="big">{toFa(stats.predictions)}</div><div className="muted">پیش‌بینی ثبت‌شده</div></div>
            <div className="box"><div className="big">{toFa(stats.players)}</div><div className="muted">شرکت‌کننده</div></div>
          </div>
          <p className="muted">
            به بخش <Link href="/games">بازی‌ها</Link> بروید و نتایج را پیش از شروع هر مسابقه ثبت کنید،{" "}
            <Link href="/leaderboard">جدول امتیازات</Link> را ببینید یا <Link href="/rules">قوانین</Link> را بخوانید.
          </p>
        </div>
      )}

      {!user && (
        <div className="card">
          <h2>چطور کار می‌کند؟</h2>
          <p className="muted">
            با کد دعوتی که مدیر بازی به شما می‌دهد ثبت‌نام کنید، نتیجهٔ هر بازی را پیش از شروع آن
            پیش‌بینی کنید و بر اساس دقت حدس خود امتیاز بگیرید. پیش‌بینی هر بازی دقیقاً در زمان شروع
            قفل می‌شود، پس زودتر ثبت کنید. <Link href="/rules">قوانین کامل</Link> را ببینید.
          </p>
        </div>
      )}
    </>
  );
}
