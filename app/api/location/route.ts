// app/api/location/route.ts
import { NextRequest, NextResponse } from "next/server"
import { getLocationByIP } from "@/lib/api/weather"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/utils/prisma"

export async function GET(req: NextRequest) {
  try {
    // 1. Check if logged-in user has a saved default city
    const session = await auth()
    if (session?.user?.id) {
      const settings = await prisma.userSettings.findUnique({
        where: { userId: session.user.id },
      })

      if (settings?.defaultCity && settings.defaultLat && settings.defaultLon) {
        return NextResponse.json({
          city: settings.defaultCity,
          country: "",
          lat: settings.defaultLat,
          lon: settings.defaultLon,
          timezone: "auto",
        })
      }
    }

    // 2. Fall back to IP geolocation
    const location = await getLocationByIP()

    if (!location) {
      return NextResponse.json({
        city: "Colombo",
        country: "Sri Lanka",
        countryCode: "LK",
        lat: 6.9271,
        lon: 79.8612,
        timezone: "Asia/Colombo",
      })
    }

    return NextResponse.json(location)
  } catch (error) {
    console.error("[LOCATION_API_ERROR]", error)
    return NextResponse.json(
      { error: "Failed to detect location" },
      { status: 500 },
    )
  }
}
