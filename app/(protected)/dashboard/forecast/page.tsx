// src/app/(protected)/dashboard/forecast/page.tsx
"use client"

import { useState, useEffect } from "react"
import type { WeatherData, DailyForecast } from "@/types"

// ── Helpers ────────────────────────────────────
const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })

const formatHour = (iso: string) => {
  const h = new Date(iso).getHours()
  if (h === 0) return "12 AM"
  if (h === 12) return "12 PM"
  return h > 12 ? `${h - 12} PM` : `${h} AM`
}

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  })

const getUvLabel = (uv: number) =>
  uv <= 2
    ? { label: "Low", color: "#22c55e" }
    : uv <= 5
      ? { label: "Moderate", color: "#eab308" }
      : uv <= 7
        ? { label: "High", color: "#f97316" }
        : uv <= 10
          ? { label: "Very High", color: "#ef4444" }
          : { label: "Extreme", color: "#a855f7" }

// ── Skeleton ───────────────────────────────────
const Skeleton = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse rounded-xl bg-white/5 ${className}`} />
)

// ── Card ───────────────────────────────────────
const Card = ({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) => (
  <div
    className={`rounded-2xl p-5 ${className}`}
    style={{
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.07)",
    }}
  >
    {children}
  </div>
)

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-3">
    {children}
  </p>
)

export default function ForecastPage() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeDay, setActiveDay] = useState(0)

  useEffect(() => {
    async function load() {
      try {
        const locRes = await fetch("/api/location")
        const loc = await locRes.json()
        const params = new URLSearchParams({
          lat: String(loc.lat),
          lon: String(loc.lon),
          city: loc.city ?? "Unknown",
          country: loc.country ?? "Unknown",
          timezone: loc.timezone ?? "auto",
        })
        const wRes = await fetch(`/api/weather?${params}`)
        const data = await wRes.json()
        if (data.error) throw new Error(data.error)
        setWeather(data)
      } catch (e: any) {
        setError(e.message ?? "Failed to load forecast")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // ── Loading ────────────────────────────────
  if (loading)
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-24 w-full" />
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
        <Skeleton className="h-40 w-full" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-36" />
          <Skeleton className="h-36" />
        </div>
      </div>
    )

  // ── Error ──────────────────────────────────
  if (error || !weather)
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <p className="text-4xl">⚠️</p>
        <p className="text-slate-300 font-semibold">Failed to load forecast</p>
        <p className="text-slate-500 text-sm">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 rounded-xl text-sm text-blue-400
                   border border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 transition-colors"
        >
          Try again
        </button>
      </div>
    )

  const { daily, hourly, location } = weather
  const selected: DailyForecast = daily[activeDay]

  // Get hourly data for selected day (each day = 24 slots, but we only have 24h total)
  // Approximate: show all hourly data, filtered to the closest day
  const dayHourly = hourly
    .filter((_, i) => {
      const slotDay = Math.floor(i / 24)
      return slotDay === activeDay
    })
    .slice(0, 8) // show up to 8 slots per day

  // Fallback: if no hourly for that day, show available hourly
  const displayHourly = dayHourly.length > 0 ? dayHourly : hourly.slice(0, 8)

  const uvInfo = getUvLabel(selected.uvIndex)

  return (
    <div className="flex flex-col gap-4">
      {/* ── Row 1: Summary bar ────────────────── */}
      <div
        className="rounded-2xl px-6 py-4"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="text-5xl">{selected.conditionIcon}</span>
            <div>
              <p className="text-xs text-slate-500 mb-0.5">
                {activeDay === 0 ? "Today" : formatDate(selected.date)} ·{" "}
                {location.city}
              </p>
              <p
                className="text-xl font-bold text-slate-100"
                style={{ fontFamily: "var(--font-d)" }}
              >
                {selected.conditionText}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm font-bold text-red-400">
                  ↑ {selected.tempMax}°C
                </span>
                <span className="text-slate-600">·</span>
                <span className="text-sm font-bold text-blue-400">
                  ↓ {selected.tempMin}°C
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            {[
              {
                icon: "💧",
                label: "Rain Chance",
                value: `${selected.precipProb}%`,
              },
              { icon: "🌧️", label: "Precip", value: `${selected.precipMm} mm` },
              {
                icon: "💨",
                label: "Max Wind",
                value: `${selected.windSpeed} km/h`,
              },
              {
                icon: "☀️",
                label: "UV Index",
                value: `${selected.uvIndex} — ${uvInfo.label}`,
              },
              {
                icon: "🌅",
                label: "Sunrise",
                value: formatTime(selected.sunrise),
              },
              {
                icon: "🌇",
                label: "Sunset",
                value: formatTime(selected.sunset),
              },
            ].map((s) => (
              <div key={s.label} className="text-center min-w-[72px]">
                <p className="text-[10px] text-slate-500 uppercase tracking-wide">
                  {s.label}
                </p>
                <p
                  className="text-sm font-bold text-slate-100 mt-0.5"
                  style={{ fontFamily: "var(--font-d)" }}
                >
                  {s.icon} {s.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Row 2: 7-day selector ─────────────── */}
      <div className="grid grid-cols-7 gap-2">
        {daily.map((d, i) => (
          <button
            key={i}
            onClick={() => setActiveDay(i)}
            className="flex flex-col items-center gap-2 py-4 px-2 rounded-2xl
                       transition-all duration-200 border"
            style={{
              background:
                activeDay === i
                  ? "rgba(59,130,246,0.12)"
                  : "rgba(255,255,255,0.03)",
              border:
                activeDay === i
                  ? "1px solid rgba(59,130,246,0.35)"
                  : "1px solid rgba(255,255,255,0.07)",
              boxShadow:
                activeDay === i ? "0 0 20px rgba(59,130,246,0.08)" : "none",
            }}
          >
            <p
              className={`text-xs font-semibold ${activeDay === i ? "text-blue-400" : "text-slate-400"}`}
            >
              {d.dayName}
            </p>
            <span className="text-2xl">{d.conditionIcon}</span>
            <p
              className="text-sm font-bold text-slate-100"
              style={{ fontFamily: "var(--font-d)" }}
            >
              {d.tempMax}°
            </p>
            <p className="text-xs text-slate-500">{d.tempMin}°</p>
            <div
              className={`text-[10px] px-1.5 py-0.5 rounded-lg font-medium
                          ${d.precipProb >= 50 ? "text-blue-400 bg-blue-500/10" : "text-slate-600"}`}
            >
              {d.precipProb}%
            </div>
          </button>
        ))}
      </div>

      {/* ── Row 3: Hourly detail table ─────────── */}
      <Card>
        <SectionLabel>Hourly breakdown</SectionLabel>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[10px] text-slate-500 uppercase tracking-wider">
                {[
                  "Time",
                  "Condition",
                  "Temp",
                  "Feels Like",
                  "Rain",
                  "Wind",
                  "Humidity",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left pb-3 pr-4 font-semibold whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayHourly.map((h, i) => (
                <tr
                  key={i}
                  className={`border-t transition-colors
                    ${
                      h.precipProb >= 50
                        ? "border-blue-500/10 bg-blue-500/[0.04]"
                        : "border-white/[0.04] hover:bg-white/[0.02]"
                    }`}
                >
                  <td className="py-3 pr-4 text-slate-400 font-medium whitespace-nowrap">
                    {i === 0 && activeDay === 0 ? "Now" : formatHour(h.time)}
                  </td>
                  <td className="py-3 pr-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <span>{h.conditionIcon}</span>
                      <span className="text-slate-300 text-xs">
                        {h.conditionText}
                      </span>
                    </div>
                  </td>
                  <td
                    className="py-3 pr-4 font-bold text-slate-100"
                    style={{ fontFamily: "var(--font-d)" }}
                  >
                    {h.temp}°C
                  </td>
                  <td className="py-3 pr-4 text-slate-400">{h.feelsLike}°C</td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-blue-500"
                          style={{ width: `${h.precipProb}%` }}
                        />
                      </div>
                      <span
                        className={`text-xs font-medium ${h.precipProb >= 50 ? "text-blue-400" : "text-slate-500"}`}
                      >
                        {h.precipProb}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-slate-400 whitespace-nowrap">
                    💨 {h.windSpeed} km/h
                  </td>
                  <td className="py-3 text-slate-400">{h.humidity}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ── Row 4: UV + Rain probability ──────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* UV Index */}
        <Card>
          <SectionLabel>UV index — {selected.dayName}</SectionLabel>
          <div className="flex items-center gap-5 mb-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black shrink-0"
              style={{
                fontFamily: "var(--font-d)",
                background: `${uvInfo.color}22`,
                border: `1px solid ${uvInfo.color}44`,
                color: uvInfo.color,
              }}
            >
              {selected.uvIndex}
            </div>
            <div>
              <p
                className="text-lg font-bold"
                style={{ color: uvInfo.color, fontFamily: "var(--font-d)" }}
              >
                {uvInfo.label}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                {selected.uvIndex <= 2
                  ? "No protection needed."
                  : selected.uvIndex <= 5
                    ? "Wear sunscreen SPF 15+."
                    : selected.uvIndex <= 7
                      ? "SPF 30+, hat and sunglasses recommended."
                      : selected.uvIndex <= 10
                        ? "SPF 50+, limit time outdoors 10am–4pm."
                        : "Avoid being outside during midday hours."}
              </p>
            </div>
          </div>
          <div
            className="relative h-3 rounded-full overflow-hidden mb-2"
            style={{
              background:
                "linear-gradient(to right, #22c55e, #eab308, #f97316, #ef4444, #a855f7)",
            }}
          >
            <div
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full
                         bg-white border-2 border-slate-800"
              style={{
                left: `${Math.min((selected.uvIndex / 11) * 100, 100)}%`,
                transform: "translate(-50%, -50%)",
              }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-500 mt-1">
            <span>0 Low</span>
            <span>3 Moderate</span>
            <span>6 High</span>
            <span>8 V.High</span>
            <span>11+ Extreme</span>
          </div>
        </Card>

        {/* Rain probability — all 7 days */}
        <Card>
          <SectionLabel>Rain probability — 7 days</SectionLabel>
          <div className="flex items-end justify-between gap-2 h-28 mb-2">
            {daily.map((d, i) => (
              <div
                key={i}
                className="flex-1 flex flex-col items-center justify-end gap-1 h-full"
              >
                <p className="text-[10px] text-slate-500">
                  {d.precipProb > 0 ? `${d.precipProb}%` : ""}
                </p>
                <div
                  className="w-full rounded-t-lg overflow-hidden flex items-end"
                  style={{ height: "80%" }}
                >
                  <div
                    className={`w-full rounded-t-lg transition-all duration-500
                                ${
                                  i === activeDay
                                    ? "bg-blue-500"
                                    : d.precipProb >= 60
                                      ? "bg-blue-500/60"
                                      : "bg-blue-500/25"
                                }`}
                    style={{ height: `${Math.max(d.precipProb, 2)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between">
            {daily.map((d) => (
              <p
                key={d.dayName}
                className="flex-1 text-center text-[10px] text-slate-500"
              >
                {d.dayName}
              </p>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
