"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(k) {
    return (e) => setForm({ ...form, [k]: e.target.value });
  }

  async function submit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setLoading(false);
    if (res.ok) {
      router.push("/games");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "خطایی رخ داد.");
    }
  }

  return (
    <div className="card form-narrow">
      <h1>ورود</h1>
      <p className="muted">خوش آمدید — برای ثبت و ویرایش پیش‌بینی‌ها وارد شوید.</p>
      <form onSubmit={submit}>
        <div className="field">
          <label>ایمیل</label>
          <input type="email" dir="ltr" value={form.email} onChange={update("email")} placeholder="you@company.com" />
        </div>
        <div className="field">
          <label>رمز عبور</label>
          <input type="password" dir="ltr" value={form.password} onChange={update("password")} />
        </div>
        {error && <div className="error">{error}</div>}
        <button className="btn block" disabled={loading}>
          {loading ? "در حال ورود…" : "ورود"}
        </button>
      </form>
      <p className="muted center" style={{ marginTop: 16 }}>
        حساب ندارید؟ <Link href="/register">ثبت‌نام کنید</Link>
      </p>
    </div>
  );
}
