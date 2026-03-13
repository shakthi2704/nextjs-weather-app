// src/app/api/auth/delete-account/route.ts
import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/utils/prisma"
import bcrypt from "bcryptjs"

export async function DELETE(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { password } = await req.json()

  if (!password) {
    return NextResponse.json(
      { error: "Password is required to delete account" },
      { status: 400 },
    )
  }

  try {
    // Verify password before deleting
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { password: true },
    })

    if (!user?.password) {
      return NextResponse.json(
        { error: "No password set for this account" },
        { status: 400 },
      )
    }

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      return NextResponse.json({ error: "Incorrect password" }, { status: 400 })
    }

    // Delete user — Prisma cascades will delete:
    // UserSettings, Favorite, Account, Session (via onDelete: Cascade)
    await prisma.user.delete({
      where: { id: session.user.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[DELETE_ACCOUNT_ERROR]", error)
    return NextResponse.json(
      { error: "Failed to delete account" },
      { status: 500 },
    )
  }
}
