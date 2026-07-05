import type { Metadata } from "next";
import "./globals.css";

import { ASMRStaticBackground } from "@/components/ui/asmr-background";
import { LoadingScreen } from "@/app/components/portfolio/LoadingScreen";

export const metadata: Metadata = {
  title: "Portfolio Khadafi",
  description:
    "Muh. Khadafi Kasim - AI & Automation Engineer and fullstack developer. "
    + "Ask my AI anything about my work.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/favicon-180x180.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-accent="green" className="h-full">
      <head>
        {/* Warm the connections to asset hosts so images/3D start downloading
            immediately instead of paying DNS+TLS per resource. */}
        <link rel="preconnect" href="https://fenaqrrsfbmgzjiirzsz.supabase.co" />
        <link rel="dns-prefetch" href="https://fenaqrrsfbmgzjiirzsz.supabase.co" />
        <link rel="preconnect" href="https://prod.spline.design" />
        <link rel="dns-prefetch" href="https://prod.spline.design" />
        <link rel="preconnect" href="https://flagcdn.com" />
        <link rel="preconnect" href="https://cdn.simpleicons.org" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Hanken+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <LoadingScreen />
        <ASMRStaticBackground
          particleCount={600}
          className="fixed inset-0 -z-10"
        />
        {children}
      </body>
    </html>
  );
}
