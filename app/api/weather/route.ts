// app/api/weather/route.ts
import { NextRequest, NextResponse } from "next/server"
import { getWeatherData } from "@/lib/api/weather"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const lat = searchParams.get("lat")
  const lon = searchParams.get("lon")
  const city = searchParams.get("city") ?? "Unknown"
  const country = searchParams.get("country") ?? "Unknown"
  const timezone = searchParams.get("timezone") ?? "auto"

  if (!lat || !lon) {
    return NextResponse.json(
      { error: "lat and lon are required" },
      { status: 400 },
    )
  }

  try {
    const data = await getWeatherData(parseFloat(lat), parseFloat(lon), {
      city,
      country,
      timezone,
    })
    return NextResponse.json(data, {
      headers: {
        // Cache for 10 minutes
        "Cache-Control": "public, s-maxage=600, stale-while-revalidate=300",
      },
    })
  } catch (error) {
    console.error("[WEATHER_API_ERROR]", error)
    return NextResponse.json(
      { error: "Failed to fetch weather data" },
      { status: 500 },
    )
  }
}
