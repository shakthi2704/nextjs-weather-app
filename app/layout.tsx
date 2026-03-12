import type { Metadata, Viewport } from "next"
import { Poppins, Inter } from "next/font/google"
import "./globals.css"
import { SessionProvider } from "next-auth/react"
import { auth } from "@/lib/auth"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins", // ← maps to var(--font-d) in CSS
  display: "swap",
})

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter", // ← maps to var(--font-b) in CSS
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "WeatherWise — Advanced Weather Dashboard",
    template: "%s | WeatherWise",
  },
  description:
    "Real-time weather forecasts, air quality, radar maps, and smart alerts. " +
    "The most advanced weather dashboard — free forever.",
  keywords: [
    "weather",
    "forecast",
    "weather dashboard",
    "air quality",
    "AQI",
    "UV index",
    "weather radar",
  ],
  authors: [{ name: "WeatherWise" }],
  creator: "WeatherWise",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  ),
  openGraph: {
    type: "website",
    siteName: "WeatherWise",
    title: "WeatherWise — Advanced Weather Dashboard",
    description: "Real-time weather, forecasts, AQI, and radar maps.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "WeatherWise Dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WeatherWise — Advanced Weather Dashboard",
    description: "Real-time weather, forecasts, AQI, and radar maps.",
    images: ["/og-image.png"],
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/icon-32.png",
    apple: "/icons/apple-touch-icon.png",
    shortcut: "/icons/icon-32.png",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  themeColor: "#060d1f",
  width: "device-width",
  initialScale: 1,
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth()
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`
    ${poppins.variable}
    ${inter.variable}
    antialiased
    w-full          
    min-h-screen    
  `}
      >
        <SessionProvider session={session}>{children}</SessionProvider>
      </body>
    </html>
  )
}
