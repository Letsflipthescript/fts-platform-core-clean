import { verifyOnboardingToken } from "@/lib/onboarding/tokenPayload";
import { getFeaturesForTier } from "@/lib/onboarding/features";
import InvalidToken from "@/app/onboarding/InvalidToken";
import StepIndicator from "@/app/onboarding/StepIndicator";
import MenuClient from "./MenuClient";

interface Props {
  searchParams: { token?: string };
}

export default async function MenuPage({ searchParams }: Props) {
  const result = await verifyOnboardingToken(searchParams.token);
  if (!result.ok) return <InvalidToken reason={result.reason} />;

  const { payload } = result;
  const token = searchParams.token!;
  const email = payload.email ?? null;
  const { unlocked, locked } = getFeaturesForTier(payload.tier);
  const tierLabel = payload.tier.charAt(0).toUpperCase() + payload.tier.slice(1);

  return (
    <>
      <StepIndicator step={3} />

      <p style={{
        fontSize: "0.75rem", letterSpacing: "0.12em",
        textTransform: "uppercase", color: "#c8a96e", marginBottom: "0.75rem",
      }}>
        Your Features
      </p>

      <h1 style={{
        fontSize: "2rem", fontWeight: 700,
        letterSpacing: "-0.02em", color: "#f0ece4", marginBottom: "0.4rem",
      }}>
        Everything on your plan
      </h1>
      <p style={{ color: "#555", fontSize: "0.88rem", marginBottom: "2rem" }}>
        Active features for your{" "}
        <strong style={{ color: "#c8a96e" }}>{tierLabel}</strong> account.
      </p>

      {/* Unlocked */}
      <section style={{ marginBottom: "2.5rem" }}>
        <p style={{
          fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase",
          color: "#555", marginBottom: "1rem",
        }}>
          ✓ Unlocked for you
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
          {unlocked.map((f) => (
            <div key={f.id} style={{
              background: "#0d0d0d",
              border: "1px solid #1a1a1a",
              borderLeft: "3px solid #c8a96e",
              padding: "0.875rem 1.125rem",
            }}>
              <p style={{ fontWeight: 700, fontSize: "0.88rem", color: "#f0ece4", marginBottom: "0.2rem" }}>
                {f.label}
              </p>
              <p style={{ color: "#555", fontSize: "0.8rem", lineHeight: 1.5 }}>
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Locked */}
      {locked.length > 0 && (
        <section style={{ marginBottom: "3rem" }}>
          <p style={{
            fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase",
            color: "#2a2a2a", marginBottom: "1rem",
          }}>
            ○ Available in higher tiers
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
            {locked.map((f) => (
              <div key={f.id} style={{
                background: "#080808",
                border: "1px solid #141414",
                borderLeft: "3px solid #1e1e1e",
                padding: "0.875rem 1.125rem",
                opacity: 0.55,
              }}>
                <p style={{ fontWeight: 700, fontSize: "0.88rem", color: "#666", marginBottom: "0.2rem" }}>
                  {f.label}
                </p>
                <p style={{ color: "#3a3a3a", fontSize: "0.8rem", lineHeight: 1.5 }}>
                  {f.description}
                </p>
              </div>
            ))}
          </div>
          <p style={{
            marginTop: "0.875rem", fontSize: "0.78rem",
            color: "#333", fontStyle: "italic", lineHeight: 1.6,
          }}>
            Upgrade your plan to unlock these features. Contact your account manager to learn more.
          </p>
        </section>
      )}

      <MenuClient token={token} email={email} />
    </>
  );
}
