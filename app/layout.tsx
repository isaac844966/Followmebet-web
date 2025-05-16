import type React from "react"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/lib/contexts/ThemeContext"
import { ApiProvider } from "@/lib/contexts/ApiContext"
import { Toaster } from "react-hot-toast"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <ApiProvider>
            <main className="min-h-screen">{children}</main>
            <Toaster position="top-center" />
          </ApiProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}


