import LoginForm from "./LoginForm";

export const metadata = {
  title: "Sign In — Flip The Script",
};

interface Props {
  searchParams: { onboarding?: string; error?: string; next?: string };
}

export default function LoginPage({ searchParams }: Props) {
  const fromOnboarding = searchParams.onboarding === "complete";
  const hasError       = searchParams.error === "auth_failed";

  return (
    <div style={{
      minHeight: "100vh",
      fontFamily: "Georgia, 'Times New Roman', serif",
      background: "#0a0a0a",
      color: "#f0ece4",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem",
    }}>
      <div style={{ width: "100%", maxWidth: "400px" }}>
        <p style={{
          fontSize: "0.8rem",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "#c8a96e",
          marginBottom: "1.5rem",
        }}>
          Flip The Script
        </p>

        {fromOnboarding ? (
          <>
            <h1 style={{
              fontSize: "1.75rem",
              fontWeight: 700,
              color: "#f0ece4",
              letterSpacing: "-0.02em",
              marginBottom: "0.5rem",
            }}>
              You&apos;re set up. Now sign in.
            </h1>
            <p style={{
              color: "#555",
              fontSize: "0.88rem",
              lineHeight: 1.6,
              marginBottom: "2rem",
            }}>
              Enter the email you used during onboarding and we&apos;ll send
              you a secure sign-in link. Click it to access your dashboard.
            </p>
          </>
        ) : (
          <>
            <h1 style={{
              fontSize: "1.75rem",
              fontWeight: 700,
              color: "#f0ece4",
              letterSpacing: "-0.02em",
              marginBottom: "0.5rem",
            }}>
              Sign in to your account
            </h1>
            <p style={{
              color: "#555",
              fontSize: "0.88rem",
              lineHeight: 1.6,
              marginBottom: "2rem",
            }}>
              Enter your email and we&apos;ll send you a secure sign-in link.
              No password required.
            </p>
          </>
        )}

        {hasError && (
          <div style={{
            background: "#0d0d0d",
            border: "1px solid #2a1a1a",
            borderLeft: "3px solid #884444",
            padding: "0.875rem 1.125rem",
            marginBottom: "1.5rem",
          }}>
            <p style={{ color: "#884444", fontSize: "0.85rem" }}>
              The sign-in link was invalid or expired. Please request a new one.
            </p>
          </div>
        )}

        <LoginForm />

        <p style={{
          marginTop: "2rem",
          fontSize: "0.78rem",
          color: "#2a2a2a",
          textAlign: "center",
        }}>
          Need access?{" "}
          <a
            href="mailto:support@flipthescript.io"
            style={{ color: "#555", textDecoration: "none" }}
          >
            Contact support
          </a>
        </p>
      </div>
    </div>
  );
}
