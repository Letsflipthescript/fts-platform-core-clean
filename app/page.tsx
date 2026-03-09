import { redirect } from "next/navigation";
import { getSession } from "@/lib/supabase/session";
import { Tier } from "@/lib/tier";
import { getToolsForTier, tierLabel, upgradeTarget, type DashboardTool } from "@/lib/dashboard/tools";

// ---------------------------------------------------------------------------
// Sub-components (all server-rendered, no client JS needed)
// ---------------------------------------------------------------------------

function Header({ firstName, tier }: { firstName: string | null; tier: Tier }) {
  return (
    <header style={{
      borderBottom: "1px solid #1a1a1a",
      padding: "1.125rem 2rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
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

      <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
        <span style={{
          fontSize: "0.7rem",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "#c8a96e",
          border: "1px solid #2a2010",
          background: "#110e00",
          padding: "0.3rem 0.75rem",
          fontWeight: 700,
        }}>
          {tierLabel(tier)} Plan
        </span>

        {firstName && (
          <span style={{ color: "#444", fontSize: "0.82rem" }}>{firstName}</span>
        )}

        <form action="/api/auth/sign-out" method="POST">
          <button type="submit" style={{
            background: "none",
            border: "none",
            color: "#333",
            fontSize: "0.82rem",
            fontFamily: "inherit",
            cursor: "pointer",
            padding: 0,
          }}>
            Sign out
          </button>
        </form>
      </div>
    </header>
  );
}

function WelcomeBlock({ firstName, tier }: { firstName: string | null; tier: Tier }) {
  const next = upgradeTarget(tier);
  const greeting = firstName ? `Welcome back, ${firstName}.` : "Welcome back.";

  return (
    <div style={{ marginBottom: "3rem" }}>
      <h1 style={{
        fontSize: "1.75rem",
        fontWeight: 700,
        color: "#f0ece4",
        letterSpacing: "-0.02em",
        marginBottom: "0.5rem",
      }}>
        {greeting}
      </h1>

      <p style={{ color: "#666", fontSize: "0.92rem", lineHeight: 1.7, maxWidth: "520px" }}>
        You&apos;re on the{" "}
        <strong style={{ color: "#c8a96e" }}>{tierLabel(tier)} plan</strong>.{" "}
        {tier === Tier.STARTER && "Start by generating an offer, building a deal page, or blasting a property to your buyers."}
        {tier === Tier.PRO && "Your full Pro toolkit is ready. Run your deals, capture buyers, and automate follow-up."}
        {tier === Tier.ELITE && "You have access to everything. The full FTS platform is yours."}
      </p>

      {next && (
        <p style={{ marginTop: "0.75rem", fontSize: "0.82rem", color: "#444" }}>
          Unlock more tools by upgrading to{" "}
          <strong style={{ color: "#888" }}>{tierLabel(next)}</strong>.{" "}
          <a href="/upgrade" style={{ color: "#c8a96e", textDecoration: "none" }}>
            View plans →
          </a>
        </p>
      )}
    </div>
  );
}

function UnlockedCard({ tool }: { tool: DashboardTool }) {
  return (
    <a
      href={tool.href}
      style={{
        display: "block",
        textDecoration: "none",
        background: "#0d0d0d",
        border: "1px solid #1e1e1e",
        borderLeft: "3px solid #c8a96e",
        padding: "1.25rem 1.5rem",
        cursor: "pointer",
      }}
    >
      <p style={{
        fontWeight: 700,
        fontSize: "0.92rem",
        color: "#f0ece4",
        marginBottom: "0.35rem",
        letterSpacing: "0.01em",
      }}>
        {tool.label}
      </p>
      <p style={{ color: "#555", fontSize: "0.8rem", lineHeight: 1.6 }}>
        {tool.description}
      </p>
      <p style={{
        marginTop: "0.875rem",
        fontSize: "0.72rem",
        letterSpacing: "0.07em",
        textTransform: "uppercase",
        color: "#c8a96e",
      }}>
        Open →
      </p>
    </a>
  );
}

function LockedCard({ tool }: { tool: DashboardTool }) {
  const reqLabel = tierLabel(tool.requiredTier);
  return (
    <div style={{
      background: "#080808",
      border: "1px solid #141414",
      borderLeft: "3px solid #1e1e1e",
      padding: "1.25rem 1.5rem",
      opacity: 0.6,
      position: "relative",
    }}>
      <span style={{
        position: "absolute",
        top: "1rem",
        right: "1rem",
        fontSize: "0.65rem",
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: "#555",
        border: "1px solid #222",
        padding: "0.2rem 0.5rem",
      }}>
        {reqLabel}
      </span>
      <p style={{ fontWeight: 700, fontSize: "0.92rem", color: "#555", marginBottom: "0.35rem" }}>
        {tool.label}
      </p>
      <p style={{ color: "#333", fontSize: "0.8rem", lineHeight: 1.6 }}>
        {tool.description}
      </p>
      <a href="/upgrade" style={{
        display: "inline-block",
        marginTop: "0.875rem",
        fontSize: "0.72rem",
        letterSpacing: "0.07em",
        textTransform: "uppercase",
        color: "#555",
        textDecoration: "none",
        borderBottom: "1px solid #2a2a2a",
        paddingBottom: "0.1rem",
      }}>
        Unlock with {reqLabel} →
      </a>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontSize: "0.7rem",
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      color: "#444",
      marginBottom: "1rem",
    }}>
      {children}
    </p>
  );
}

function CardGrid({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
      gap: "0.875rem",
      marginBottom: "2.5rem",
    }}>
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page — reads tier from Supabase session (no URL params)
// ---------------------------------------------------------------------------

export default async function DashboardPage() {
  const session = await getSession();

  // Middleware protects this route, but guard defensively here too
  if (!session) {
    redirect("/login");
  }

  const { firstName, tier } = session;
  const { unlocked, locked } = getToolsForTier(tier);

  return (
    <div style={{
      minHeight: "100vh",
      fontFamily: "Georgia, 'Times New Roman', serif",
      background: "#0a0a0a",
      color: "#f0ece4",
    }}>
      <Header firstName={firstName} tier={tier} />

      <div style={{
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "3rem 2rem 5rem",
      }}>
        <WelcomeBlock firstName={firstName} tier={tier} />

        <section style={{ marginBottom: "3rem" }}>
          <SectionLabel>✓ Your tools</SectionLabel>
          <CardGrid>
            {unlocked.map((tool) => (
              <UnlockedCard key={tool.id} tool={tool} />
            ))}
          </CardGrid>
        </section>

        {locked.length > 0 && (
          <section>
            <SectionLabel>Unlock with a higher plan</SectionLabel>
            <CardGrid>
              {locked.map((tool) => (
                <LockedCard key={tool.id} tool={tool} />
              ))}
            </CardGrid>

            <div style={{
              borderTop: "1px solid #111",
              paddingTop: "1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "1.5rem",
            }}>
              <p style={{ color: "#333", fontSize: "0.82rem" }}>
                Ready to unlock more of your toolkit?
              </p>
              <a href="/upgrade" style={{
                display: "inline-block",
                padding: "0.625rem 1.5rem",
                background: "#c8a96e",
                color: "#0a0a0a",
                fontWeight: 700,
                fontSize: "0.78rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                textDecoration: "none",
              }}>
                View Plans
              </a>
            </div>
          </section>
        )}
      </div>

      <footer style={{
        borderTop: "1px solid #111",
        padding: "1.5rem 2rem",
        textAlign: "center",
        fontSize: "0.7rem",
        color: "#2a2a2a",
      }}>
        {new Date().getFullYear()} Flip The Script. All rights reserved.
      </footer>
    </div>
  );
}
