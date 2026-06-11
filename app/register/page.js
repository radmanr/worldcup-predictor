"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "", code: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(k) {
    return (e) => setForm({ ...form, [k]: e.target.value });
  }

  async function submit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/register", {
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
      <h1>ساخت حساب کاربری</h1>
      <p className="muted">ثبت‌نام کنید تا پیش‌بینی جام جهانی ۲۰۲۶ را همراه همکارانتان آغاز کنید.</p>
      <form onSubmit={submit}>
        <div className="field">
          <label>نام</label>
          <input value={form.firstName} onChange={update("firstName")} placeholder="نام" />
        </div>
        <div className="field">
          <label>نام خانوادگی</label>
          <input value={form.lastName} onChange={update("lastName")} placeholder="نام خانوادگی" />
        </div>
        <div className="field">
          <label>ایمیل</label>
          <input type="email" dir="ltr" value={form.email} onChange={update("email")} placeholder="you@company.com" />
        </div>
        <div className="field">
          <label>رمز عبور</label>
          <input type="password" dir="ltr" value={form.password} onChange={update("password")} placeholder="حداقل ۶ کاراکتر" />
        </div>
        <div className="field">
          <label>کد دعوت</label>
          <input value={form.code} onChange={update("code")} placeholder="از مدیر بازی بپرسید" />
        </div>
        {error && <div className="error">{error}</div>}
        <button className="btn block" disabled={loading}>
          {loading ? "در حال ساخت حساب…" : "ثبت‌نام"}
        </button>
      </form>
      <p className="muted center" style={{ marginTop: 16 }}>
        قبلاً ثبت‌نام کرده‌اید؟ <Link href="/login">وارد شوید</Link>
      </p>
    </div>
  );
}
