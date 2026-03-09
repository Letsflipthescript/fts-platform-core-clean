import { verifyOnboardingToken } from "@/lib/onboarding/tokenPayload";
import InvalidToken from "@/app/onboarding/InvalidToken";
import StepIndicator from "@/app/onboarding/StepIndicator";
import WelcomeClient from "./WelcomeClient";

interface Props {
  searchParams: { token?: string };
}

export default async function WelcomePage({ searchParams }: Props) {
  const result = await verifyOnboardingToken(searchParams.token);
  if (!result.ok) return <InvalidToken reason={result.reason} />;

  const { payload } = result;
  const token = searchParams.token!;

  return (
    <>
      <StepIndicator step={1} />

      <p style={{
        fontSize: "0.75rem", letterSpacing: "0.12em",
        textTransform: "uppercase", color: "#c8a96e", marginBottom: "0.75rem",
      }}>
        Welcome to Flip The Script
      </p>

      <h1 style={{
        fontSize: "2.2rem", fontWeight: 700,
        letterSpacing: "-0.02em", lineHeight: 1.15,
        color: "#f0ece4", marginBottom: "0.4rem",
      }}>
        {payload.firstName ? `Welcome, ${payload.firstName}` : "Welcome"}
      </h1>

      {payload.companyName && (
        <p style={{ color: "#555", fontSize: "1rem", marginBottom: "0.25rem" }}>
          {payload.companyName}
        </p>
      )}

      <div style={{
        display: "inline-flex", alignItems: "center", gap: "0.5rem",
        background: "#0f0f0f", border: "1px solid #1e1e1e",
        padding: "0.4rem 0.875rem", margin: "1.5rem 0 2.5rem",
        fontSize: "0.75rem",
      }}>
        <span style={{ color: "#444", letterSpacing: "0.06em", textTransform: "uppercase" }}>Tier</span>
        <span style={{ color: "#c8a96e", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
          {payload.tier}
        </span>
      </div>

      <p style={{
        color: "#666", lineHeight: 1.8, fontSize: "0.9rem",
        maxWidth: "500px", marginBottom: "3rem",
      }}>
        This short onboarding shows you what&apos;s available on your plan,
        walks through your first configuration, and gets you to your first
        win — fast.
      </p>

      <WelcomeClient token={token} />
    </>
  );
}
