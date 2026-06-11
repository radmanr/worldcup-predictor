import Link from "next/link";
import LogoutButton from "./LogoutButton";

export default function Nav({ user }) {
  return (
    <nav className="nav">
      <div className="nav-inner">
        <Link href="/" className="brand">
          <span className="ball">⚽</span> Office World Cup 2026
        </Link>
        <div className="nav-links">
          <Link href="/games">Games</Link>
          <Link href="/leaderboard">Leaderboard</Link>
          <Link href="/rules">Rules</Link>
          {user?.isAdmin && <Link href="/admin">Admin</Link>}
          {user ? (
            <>
              <span className="nav-user">{user.name}</span>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link href="/login">Log in</Link>
              <Link href="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
