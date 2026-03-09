"use client";

import { useState } from "react";

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.75rem 1rem",
  background: "#0d0d0d",
  border: "1px solid #1e1e1e",
  color: "#f0ece4",
  fontFamily: "inherit",
  fontSize: "0.9rem",
  outline: "none",
  boxSizing: "border-box",
};

const btnStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.875rem",
  background: "#c8a96e",
  color: "#0a0a0a",
  border: "none",
  fontFamily: "inherit",
  fontWeight: 700,
  fontSize: "0.82rem",
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  cursor: "pointer",
  marginTop: "0.75rem",
};

export default function LoginForm() {
  const [email, setEmail]   = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("sending");

    const res = await fetch("/api/auth/magic-link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim().toLowerCase() }),
    });

    if (res.ok) {
      setStatus("sent");
      setMessage("Check your email — your sign-in link is on the way.");
    } else {
      setStatus("error");
      const data = await res.json().catch(() => ({}));
      setMessage(data.error ?? "Something went wrong. Please try again.");
    }
  }

  if (status === "sent") {
    return (
      <div style={{
        background: "#0d0d0d",
        border: "1px solid #1e1e1e",
        borderLeft: "3px solid #c8a96e",
        padding: "1.25rem 1.5rem",
      }}>
        <p style={{ color: "#f0ece4", fontWeight: 700, marginBottom: "0.35rem" }}>
          Link sent.
        </p>
        <p style={{ color: "#666", fontSize: "0.85rem", lineHeight: 1.6 }}>
          {message}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="your@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        disabled={status === "sending"}
        style={inputStyle}
      />

      {status === "error" && (
        <p style={{ color: "#884444", fontSize: "0.82rem", marginTop: "0.5rem" }}>
          {message}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        style={{ ...btnStyle, opacity: status === "sending" ? 0.6 : 1 }}
      >
        {status === "sending" ? "Sending…" : "Send Sign-In Link"}
      </button>
    </form>
  );
}
