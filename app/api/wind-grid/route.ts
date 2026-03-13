// src/app/api/wind-grid/route.ts
import { NextRequest, NextResponse } from "next/server"

// Convert wind speed + direction → U (east) and V (north) components
function toUV(speed: number, dir: number) {
  const rad = (dir * Math.PI) / 180
  return {
    u: -speed * Math.sin(rad),
    v: -speed * Math.cos(rad),
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const centerLat = parseFloat(searchParams.get("lat") ?? "6.93")
  const centerLon = parseFloat(searchParams.get("lon") ?? "79.86")

  // ── Build a 10x10 grid, 0.5° spacing ──────
  const NX = 10
  const NY = 10
  const SPACING = 0.5

  const minLon = centerLon - ((NX - 1) / 2) * SPACING
  const maxLat = centerLat + ((NY - 1) / 2) * SPACING

  // Build all grid points
  const points: { lat: number; lon: number }[] = []
  for (let row = 0; row < NY; row++) {
    for (let col = 0; col < NX; col++) {
      points.push({
        lat: maxLat - row * SPACING,
        lon: minLon + col * SPACING,
      })
    }
  }

  // Fetch wind for all points in parallel
  const results = await Promise.allSettled(
    points.map((p) =>
      fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${p.lat}&longitude=${p.lon}` +
          `&current=wind_speed_10m,wind_direction_10m&wind_speed_unit=ms&timeformat=unixtime`,
      ).then((r) => r.json()),
    ),
  )

  // Extract U/V arrays
  const uData: number[] = []
  const vData: number[] = []

  results.forEach((res, i) => {
    if (res.status === "fulfilled" && res.value?.current) {
      const { wind_speed_10m, wind_direction_10m } = res.value.current
      const { u, v } = toUV(wind_speed_10m ?? 0, wind_direction_10m ?? 0)
      uData.push(Math.round(u * 100) / 100)
      vData.push(Math.round(v * 100) / 100)
    } else {
      uData.push(0)
      vData.push(0)
    }
  })

  // ── Format for leaflet-velocity ────────────
  const header = {
    parameterUnit: "m/s",
    parameterNumber: 2,
    dx: SPACING,
    dy: SPACING,
    la1: maxLat,
    lo1: minLon,
    la2: maxLat - (NY - 1) * SPACING,
    lo2: minLon + (NX - 1) * SPACING,
    nx: NX,
    ny: NY,
    refTime: new Date().toISOString(),
  }

  const windData = [
    {
      header: {
        ...header,
        parameterCategory: 2,
        parameterNumber: 2,
        parameterNumberName: "eastward_wind",
      },
      data: uData,
    },
    {
      header: {
        ...header,
        parameterCategory: 2,
        parameterNumber: 3,
        parameterNumberName: "northward_wind",
      },
      data: vData,
    },
  ]

  return NextResponse.json(windData, {
    headers: { "Cache-Control": "public, s-maxage=600" },
  })
}
