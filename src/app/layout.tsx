import type { Metadata } from "next";
import { Bevan } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";

const bevan = Bevan({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bevan',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Rumble Raffle - Wrestling League Manager",
  description: "Create and manage wrestling-themed raffle leagues with friends. Perfect for Royal Rumble watch parties and wrestling events.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${bevan.variable} antialiased bg-slate-950 text-white min-h-screen flex flex-col font-sans`}>
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}