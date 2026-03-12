"use client"

import { useState } from "react"
import DashboardSidebar from "@/components/layout/DashboardSidebar"
import DashboardTopbar from "@/components/layout/DashboardTopbar"

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [collapsed, setCollapsed] = useState(false)
  const sidebarWidth = collapsed ? 72 : 260

  return (
    <div className="min-h-screen" style={{ background: "#060d1f" }}>
      {/* Sidebar */}
      <DashboardSidebar collapsed={collapsed} onCollapse={setCollapsed} />

      {/* Topbar */}
      <DashboardTopbar sidebarWidth={sidebarWidth} />

      {/* Main content */}
      <main
        className="min-h-screen transition-all duration-300 ease-in-out"
        style={{
          marginLeft: sidebarWidth,
          paddingTop: 64, // topbar height
        }}
      >
        <div className="p-4">{children}</div>
      </main>
    </div>
  )
}
