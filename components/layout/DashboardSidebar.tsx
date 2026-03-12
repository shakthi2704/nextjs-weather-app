"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

// ── Nav items ──────────────────────────────────
const NAV_ITEMS = [
  { href: "/dashboard", icon: "⊞", label: "Overview" },
  { href: "/dashboard/forecast", icon: "📅", label: "Forecast" },
  { href: "/dashboard/air-quality", icon: "💨", label: "Air Quality" },
  { href: "/dashboard/map", icon: "🗺️", label: "Radar Map" },
  { href: "/dashboard/favorites", icon: "★", label: "Favourites" },
  { href: "/dashboard/compare", icon: "⚖️", label: "Compare" },
]

const BOTTOM_ITEMS = [
  { href: "/dashboard/settings", icon: "⚙️", label: "Settings" },
]

// ── Tooltip (shown when collapsed) ────────────
const Tooltip = ({ label }: { label: string }) => (
  <div
    className="absolute left-full ml-3 px-3 py-1.5 rounded-lg text-xs font-semibold
               text-slate-100 whitespace-nowrap pointer-events-none z-50
               opacity-0 group-hover:opacity-100 translate-x-1
               group-hover:translate-x-0 transition-all duration-150"
    style={{
      background: "rgba(15,30,55,0.95)",
      border: "1px solid rgba(255,255,255,0.1)",
      boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
    }}
  >
    {label}
  </div>
)

// ── Single nav link ────────────────────────────
interface NavLinkProps {
  href: string
  icon: string
  label: string
  active: boolean
  collapsed: boolean
}

const NavLink = ({ href, icon, label, active, collapsed }: NavLinkProps) => (
  <Link
    href={href}
    className={`
      group relative flex items-center gap-3 px-3 py-2.5 rounded-xl
      text-sm font-medium transition-all duration-200 select-none
      ${active ? "text-blue-400" : "text-slate-400 hover:text-slate-100"}
    `}
    style={
      active
        ? {
            background: "rgba(59,130,246,0.08)",
            borderLeft: "2px solid #3b82f6",
            paddingLeft: "calc(0.75rem - 2px)",
          }
        : {
            borderLeft: "2px solid transparent",
          }
    }
  >
    {/* Icon */}
    <span
      className={`shrink-0 text-lg leading-none transition-transform duration-200
                  ${active ? "scale-110" : "group-hover:scale-105"}`}
    >
      {icon}
    </span>

    {/* Label */}
    <span
      className={`whitespace-nowrap transition-all duration-200 overflow-hidden
                  ${collapsed ? "w-0 opacity-0" : "w-auto opacity-100"}`}
    >
      {label}
    </span>

    {/* Tooltip — only when collapsed */}
    {collapsed && <Tooltip label={label} />}
  </Link>
)

// ── Main Sidebar ───────────────────────────────
interface SidebarProps {
  collapsed: boolean
  onCollapse: (val: boolean) => void
}

const DashboardSidebar = ({ collapsed, onCollapse }: SidebarProps) => {
  const pathname = usePathname()

  const isActive = (href: string) =>
    href === "/dashboard"
      ? pathname === "/dashboard"
      : pathname.startsWith(href)

  return (
    <aside
      className="fixed left-0 top-0 h-screen z-40 flex flex-col
                 transition-all duration-300 ease-in-out"
      style={{
        width: collapsed ? 72 : 260,
        background: "rgba(6,13,31,0.95)",
        borderRight: "1px solid rgba(255,255,255,0.07)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div
        className="flex items-center h-16 px-4 shrink-0"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <Link href="/" className="flex items-center gap-3 no-underline min-w-0">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-base shrink-0"
            style={{
              background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
              boxShadow: "0 0 16px rgba(59,130,246,0.35)",
            }}
          >
            🌤
          </div>
          <span
            className={`font-extrabold text-slate-100 text-lg tracking-tight
                        whitespace-nowrap transition-all duration-200 overflow-hidden
                        ${collapsed ? "w-0 opacity-0" : "w-auto opacity-100"}`}
            style={{ fontFamily: "var(--font-d)" }}
          >
            WeatherWise
          </span>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-4 flex flex-col gap-1">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.href}
            {...item}
            active={isActive(item.href)}
            collapsed={collapsed}
          />
        ))}
      </nav>

      <div
        className="px-3 py-4 flex flex-col gap-1"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        {/* Settings */}
        {BOTTOM_ITEMS.map((item) => (
          <NavLink
            key={item.href}
            {...item}
            active={isActive(item.href)}
            collapsed={collapsed}
          />
        ))}

        <div
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl mt-1
                      transition-all duration-200
                      ${collapsed ? "justify-center" : ""}`}
          style={{ background: "rgba(255,255,255,0.03)" }}
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center
                       text-sm font-bold text-white shrink-0"
            style={{
              background: "linear-gradient(135deg, #3b82f6, #6366f1)",
              boxShadow: "0 0 10px rgba(59,130,246,0.25)",
            }}
          >
            J
          </div>

          <div
            className={`min-w-0 transition-all duration-200 overflow-hidden
                        ${collapsed ? "w-0 opacity-0" : "w-auto opacity-100"}`}
          >
            <p className="text-xs font-semibold text-slate-200 truncate">
              John Smith
            </p>
            <p className="text-[11px] text-slate-500 truncate">
              john@example.com
            </p>
          </div>
        </div>

        <button
          onClick={() => onCollapse(!collapsed)}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl mt-1
                      text-sm text-slate-500 hover:text-slate-300
                      transition-all duration-200 hover:bg-white/[0.04]
                      ${collapsed ? "justify-center" : ""}`}
        >
          <span
            className={`text-base transition-transform duration-300
                        ${collapsed ? "rotate-180" : ""}`}
          >
            ◂
          </span>
          <span
            className={`whitespace-nowrap text-xs transition-all duration-200 overflow-hidden
                        ${collapsed ? "w-0 opacity-0" : "w-auto opacity-100"}`}
          >
            Collapse sidebar
          </span>
        </button>
      </div>
    </aside>
  )
}

export default DashboardSidebar
