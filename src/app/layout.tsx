import "./globals.css";
import type { Metadata } from "next";
import { Suspense } from "react";
import { Toaster } from "../components/ui/toaster";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: "From Hell",
  description: "A blog featuring fiction stories and news articles.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
