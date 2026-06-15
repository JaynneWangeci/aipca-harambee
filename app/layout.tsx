import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import PageTransition from "@/components/PageTransition";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AIPCA Cathedral Bahati — Development Fund Harambee",
  description:
    "Join the AIPCA Cathedral Bahati family in giving toward our development projects. Give securely via M-Pesa or bank. Building together, for generations to come.",
  keywords: ["AIPCA", "Bahati Cathedral", "Harambee", "Development Fund", "Nairobi", "Church donation"],
  openGraph: {
    title: "AIPCA Cathedral Bahati — Development Fund",
    description: "Building together, for generations to come. Support our cathedral development projects.",
    siteName: "AIPCA Bahati Cathedral",
    type: "website",
    locale: "en_KE",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`h-full antialiased scroll-smooth ${inter.variable}`}
      data-scroll-behavior="smooth"
    >
      <body className="min-h-screen flex flex-col bg-cream text-ink">
        <Header />
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  );
}
