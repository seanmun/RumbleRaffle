import type { Metadata } from "next";
import { Bevan } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import { ToastProvider } from "@/components/Toast";
import { WebVitals } from "./web-vitals";

const bevan = Bevan({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bevan',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://rumbleraffle.com'),
  title: {
    default: "Rumble Raffle - Wrestling Raffle League Manager for Royal Rumble Watch Parties",
    template: "%s | Rumble Raffle"
  },
  description: "Create and manage wrestling-themed raffle leagues with friends. Perfect for Royal Rumble watch parties and wrestling events. Free wrestling fantasy league platform with live tracking, random number drawing, and real-time leaderboards.",
  keywords: [
    "wrestling raffle",
    "royal rumble raffle",
    "wrestling fantasy league",
    "royal rumble watch party",
    "wrestling pool",
    "rumble raffle",
    "wwe raffle",
    "wrestling game",
    "royal rumble game",
    "wrestling watch party",
    "fantasy wrestling",
    "wwe pool",
    "royal rumble pool",
    "wrestling event manager",
    "live wrestling tracker"
  ],
  authors: [{ name: "Rumble Raffle", url: "https://rumbleraffle.com" }],
  creator: "Rumble Raffle",
  publisher: "Rumble Raffle",
  applicationName: "Rumble Raffle",
  category: "Entertainment",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://rumbleraffle.com",
    siteName: "Rumble Raffle",
    title: "Rumble Raffle - Wrestling Raffle League Manager",
    description: "Create and manage wrestling-themed raffle leagues with friends. Perfect for Royal Rumble watch parties and wrestling events.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Rumble Raffle - Wrestling League Manager",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rumble Raffle - Wrestling Raffle League Manager",
    description: "Create wrestling raffle leagues for Royal Rumble watch parties. Free fantasy wrestling platform with live tracking.",
    images: ["/twitter-image.png"],
    creator: "@RumbleRaffle",
  },
  verification: {
    google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
    // yahoo: "your-yahoo-verification-code",
  },
  alternates: {
    canonical: "https://rumbleraffle.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${bevan.variable} antialiased bg-slate-950 text-white min-h-screen flex flex-col font-sans`}>
        <WebVitals />
        <ToastProvider>
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}