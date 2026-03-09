import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Flip The Script",
  description: "FTS Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
