"use client";

import { useState } from "react";

// Shows /logo.png once it's uploaded; until then falls back to a turquoise "ف" badge.
export default function LogoMark({ size = "sm" }) {
  const [err, setErr] = useState(false);
  const imgClass = size === "lg" ? "hero-logo" : "logo";
  const fbClass = size === "lg" ? "hero-logo-fallback" : "logo-fallback";
  if (err) return <span className={fbClass} aria-hidden="true">ف</span>;
  return (
    <img
      src="/logo.png"
      alt="فیروزه"
      className={imgClass}
      onError={() => setErr(true)}
    />
  );
}
