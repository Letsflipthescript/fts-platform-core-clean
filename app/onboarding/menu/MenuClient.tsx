"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  token: string;
  email: string | null;
}

export default function MenuClient({ token, email }: Props) {
  const router = useRouter();
  const fired = useRef(false);
  const [finishing, setFinishing] = useState(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    fetch("/api/onboarding/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token,
        event: "onboarding_menu_viewed",
        meta: { path: "/onboarding/menu", ts: new Date().toISOString() },
      }),
    }).catch(() => {});
  }, [token]);

  async function handleFinish() {
    setFinishing(true);

    // 1. Fire the completion event (non-fatal)
    try {
      await fetch("/api/onboarding/event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          event: "onboarding_completed",
          meta: { path: "/onboarding/menu", ts: new Date().toISOString() },
        }),
      });
    } catch { /* non-fatal */ }

    // 2. Persist profile + tier from the onboarding token into Supabase
    try {
      await fetch("/api/auth/complete-onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, email }),
      });
    } catch { /* non-fatal — profile can be created on first login */ }

    // 3. Send to login — magic link ties their email to the session
    router.push("/login?onboarding=complete");
  }

  return (
    <button
      onClick={handleFinish}
      disabled={finishing}
      style={{
        padding: "0.875rem 2.5rem",
        background: finishing ? "#3a2a10" : "#c8a96e",
        color: finishing ? "#666" : "#0a0a0a",
        border: "none",
        fontFamily: "inherit",
        fontWeight: 700,
        fontSize: "0.82rem",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        cursor: finishing ? "wait" : "pointer",
        transition: "background 0.2s, color 0.2s",
      }}
    >
      {finishing ? "Finishing…" : "Finish Setup ✓"}
    </button>
  );
}
