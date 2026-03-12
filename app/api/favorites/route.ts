// src/app/api/favorites/route.ts
import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/utils/prisma"

// ── GET — fetch all favorites for current user ─
export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const favorites = await prisma.favorite.findMany({
    where: { userId: session.user.id },
    orderBy: { sortOrder: "asc" },
  })

  return NextResponse.json(favorites)
}

// ── POST — add a new favorite ──────────────────
export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const { cityName, country, lat, lon, timezone } = body

  if (!cityName || !lat || !lon) {
    return NextResponse.json(
      { error: "cityName, lat, lon are required" },
      { status: 400 },
    )
  }

  try {
    const favorite = await prisma.favorite.create({
      data: {
        userId: session.user.id,
        cityName,
        country: country ?? "",
        lat,
        lon,
        timezone: timezone ?? null,
      },
    })
    return NextResponse.json(favorite, { status: 201 })
  } catch (error: any) {
    // Unique constraint — already saved
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "City already in favorites" },
        { status: 409 },
      )
    }
    return NextResponse.json(
      { error: "Failed to save favorite" },
      { status: 500 },
    )
  }
}

// ── DELETE — remove a favorite ─────────────────
export async function DELETE(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")

  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 })
  }

  try {
    await prisma.favorite.deleteMany({
      where: { id, userId: session.user.id },
    })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { error: "Failed to remove favorite" },
      { status: 500 },
    )
  }
}
