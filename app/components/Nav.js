import Link from "next/link";
import LogoutButton from "./LogoutButton";
import LogoMark from "./LogoMark";

export default function Nav({ user }) {
  return (
    <nav className="nav">
      <div className="nav-inner">
        <Link href="/" className="brand">
          <LogoMark size="sm" />
          <span className="brand-name">
            <b>فیروزه</b>
            <small>پیش‌بینی جام جهانی ۲۰۲۶</small>
          </span>
        </Link>
        <div className="nav-links">
          <Link href="/games">پیش‌بینی</Link>
          <Link href="/leaderboard">جدول امتیازات</Link>
          <Link href="/rules">قوانین</Link>
          {user?.isAdmin && <Link href="/admin">مدیریت</Link>}
          {user ? (
            <>
              <span className="nav-user">{user.name}</span>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link href="/login">ورود</Link>
              <Link href="/register">ثبت‌نام</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
