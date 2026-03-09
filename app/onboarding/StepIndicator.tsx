const STEPS = ["Welcome", "Setup", "Menu"] as const;

export default function StepIndicator({ step }: { step: 1 | 2 | 3 }) {
  const pct = Math.round((step / 3) * 100);

  return (
    <div style={{ marginBottom: "2.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
        {STEPS.map((label, i) => {
          const n = (i + 1) as 1 | 2 | 3;
          const active = n === step;
          const done = n < step;
          return (
            <span key={label} style={{
              fontSize: "0.7rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: active ? "#c8a96e" : done ? "#444" : "#2a2a2a",
              fontWeight: active ? 700 : 400,
            }}>
              {label}
            </span>
          );
        })}
      </div>

      <div style={{ height: "1px", background: "#1a1a1a", position: "relative", overflow: "hidden" }}>
        <div style={{
          position: "absolute", left: 0, top: 0,
          height: "100%", width: `${pct}%`,
          background: "#c8a96e",
        }} />
      </div>

      <p style={{ marginTop: "0.4rem", fontSize: "0.7rem", color: "#333", letterSpacing: "0.04em" }}>
        Step {step} of 3
      </p>
    </div>
  );
}
