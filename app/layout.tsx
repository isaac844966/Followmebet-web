import type React from "react";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/lib/contexts/ThemeContext";
import { ApiProvider } from "@/lib/contexts/ApiContext";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {


  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* PWA Meta Tags */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#00A86B" />
        <link rel="icon" href="/app-icon.png" />
        <link rel="apple-touch-icon" href="/app-icon.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <meta name="apple-mobile-web-app-title" content="Your App Name" />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <ApiProvider>
            <main className="min-h-screen">{children}</main>
            <Toaster position="top-center" />
          </ApiProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
