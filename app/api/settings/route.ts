// src/app/api/settings/route.ts
import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/utils/prisma"

// ── GET — load user settings + profile ────────
export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { settings: true },
  })

  return NextResponse.json(user)
}

// ── PATCH — update settings ────────────────────
export async function PATCH(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const {
    name,
    tempUnit,
    windUnit,
    theme,
    language,
    defaultCity,
    defaultLat,
    defaultLon,
    notifications,
  } = body

  try {
    if (name !== undefined) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { name },
      })
    }

    const settings = await prisma.userSettings.upsert({
      where: { userId: session.user.id },
      update: {
        ...(tempUnit !== undefined && { tempUnit }),
        ...(windUnit !== undefined && { windUnit }),
        ...(theme !== undefined && { theme }),
        ...(language !== undefined && { language }),
        ...(defaultCity !== undefined && { defaultCity }),
        ...(defaultLat !== undefined && { defaultLat }),
        ...(defaultLon !== undefined && { defaultLon }),
        ...(notifications !== undefined && { notifications }),
      },
      create: {
        userId: session.user.id,
        tempUnit: tempUnit ?? "C",
        windUnit: windUnit ?? "kmh",
        theme: theme ?? "dark",
        language: language ?? "en",
        defaultCity: defaultCity ?? null,
        defaultLat: defaultLat ?? null,
        defaultLon: defaultLon ?? null,
        notifications: notifications ?? true,
      },
    })

    return NextResponse.json({ success: true, settings })
  } catch (error) {
    console.error("[SETTINGS_ERROR]", error)
    return NextResponse.json(
      { error: "Failed to save settings" },
      { status: 500 },
    )
  }
}
