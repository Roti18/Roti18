import type { Metadata } from "next";
import "./globals.css";
import { profile } from "@/data";

export const metadata: Metadata = {
  title: `${profile.name.full} — ${profile.enthusiast}`,
  description: profile.headline.prefix + " " + profile.headline.suffix,
  keywords: [
    profile.enthusiast,
    "Web Developer",
    "System Security",
    "TypeScript",
    "React",
    "Portfolio",
  ],
  authors: [{ name: profile.name.full }],
  openGraph: {
    title: `${profile.name.full} — ${profile.enthusiast}`,
    description: profile.headline.prefix + " " + profile.headline.suffix,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
