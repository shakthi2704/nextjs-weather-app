"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"

// ── Page title map ─────────────────────────────
const PAGE_TITLES: Record<string, { title: string; desc: string }> = {
  "/dashboard": { title: "Overview", desc: "Your weather at a glance" },
  "/dashboard/forecast": { title: "Forecast", desc: "7-day detailed forecast" },
  "/dashboard/air-quality": {
    title: "Air Quality",
    desc: "Real-time pollution data",
  },
  "/dashboard/map": {
    title: "Radar Map",
    desc: "Live rain radar & storm tracking",
  },
  "/dashboard/favorites": { title: "Favourites", desc: "Your saved cities" },
  "/dashboard/compare": {
    title: "Compare",
    desc: "Side-by-side city comparison",
  },
  "/dashboard/settings": { title: "Settings", desc: "Preferences & account" },
}

// ── Notification item ──────────────────────────
const NOTIFICATIONS = [
  {
    id: 1,
    icon: "⛈️",
    title: "Thunderstorm Warning",
    desc: "Heavy rain expected 4–8 PM in Colombo",
    time: "2m ago",
    unread: true,
  },
  {
    id: 2,
    icon: "💨",
    title: "Wind Advisory",
    desc: "Strong SW gusts up to 45 km/h tonight",
    time: "1h ago",
    unread: true,
  },
  {
    id: 3,
    icon: "☀️",
    title: "Clear skies tomorrow",
    desc: "Great day ahead — UV index will be high",
    time: "3h ago",
    unread: false,
  },
]

const NotificationDropdown = ({ onClose }: { onClose: () => void }) => (
  <div
    className="absolute right-0 top-full mt-2 w-80 rounded-2xl z-50 overflow-hidden"
    style={{
      background: "rgba(9,21,37,0.97)",
      border: "1px solid rgba(255,255,255,0.1)",
      backdropFilter: "blur(24px)",
      boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
    }}
  >
    <div
      className="flex items-center justify-between px-4 py-3"
      style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
    >
      <p
        className="text-sm font-semibold text-slate-100"
        style={{ fontFamily: "var(--font-d)" }}
      >
        Notifications
      </p>
      <button
        onClick={onClose}
        className="text-xs text-blue-400 hover:text-blue-300 transition-colors duration-200"
      >
        Mark all read
      </button>
    </div>

    <div className="flex flex-col">
      {NOTIFICATIONS.map((n) => (
        <div
          key={n.id}
          className={`flex items-start gap-3 px-4 py-3.5 transition-colors duration-150
                      hover:bg-white/3 cursor-pointer
                      ${n.unread ? "bg-blue-500/4" : ""}`}
          style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
        >
          <span className="text-xl shrink-0 mt-0.5">{n.icon}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold text-slate-100 truncate">
                {n.title}
              </p>
              {n.unread && (
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
              )}
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mt-0.5">
              {n.desc}
            </p>
            <p className="text-[11px] text-slate-600 mt-1">{n.time}</p>
          </div>
        </div>
      ))}
    </div>

    <div className="px-4 py-3">
      <Link
        href="/dashboard/settings"
        onClick={onClose}
        className="block text-center text-xs text-slate-500
                   hover:text-slate-300 transition-colors duration-200"
      >
        Manage notification settings →
      </Link>
    </div>
  </div>
)

const UserDropdown = ({ onClose }: { onClose: () => void }) => (
  <div
    className="absolute right-0 top-full mt-2 w-56 rounded-2xl z-50 overflow-hidden"
    style={{
      background: "rgba(9,21,37,0.97)",
      border: "1px solid rgba(255,255,255,0.1)",
      backdropFilter: "blur(24px)",
      boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
    }}
  >
    {/* User info */}
    <div
      className="px-4 py-3.5"
      style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
    >
      <p className="text-sm font-semibold text-slate-100">John Smith</p>
      <p className="text-xs text-slate-500 mt-0.5">john@example.com</p>
      <span
        className="inline-flex mt-2 px-2 py-0.5 rounded-full text-[11px] font-semibold
                       text-blue-300 bg-blue-500/10 border border-blue-500/20"
      >
        Free plan
      </span>
    </div>

    {/* Menu items */}
    <div className="py-1.5">
      {[
        { icon: "⚙️", label: "Settings", href: "/dashboard/settings" },
        { icon: "★", label: "Favourites", href: "/dashboard/favorites" },
        {
          icon: "⚡",
          label: "Upgrade to Pro",
          href: "/#pricing",
          accent: true,
        },
      ].map((item) => (
        <Link
          key={item.label}
          href={item.href}
          onClick={onClose}
          className={`flex items-center gap-3 px-4 py-2.5 text-sm
                      transition-colors duration-150 hover:bg-white/4
                      ${item.accent ? "text-blue-400" : "text-slate-300 hover:text-slate-100"}`}
        >
          <span className="text-base">{item.icon}</span>
          {item.label}
        </Link>
      ))}
    </div>

    {/* Sign out */}
    <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="w-full flex items-center gap-3 px-4 py-3 text-sm
                   text-red-400 hover:text-red-300 hover:bg-red-500/5
                   transition-colors duration-150"
      >
        <span className="text-base">→</span>
        Sign out
      </button>
    </div>
  </div>
)

// ── Main Topbar ────────────────────────────────
const DashboardTopbar = ({ sidebarWidth = 260 }: { sidebarWidth?: number }) => {
  const pathname = usePathname()
  const page = PAGE_TITLES[pathname] ?? { title: "Dashboard", desc: "" }
  const unreadCount = NOTIFICATIONS.filter((n) => n.unread).length

  const [showNotif, setShowNotif] = useState(false)
  const [showUser, setShowUser] = useState(false)

  const closeAll = () => {
    setShowNotif(false)
    setShowUser(false)
  }

  return (
    <>
      {/* Click-away overlay */}
      {(showNotif || showUser) && (
        <div className="fixed inset-0 z-30" onClick={closeAll} />
      )}

      <header
        className="fixed top-0 right-0 z-30 flex items-center justify-between
                   h-16 px-6"
        style={{
          left: sidebarWidth,
          background: "rgba(6,13,31,0.9)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          backdropFilter: "blur(12px)",
          transition: "left 0.3s ease-in-out",
        }}
      >
        {/* ── Left — Page title ─────────────── */}
        <div>
          <h1
            className="font-bold text-slate-100 leading-tight text-base"
            style={{ fontFamily: "var(--font-d)", letterSpacing: -0.5 }}
          >
            {page.title}
          </h1>
          {page.desc && (
            <p className="text-xs text-slate-500 mt-0.5">{page.desc}</p>
          )}
        </div>

        {/* ── Right — Actions ───────────────── */}
        <div className="flex items-center gap-2">
          {/* Location pill */}
          <div
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl
                       text-xs text-slate-400"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <span className="text-sm">📍</span>
            <span>Negombo, LK</span>
          </div>

          {/* Current temp pill */}
          <div
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl
                       text-xs font-semibold text-slate-200"
            style={{
              background: "rgba(59,130,246,0.08)",
              border: "1px solid rgba(59,130,246,0.15)",
            }}
          >
            <span>⛅</span>
            <span>34°C</span>
          </div>

          {/* Notification button */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotif(!showNotif)
                setShowUser(false)
              }}
              className={`relative w-9 h-9 rounded-xl flex items-center justify-center
                          text-base transition-all duration-200
                          ${
                            showNotif
                              ? "bg-blue-500/15 text-blue-400"
                              : "text-slate-400 hover:text-slate-100 hover:bg-white/6"
                          }`}
            >
              🔔
              {unreadCount > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full
                             flex items-center justify-center text-[10px] font-bold text-white"
                  style={{
                    background: "#3b82f6",
                    boxShadow: "0 0 6px rgba(59,130,246,0.6)",
                  }}
                >
                  {unreadCount}
                </span>
              )}
            </button>
            {showNotif && <NotificationDropdown onClose={closeAll} />}
          </div>

          {/* User avatar button */}
          <div className="relative">
            <button
              onClick={() => {
                setShowUser(!showUser)
                setShowNotif(false)
              }}
              className={`w-9 h-9 rounded-xl flex items-center justify-center
                          text-sm font-bold text-white transition-all duration-200
                          ${showUser ? "ring-2 ring-blue-500/50 scale-95" : "hover:scale-105"}`}
              style={{
                background: "linear-gradient(135deg, #3b82f6, #6366f1)",
                boxShadow: "0 0 10px rgba(59,130,246,0.25)",
              }}
            >
              J
            </button>
            {showUser && <UserDropdown onClose={closeAll} />}
          </div>
        </div>
      </header>
    </>
  )
}

export default DashboardTopbar
