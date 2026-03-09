"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function SetupClient({ token }: { token: string }) {
  const router = useRouter();
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    fetch("/api/onboarding/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token,
        event: "onboarding_setup_viewed",
        meta: { path: "/onboarding/setup", ts: new Date().toISOString() },
      }),
    }).catch(() => {});
  }, [token]);

  return (
    <button
      onClick={() => router.push(`/onboarding/menu?token=${encodeURIComponent(token)}`)}
      style={btnStyle}
    >
      Continue →
    </button>
  );
}

const btnStyle: React.CSSProperties = {
  padding: "0.875rem 2.5rem",
  background: "#c8a96e",
  color: "#0a0a0a",
  border: "none",
  fontFamily: "inherit",
  fontWeight: 700,
  fontSize: "0.82rem",
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  cursor: "pointer",
};
