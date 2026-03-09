"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

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
  marginBottom: "0.75rem",
};

const btnPrimary: React.CSSProperties = {
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
  marginTop: "0.25rem",
};

type Mode = "signin" | "signup";

export default function AuthForm() {
  const router   = useRouter();
  const [mode, setMode]       = useState<Mode>("signin");
  const [email, setEmail]     = useState("");
  const [password, setPass]   = useState("");
  const [status, setStatus]   = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  function switchMode(m: Mode) {
    setMode(m);
    setMessage("");
    setStatus("idle");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setStatus("error");
        setMessage(error.message);
        return;
      }
      // Supabase may require email confirmation depending on project settings.
      // If "Confirm email" is OFF in Supabase Auth settings, session is set
      // immediately and the user lands on the dashboard.
      // If "Confirm email" is ON, show a confirmation message instead.
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push("/");
        router.refresh();
      } else {
        setStatus("success");
        setMessage("Check your email to confirm your account, then sign in.");
      }
      return;
    }

    // Sign in
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setStatus("error");
      setMessage(error.message);
      return;
    }
    router.push("/");
    router.refresh();
  }

  const isLoading = status === "loading";

  return (
    <>
      {/* Mode tabs */}
      <div
        style={{
          display: "flex",
          borderBottom: "1px solid #1a1a1a",
          marginBottom: "1.75rem",
          gap: "0",
        }}
      >
        {(["signin", "signup"] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => switchMode(m)}
            style={{
              flex: 1,
              padding: "0.6rem",
              background: "none",
              border: "none",
              borderBottom: mode === m ? "2px solid #c8a96e" : "2px solid transparent",
              color: mode === m ? "#c8a96e" : "#444",
              fontFamily: "inherit",
              fontSize: "0.78rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              cursor: "pointer",
              fontWeight: mode === m ? 700 : 400,
              marginBottom: "-1px",
            }}
          >
            {m === "signin" ? "Sign In" : "Create Account"}
          </button>
        ))}
      </div>

      <h1
        style={{
          fontSize: "1.5rem",
          fontWeight: 700,
          color: "#f0ece4",
          letterSpacing: "-0.02em",
          marginBottom: "1.5rem",
          lineHeight: 1.2,
        }}
      >
        {mode === "signin" ? "Welcome back." : "Get started."}
      </h1>

      {/* Success state */}
      {status === "success" ? (
        <div
          style={{
            background: "#0d0d0d",
            border: "1px solid #1e1e1e",
            borderLeft: "3px solid #c8a96e",
            padding: "1.25rem 1.5rem",
          }}
        >
          <p style={{ color: "#f0ece4", fontWeight: 700, marginBottom: "0.35rem" }}>
            Almost there.
          </p>
          <p style={{ color: "#666", fontSize: "0.85rem", lineHeight: 1.6 }}>
            {message}
          </p>
          <button
            onClick={() => switchMode("signin")}
            style={{
              marginTop: "1rem",
              background: "none",
              border: "none",
              color: "#c8a96e",
              fontFamily: "inherit",
              fontSize: "0.8rem",
              cursor: "pointer",
              padding: 0,
              textDecoration: "underline",
            }}
          >
            Back to sign in
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
            autoComplete="email"
            style={inputStyle}
          />

          <input
            type="password"
            placeholder={mode === "signup" ? "Create a password" : "Password"}
            value={password}
            onChange={(e) => setPass(e.target.value)}
            required
            disabled={isLoading}
            minLength={mode === "signup" ? 8 : undefined}
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
            style={{ ...inputStyle, marginBottom: 0 }}
          />
          {mode === "signup" && (
            <p style={{ color: "#333", fontSize: "0.72rem", marginTop: "0.4rem" }}>
              Minimum 8 characters.
            </p>
          )}

          {status === "error" && (
            <p
              style={{
                color: "#884444",
                fontSize: "0.82rem",
                marginTop: "0.75rem",
              }}
            >
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            style={{ ...btnPrimary, opacity: isLoading ? 0.6 : 1 }}
          >
            {isLoading
              ? mode === "signin" ? "Signing in\u2026" : "Creating account\u2026"
              : mode === "signin" ? "Sign In" : "Create Account"}
          </button>
        </form>
      )}
    </>
  );
}
