// src/app/layout.tsx
import type { Metadata } from "next"
import { Poppins, Inter } from "next/font/google"
import "./globals.css"
import { SessionProvider } from "next-auth/react"
import { auth } from "@/lib/auth"

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-d",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-b",
  display: "swap",
})

export const metadata: Metadata = {
  title: "WeatherWise — Advanced Weather Dashboard",
  description: "Real-time weather, forecasts, air quality, and more.",
  keywords: ["weather", "forecast", "AQI", "air quality", "UV index"],
  authors: [{ name: "WeatherWise" }],
  manifest: "/manifest.json",
  openGraph: {
    title: "WeatherWise",
    description: "Advanced weather dashboard with real-time data",
    type: "website",
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${poppins.variable} ${inter.variable} antialiased`}
        style={{ background: "#060d1f", color: "#e2e8f0" }}
      >
        <SessionProvider session={session}>{children}</SessionProvider>
      </body>
    </html>
  )
}
