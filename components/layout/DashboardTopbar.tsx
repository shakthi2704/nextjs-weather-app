"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { useSettings } from "@/context/SettingsContext"

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

// ── Build notifications from real weather data ─────────────────────────────
function buildNotifications(
  weather: any,
  fmtTemp: (v: number) => string,
  fmtWind: (v: number) => string,
): {
  id: number
  icon: string
  title: string
  desc: string
  time: string
  unread: boolean
}[] {
  if (!weather?.current) return []
  const notifs = []
  const { temp, feelsLike, humidity, windSpeed, conditionText, uvIndex } =
    weather.current

  if (windSpeed >= 40) {
    notifs.push({
      id: 1,
      icon: "💨",
      title: "Wind Advisory",
      desc: `Strong winds at ${fmtWind(windSpeed)} — take care outdoors.`,
      time: "Now",
      unread: true,
    })
  }
  if (temp >= 35 || feelsLike >= 38) {
    notifs.push({
      id: 2,
      icon: "🌡️",
      title: "Heat Alert",
      desc: `Feels like ${fmtTemp(feelsLike)} — stay hydrated and avoid midday sun.`,
      time: "Now",
      unread: true,
    })
  }
  if (humidity >= 85) {
    notifs.push({
      id: 3,
      icon: "💧",
      title: "High Humidity",
      desc: `Humidity at ${humidity}% — uncomfortable conditions outside.`,
      time: "Now",
      unread: true,
    })
  }
  if (
    conditionText?.toLowerCase().includes("rain") ||
    conditionText?.toLowerCase().includes("storm")
  ) {
    notifs.push({
      id: 4,
      icon: "⛈️",
      title: "Rain Expected",
      desc: `${conditionText} — consider carrying an umbrella.`,
      time: "Now",
      unread: true,
    })
  }
  if (uvIndex >= 8) {
    notifs.push({
      id: 5,
      icon: "☀️",
      title: "High UV Index",
      desc: `UV index is ${uvIndex} — wear sunscreen if going outside.`,
      time: "Now",
      unread: false,
    })
  }

  // If nothing triggered, show a positive one
  if (notifs.length === 0) {
    notifs.push({
      id: 6,
      icon: "✅",
      title: "All clear",
      desc: `${conditionText} with ${fmtTemp(temp)} — good conditions outside.`,
      time: "Now",
      unread: false,
    })
  }

  return notifs.slice(0, 4)
}

// ── Notification dropdown ──────────────────────────────────────────────────
const NotificationDropdown = ({
  onClose,
  notifications,
}: {
  onClose: () => void
  notifications: ReturnType<typeof buildNotifications>
}) => (
  <div
    className="absolute right-0 top-full mt-2 w-80 rounded-2xl overflow-hidden"
    style={{
      background: "rgba(9,21,37,0.97)",
      border: "1px solid rgba(255,255,255,0.1)",
      backdropFilter: "blur(24px)",
      boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
      zIndex: 9999,
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
        className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
      >
        Mark all read
      </button>
    </div>

    <div className="flex flex-col">
      {notifications.map((n) => (
        <div
          key={n.id}
          className={`flex items-start gap-3 px-4 py-3.5 transition-colors hover:bg-white/[0.03]
                      cursor-pointer ${n.unread ? "bg-blue-500/[0.04]" : ""}`}
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
        className="block text-center text-xs text-slate-500 hover:text-slate-300 transition-colors"
      >
        Manage notification settings →
      </Link>
    </div>
  </div>
)

// ── User dropdown ──────────────────────────────────────────────────────────
const UserDropdown = ({
  onClose,
  name,
  email,
}: {
  onClose: () => void
  name: string
  email: string
}) => (
  <div
    className="absolute right-0 top-full mt-2 w-56 rounded-2xl overflow-hidden"
    style={{
      background: "rgba(9,21,37,0.97)",
      border: "1px solid rgba(255,255,255,0.1)",
      backdropFilter: "blur(24px)",
      boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
      zIndex: 9999,
    }}
  >
    <div
      className="px-4 py-3.5"
      style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
    >
      <p className="text-sm font-semibold text-slate-100 truncate">{name}</p>
      <p className="text-xs text-slate-500 mt-0.5 truncate">{email}</p>
      <span
        className="inline-flex mt-2 px-2 py-0.5 rounded-full text-[11px] font-semibold
                       text-blue-300 bg-blue-500/10 border border-blue-500/20"
      >
        Free plan
      </span>
    </div>

    <div className="py-1.5">
      {[
        {
          icon: "⚙️",
          label: "Settings",
          href: "/dashboard/settings",
          accent: false,
        },
        {
          icon: "★",
          label: "Favourites",
          href: "/dashboard/favorites",
          accent: false,
        },
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
          className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors
                      hover:bg-white/[0.04]
                      ${item.accent ? "text-blue-400" : "text-slate-300 hover:text-slate-100"}`}
        >
          <span className="text-base">{item.icon}</span>
          {item.label}
        </Link>
      ))}
    </div>

    <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400
                   hover:text-red-300 hover:bg-red-500/[0.05] transition-colors"
      >
        <span className="text-base">→</span>
        Sign out
      </button>
    </div>
  </div>
)

// ── Main Topbar ────────────────────────────────────────────────────────────
const DashboardTopbar = ({ sidebarWidth = 260 }: { sidebarWidth?: number }) => {
  const pathname = usePathname()
  const { data: session } = useSession()
  const { fmtTemp, fmtWind } = useSettings()
  const page = PAGE_TITLES[pathname] ?? { title: "Dashboard", desc: "" }

  const [showNotif, setShowNotif] = useState(false)
  const [showUser, setShowUser] = useState(false)
  const [locationLabel, setLocationLabel] = useState("Locating…")
  const [tempLabel, setTempLabel] = useState("…°")
  const [condIcon, setCondIcon] = useState("⛅")
  const [weather, setWeather] = useState<any>(null)

  // ── Fetch real location + weather ─────────
  useEffect(() => {
    async function load() {
      try {
        const locRes = await fetch("/api/location")
        const loc = await locRes.json()
        setLocationLabel(`${loc.city}, ${loc.country}`)

        const params = new URLSearchParams({
          lat: String(loc.lat),
          lon: String(loc.lon),
          city: loc.city ?? "Unknown",
          country: loc.country ?? "Unknown",
          timezone: loc.timezone ?? "auto",
        })
        const wRes = await fetch(`/api/weather?${params}`)
        const data = await wRes.json()
        if (!data.error) {
          setWeather(data)
          setTempLabel(fmtTemp(data.current.temp))
          setCondIcon(data.current.conditionIcon)
        }
      } catch {}
    }
    load()
  }, [])

  const notifications = buildNotifications(weather, fmtTemp, fmtWind)
  const unreadCount = notifications.filter((n) => n.unread).length
  const closeAll = () => {
    setShowNotif(false)
    setShowUser(false)
  }

  const name =
    session?.user?.name ?? session?.user?.email?.split("@")[0] ?? "User"
  const email = session?.user?.email ?? ""
  const initials = name
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <>
      {/* Backdrop to close dropdowns */}
      {(showNotif || showUser) && (
        <div
          className="fixed inset-0"
          style={{ zIndex: 9998 }}
          onClick={closeAll}
        />
      )}

      <header
        className="fixed top-0 right-0 flex items-center justify-between h-16 px-6"
        style={{
          left: sidebarWidth,
          background: "rgba(6,13,31,0.9)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          backdropFilter: "blur(12px)",
          transition: "left 0.3s ease-in-out",
          zIndex: 9997, // ← above Leaflet (z-index 400–1000) and map controls
        }}
      >
        {/* Left — page title */}
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

        {/* Right — pills + actions */}
        <div className="flex items-center gap-2">
          {/* Location pill — real data */}
          <div
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs text-slate-400"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <span className="text-sm">📍</span>
            <span>{locationLabel}</span>
          </div>

          {/* Temp pill — real data */}
          <div
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl
                          text-xs font-semibold text-slate-200"
            style={{
              background: "rgba(59,130,246,0.08)",
              border: "1px solid rgba(59,130,246,0.15)",
            }}
          >
            <span>{condIcon}</span>
            <span>{tempLabel}</span>
          </div>

          {/* Notifications */}
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
                              : "text-slate-400 hover:text-slate-100 hover:bg-white/[0.06]"
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
            {showNotif && (
              <NotificationDropdown
                onClose={closeAll}
                notifications={notifications}
              />
            )}
          </div>

          {/* User avatar */}
          <div className="relative">
            <button
              onClick={() => {
                setShowUser(!showUser)
                setShowNotif(false)
              }}
              className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm
                          font-bold text-white transition-all duration-200
                          ${showUser ? "ring-2 ring-blue-500/50 scale-95" : "hover:scale-105"}`}
              style={{
                background: "linear-gradient(135deg, #3b82f6, #6366f1)",
                boxShadow: "0 0 10px rgba(59,130,246,0.25)",
              }}
            >
              {initials}
            </button>
            {showUser && (
              <UserDropdown onClose={closeAll} name={name} email={email} />
            )}
          </div>
        </div>
      </header>
    </>
  )
}

export default DashboardTopbar
