import { verifyOnboardingToken } from "@/lib/onboarding/tokenPayload";
import { Tier } from "@/lib/tier";
import InvalidToken from "@/app/onboarding/InvalidToken";
import StepIndicator from "@/app/onboarding/StepIndicator";
import SetupClient from "./SetupClient";

interface Props {
  searchParams: { token?: string };
}

// Tool counts per tier — used to show "what's included" without generic filler
const TOOL_COUNTS: Record<Tier, { count: number; label: string }> = {
  [Tier.STARTER]: { count: 3, label: "Offer Generator, Deal Page Builder, Buyer Blast" },
  [Tier.PRO]:     { count: 6, label: "All Starter tools + Cash Buyer Magnet, Deal Analyzer, Smart Follow-Ups" },
  [Tier.ELITE]:   { count: 9, label: "All Pro tools + Marketplace, Advanced Automations, Investor Suite" },
};

const CHECKLIST = [
  "Connect your GoHighLevel account to enable Buyer Blast",
  "Generate your first offer using the Offer Generator",
  "Build a deal page and share it with your buyers",
];

export default async function SetupPage({ searchParams }: Props) {
  const result = await verifyOnboardingToken(searchParams.token);
if (!result.ok) return <InvalidToken reason="invalid" />;

  const { payload } = result;
  const token = searchParams.token!;
  const tierLabel = payload.tier.charAt(0).toUpperCase() + payload.tier.slice(1);
  const { count, label } = TOOL_COUNTS[payload.tier];

  return (
    <>
      <StepIndicator step={2} />

      <p style={{
        fontSize: "0.75rem", letterSpacing: "0.12em",
        textTransform: "uppercase", color: "#c8a96e", marginBottom: "0.75rem",
      }}>
        Account Setup
      </p>

      <h1 style={{
        fontSize: "2rem", fontWeight: 700,
        letterSpacing: "-0.02em", color: "#f0ece4", marginBottom: "0.4rem",
      }}>
        Your plan at a glance
      </h1>
      <p style={{ color: "#555", fontSize: "0.88rem", marginBottom: "2rem" }}>
        You&apos;re set up on the{" "}
        <strong style={{ color: "#c8a96e" }}>{tierLabel} plan</strong>.
      </p>

      {/* What's included */}
      <div style={{
        background: "#0d0d0d", border: "1px solid #1a1a1a",
        padding: "1.5rem", marginBottom: "2rem",
      }}>
        <p style={{
          fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase",
          color: "#444", marginBottom: "1.25rem",
        }}>
          What&apos;s included
        </p>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
          <span style={{ color: "#666", fontSize: "0.88rem" }}>Tools available</span>
          <span style={{ color: "#f0ece4", fontWeight: 700 }}>{count}</span>
        </div>
        <div style={{ height: "1px", background: "#161616", margin: "0 0 1rem" }} />
        <p style={{ color: "#555", fontSize: "0.8rem", lineHeight: 1.6 }}>
          {label}
        </p>
      </div>

      {/* Checklist */}
      <div style={{ marginBottom: "3rem" }}>
        <p style={{
          fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase",
          color: "#444", marginBottom: "1rem",
        }}>
          First steps
        </p>
        {CHECKLIST.map((item, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "flex-start", gap: "0.875rem",
            padding: "0.875rem 0", borderBottom: "1px solid #111",
          }}>
            <span style={{
              flexShrink: 0, width: "20px", height: "20px",
              border: "1px solid #2a2a2a",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "0.62rem", color: "#444",
            }}>
              {i + 1}
            </span>
            <span style={{ color: "#777", fontSize: "0.88rem", lineHeight: 1.5 }}>{item}</span>
          </div>
        ))}
      </div>

      <SetupClient token={token} />
    </>
  );
}
