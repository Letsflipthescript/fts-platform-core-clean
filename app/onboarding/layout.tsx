import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Onboarding — Flip The Script",
};

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{
      minHeight: "100vh",
      fontFamily: "Georgia, 'Times New Roman', serif",
      background: "#0a0a0a",
      color: "#f0ece4",
    }}>
      <header style={{
        borderBottom: "1px solid #1a1a1a",
        padding: "1.25rem 2rem",
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
      }}>
        <span style={{
          fontSize: "1rem",
          letterSpacing: "0.1em",
          fontWeight: 700,
          color: "#c8a96e",
          textTransform: "uppercase",
        }}>
          Flip The Script
        </span>
        <span style={{ color: "#2a2a2a" }}>|</span>
        <span style={{ color: "#444", fontSize: "0.82rem", letterSpacing: "0.04em" }}>
          Onboarding
        </span>
      </header>

      <main style={{
        maxWidth: "640px",
        margin: "0 auto",
        padding: "3rem 2rem 5rem",
      }}>
        {children}
      </main>

      <footer style={{
        textAlign: "center",
        padding: "2rem",
        color: "#2a2a2a",
        fontSize: "0.72rem",
        borderTop: "1px solid #111",
      }}>
        {new Date().getFullYear()} Flip The Script. All rights reserved.
      </footer>
    </div>
  );
}
