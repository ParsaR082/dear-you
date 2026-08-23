import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "dear you — A little place made for you",
  description:
    "A private little place where one person can leave one message for another, every day.",
  applicationName: "dear you",
  authors: [{ name: "dear you" }],
  keywords: ["daily message", "private letters", "dear you"],
  robots: {
    index: false,
    follow: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0b10",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
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
