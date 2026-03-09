import AuthForm from "./AuthForm";

export const metadata = {
  title: "Sign In — Flip The Script",
};

export default function AuthPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        color: "#f0ece4",
        fontFamily: "Georgia, 'Times New Roman', serif",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      <div style={{ width: "100%", maxWidth: "400px" }}>
        <p
          style={{
            fontSize: "0.75rem",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#c8a96e",
            marginBottom: "1.75rem",
          }}
        >
          Flip The Script
        </p>

        <AuthForm />
      </div>
    </div>
  );
}
