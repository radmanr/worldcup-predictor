"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ApproveButton({ userId, approved }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function toggle() {
    setBusy(true);
    const res = await fetch("/api/admin/approve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, approved: !approved }),
    });
    setBusy(false);
    if (res.ok) router.refresh();
  }

  return (
    <button
      className={approved ? "btn secondary" : "btn"}
      onClick={toggle}
      disabled={busy}
      style={{ padding: "6px 12px", fontSize: 13 }}
    >
      {busy ? "…" : approved ? "لغو تأیید" : "تأیید"}
    </button>
  );
}
