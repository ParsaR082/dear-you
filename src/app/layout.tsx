import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "dear you — A little place made for you",
  description:
    "A private collection of daily messages, gentle thoughts, and little reminders.",
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