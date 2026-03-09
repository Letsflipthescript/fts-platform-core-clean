type Reason = "missing" | "invalid" | "expired";

const MESSAGES: Record<Reason, { headline: string; body: string }> = {
  missing: {
    headline: "No access link found",
    body: "This page requires a personalized access link. Please use the link from your welcome email.",
  },
  invalid: {
    headline: "Invalid access link",
    body: "This link could not be verified. It may have been modified or is no longer valid.",
  },
  expired: {
    headline: "This link has expired",
    body: "For your security, onboarding links expire after 24 hours. Please request a new one.",
  },
};

export default function InvalidToken({ reason }: { reason: Reason }) {
  const { headline, body } = MESSAGES[reason];
  const support = process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "support@flipthescript.io";

  return (
    <div style={{ textAlign: "center", paddingTop: "3rem" }}>
      <div style={{
        width: "52px", height: "52px",
        borderRadius: "50%",
        border: "1px solid #2a1a0a",
        background: "#130a00",
        display: "flex", alignItems: "center", justifyContent: "center",
        margin: "0 auto 2rem",
        fontSize: "1.4rem",
      }}>
        ⚠
      </div>

      <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#f0ece4", marginBottom: "1rem" }}>
        {headline}
      </h1>

      <p style={{
        color: "#666", lineHeight: 1.75, maxWidth: "400px",
        margin: "0 auto 2.5rem", fontSize: "0.9rem",
      }}>
        {body}
      </p>

      <a
        href={`mailto:${support}?subject=Request new onboarding link`}
        style={{
          display: "inline-block",
          padding: "0.75rem 2rem",
          background: "#c8a96e",
          color: "#0a0a0a",
          fontWeight: 700,
          fontSize: "0.82rem",
          letterSpacing: "0.07em",
          textDecoration: "none",
          textTransform: "uppercase",
        }}
      >
        Request a New Link
      </a>
    </div>
  );
}
