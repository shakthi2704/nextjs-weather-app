// src/app/(protected)/DashboardClient.tsx
"use client"

import { useState } from "react"
import DashboardSidebar from "@/components/layout/DashboardSidebar"
import DashboardTopbar from "@/components/layout/DashboardTopbar"
import { ToastProvider } from "@/context/ToastContext"

interface Props {
  children: React.ReactNode
}

export default function DashboardClient({ children }: Props) {
  const [collapsed, setCollapsed] = useState(false)
  const sidebarWidth = collapsed ? 72 : 260

  return (
    <ToastProvider>
      <div className="flex min-h-screen" style={{ background: "#060d1f" }}>
        <DashboardSidebar
          collapsed={collapsed}
          onCollapse={() => setCollapsed(!collapsed)}
        />
        <div
          className="flex flex-col flex-1 min-w-0 transition-all duration-300"
          style={{ marginLeft: sidebarWidth }}
        >
          <DashboardTopbar sidebarWidth={sidebarWidth} />
          <main className="flex-1 p-4 pt-20">{children}</main>
        </div>
      </div>
    </ToastProvider>
  )
}
