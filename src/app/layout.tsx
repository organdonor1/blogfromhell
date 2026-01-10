import "./globals.css";
import type { Metadata } from "next";
import { Toaster } from "../components/ui/toaster";

export const metadata: Metadata = {
  title: "Hell",
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
      </body>
    </html>
  );
}
