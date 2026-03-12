"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import type { WeatherData } from "@/types"

// ── Weather condition → hero gradient ─────────
const WEATHER_GRADIENTS: Record<string, string> = {
  "Clear Sky":
    "linear-gradient(135deg, rgba(251,191,36,0.3) 0%, rgba(245,158,11,0.15) 40%, rgba(9,21,37,0.95) 100%)",
  "Mainly Clear":
    "linear-gradient(135deg, rgba(251,191,36,0.2) 0%, rgba(59,130,246,0.1) 40%, rgba(9,21,37,0.95) 100%)",
  "Partly Cloudy":
    "linear-gradient(135deg, rgba(29,78,216,0.3) 0%, rgba(59,130,246,0.1) 40%, rgba(9,21,37,0.95) 100%)",
  Overcast:
    "linear-gradient(135deg, rgba(71,85,105,0.4) 0%, rgba(30,41,59,0.9) 50%, rgba(9,21,37,0.95) 100%)",
  "Slight Rain":
    "linear-gradient(135deg, rgba(14,165,233,0.3) 0%, rgba(15,23,42,0.9) 50%, rgba(9,21,37,0.95) 100%)",
  "Moderate Rain":
    "linear-gradient(135deg, rgba(30,64,175,0.4) 0%, rgba(15,23,42,0.95) 50%, rgba(9,21,37,0.98) 100%)",
  "Heavy Rain":
    "linear-gradient(135deg, rgba(30,64,175,0.4) 0%, rgba(15,23,42,0.95) 50%, rgba(9,21,37,0.98) 100%)",
  Thunderstorm:
    "linear-gradient(135deg, rgba(67,20,120,0.4) 0%, rgba(15,23,42,0.98) 50%, rgba(9,21,37,0.98) 100%)",
  Foggy:
    "linear-gradient(135deg, rgba(100,116,139,0.3) 0%, rgba(30,41,59,0.9) 50%, rgba(9,21,37,0.95) 100%)",
}

const getHeroGradient = (condition: string) =>
  WEATHER_GRADIENTS[condition] ?? WEATHER_GRADIENTS["Partly Cloudy"]

const getAqiLabel = (aqi: number) =>
  aqi <= 50
    ? {
        label: "Good",
        color: "text-green-400",
        bg: "bg-green-500/10 border-green-500/20",
      }
    : aqi <= 100
      ? {
          label: "Moderate",
          color: "text-yellow-400",
          bg: "bg-yellow-500/10 border-yellow-500/20",
        }
      : aqi <= 150
        ? {
            label: "Unhealthy*",
            color: "text-orange-400",
            bg: "bg-orange-500/10 border-orange-500/20",
          }
        : {
            label: "Unhealthy",
            color: "text-red-400",
            bg: "bg-red-500/10 border-red-500/20",
          }

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

// ── Card shell ─────────────────────────────────
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

// ── Skeleton loader ────────────────────────────
const Skeleton = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse rounded-xl bg-white/5 ${className}`} />
)

// ── Moon phase ────────────────────────────────
const MOON = {
  phase: "Waxing Crescent",
  illumination: 28,
  nextFull: "in 8 days",
  emoji: "🌒",
  age: "6.2 days",
  rise: "9:14 AM",
  set: "10:32 PM",
}

// ── Page ───────────────────────────────────────
export default function DashboardPage() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)

        // 1. Get location
        const locRes = await fetch("/api/location", { cache: "no-store" })
        const loc = await locRes.json()

        // 2. Get weather
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
        setError(e.message ?? "Failed to load weather data")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // ── Loading state ──────────────────────────
  if (loading)
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-56 w-full" />
        <div className="grid grid-cols-3 gap-4">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
        <Skeleton className="h-32 w-full" />
        <div className="grid grid-cols-3 gap-4">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      </div>
    )

  // ── Error state ────────────────────────────
  if (error || !weather)
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <p className="text-4xl">⚠️</p>
        <p className="text-slate-300 font-semibold">
          Failed to load weather data
        </p>
        <p className="text-slate-500 text-sm">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 rounded-xl text-sm text-blue-400 border border-blue-500/30
                   bg-blue-500/10 hover:bg-blue-500/20 transition-colors"
        >
          Try again
        </button>
      </div>
    )

  const { current, daily, hourly, airQuality, location } = weather
  const aqi = getAqiLabel(airQuality.aqi)
  const today = daily[0]

  const nowHour = new Date().getHours()
  const startIdx = hourly.findIndex(
    (h) => new Date(h.time).getHours() >= nowHour,
  )
  const from = startIdx >= 0 ? startIdx : 0
  // Always fill 12 cards — wrap into next day if needed
  const next12 =
    hourly.length >= from + 12
      ? hourly.slice(from, from + 12)
      : [...hourly.slice(from), ...hourly.slice(0, 12 - (hourly.length - from))]

  // Precipitation data for the week
  const precipData = daily.map((d) => ({ day: d.dayName, mm: d.precipMm }))
  const maxPrecip = Math.max(...precipData.map((p) => p.mm), 0.1)

  return (
    <div className="flex flex-col gap-4">
      {/* ── Row 1: Hero — full width ──────────── */}
      <div
        className="rounded-2xl p-6 relative overflow-hidden"
        style={{
          background: getHeroGradient(current.conditionText),
          border: "1px solid rgba(59,130,246,0.2)",
        }}
      >
        <div
          className="absolute -top-20 right-10 w-80 h-80 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse, rgba(59,130,246,0.12) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute right-6 top-1/2 -translate-y-1/2 text-[120px] opacity-10
                     pointer-events-none select-none leading-none hidden xl:block"
        >
          {current.conditionIcon}
        </div>

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-slate-400 text-xs mb-4">
              <span>📍</span>
              <span>
                {location.city}, {location.country}
              </span>
              <Link
                href="/dashboard/favorites"
                className="ml-2 text-xs text-blue-400 hover:text-blue-300 transition-colors"
              >
                + Save
              </Link>
            </div>
            <div className="flex items-end gap-5">
              <span
                className="font-extrabold text-slate-100 leading-none"
                style={{
                  fontFamily: "var(--font-d)",
                  fontSize: 88,
                  letterSpacing: -5,
                }}
              >
                {current.temp}°
              </span>
              <div className="pb-3">
                <p className="text-5xl mb-2">{current.conditionIcon}</p>
                <div className="flex gap-1.5">
                  <span
                    className="px-2 py-0.5 rounded-lg text-xs font-semibold
                                   bg-red-500/10 text-red-400 border border-red-500/20"
                  >
                    ↑ {current.tempMax}°
                  </span>
                  <span
                    className="px-2 py-0.5 rounded-lg text-xs font-semibold
                                   bg-blue-500/10 text-blue-400 border border-blue-500/20"
                  >
                    ↓ {current.tempMin}°
                  </span>
                </div>
              </div>
            </div>
            <p
              className="text-xl font-semibold text-slate-200 mt-1"
              style={{ fontFamily: "var(--font-d)" }}
            >
              {current.conditionText}
            </p>
            <p className="text-sm text-slate-400 mt-1">
              Feels like {current.feelsLike}°C · Humidity {current.humidity}%
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {[
              { icon: "💨", label: "Wind", value: `${current.windSpeed} km/h` },
              {
                icon: "☀️",
                label: "UV Index",
                value: `${current.uvIndex} / 11`,
              },
              {
                icon: "👁️",
                label: "Visibility",
                value: `${current.visibility} km`,
              },
              {
                icon: "💧",
                label: "Dew Point",
                value: `${current.dewPoint}°C`,
              },
              {
                icon: "🌅",
                label: "Sunrise",
                value: formatTime(current.sunrise),
              },
              {
                icon: "🌇",
                label: "Sunset",
                value: formatTime(current.sunset),
              },
            ].map((s) => (
              <div
                key={s.label}
                className="flex flex-col items-center px-4 py-3 rounded-2xl text-center min-w-[76px]"
                style={{
                  background: "rgba(0,0,0,0.25)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <span className="text-xl mb-1">{s.icon}</span>
                <p
                  className="text-xs font-bold text-slate-100"
                  style={{ fontFamily: "var(--font-d)" }}
                >
                  {s.value}
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Row 2: 3 cards ────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Conditions */}
        <Card>
          <SectionLabel>Current conditions</SectionLabel>
          <div className="grid grid-cols-2 gap-2">
            {[
              {
                icon: "💨",
                label: "Wind",
                value: `${current.windSpeed} km/h`,
                sub: `${current.windDir} · Gusts ${current.windGust}`,
              },
              {
                icon: "💧",
                label: "Humidity",
                value: `${current.humidity}%`,
                sub: current.humidity > 70 ? "Feels muggy" : "Comfortable",
              },
              {
                icon: "☀️",
                label: "UV Index",
                value: `${current.uvIndex} / 11`,
                sub: current.uvIndex >= 6 ? "High — protect" : "Moderate",
              },
              {
                icon: "🔵",
                label: "Pressure",
                value: `${current.pressure} hPa`,
                sub: "Stable",
              },
            ].map((s) => (
              <div
                key={s.label}
                className="flex items-start gap-2 px-3 py-3 rounded-xl"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <span className="text-base shrink-0">{s.icon}</span>
                <div className="min-w-0">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider">
                    {s.label}
                  </p>
                  <p
                    className="text-sm font-bold text-slate-100 mt-0.5 truncate"
                    style={{ fontFamily: "var(--font-d)" }}
                  >
                    {s.value}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5 truncate">
                    {s.sub}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* AQI */}
        <Card>
          <div className="flex items-center justify-between">
            <SectionLabel>Air quality</SectionLabel>
            <Link
              href="/dashboard/air-quality"
              className="text-xs text-blue-400 hover:text-blue-300 transition-colors -mt-3"
            >
              Full report →
            </Link>
          </div>
          <div className="flex items-baseline gap-3 mb-3">
            <span
              className="font-extrabold leading-none"
              style={{
                fontFamily: "var(--font-d)",
                fontSize: 40,
                letterSpacing: -2,
                color: airQuality.color,
              }}
            >
              {airQuality.aqi}
            </span>
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-lg border ${aqi.bg} ${aqi.color}`}
            >
              {aqi.label}
            </span>
          </div>
          <div
            className="relative h-1.5 rounded-full mb-4"
            style={{
              background:
                "linear-gradient(to right, #22c55e, #eab308, #ef4444)",
            }}
          >
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3
                         rounded-full bg-white border-2 border-slate-800"
              style={{
                left: `${Math.min((airQuality.aqi / 200) * 100, 100)}%`,
                transform: "translate(-50%, -50%)",
                boxShadow: `0 0 8px ${airQuality.color}`,
              }}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "PM2.5", value: `${airQuality.pm25} µg` },
              { label: "PM10", value: `${airQuality.pm10} µg` },
              { label: "NO₂", value: `${airQuality.no2} ppb` },
              { label: "CO", value: `${airQuality.co} ppm` },
            ].map((a) => (
              <div
                key={a.label}
                className="px-3 py-2 rounded-xl"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <p className="text-[10px] text-slate-500">{a.label}</p>
                <p className="text-sm font-semibold text-slate-100 mt-0.5">
                  {a.value}
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* 7-day */}
        <Card>
          <div className="flex items-center justify-between">
            <SectionLabel>7-day forecast</SectionLabel>
            <Link
              href="/dashboard/forecast"
              className="text-xs text-blue-400 hover:text-blue-300 transition-colors -mt-3"
            >
              Full →
            </Link>
          </div>
          <div className="flex flex-col gap-1">
            {daily.map((d, i) => (
              <div
                key={i}
                className={`flex items-center gap-2 px-2 py-1.5 rounded-xl transition-colors
                            ${i === 0 ? "bg-blue-500/[0.07]" : "hover:bg-white/[0.03]"}`}
              >
                <p
                  className={`text-xs font-semibold w-9 shrink-0
                               ${i === 0 ? "text-blue-400" : "text-slate-300"}`}
                >
                  {d.dayName}
                </p>
                <span className="text-base shrink-0">{d.conditionIcon}</span>
                <div className="flex-1 h-1 rounded-full bg-white/10 overflow-hidden mx-1">
                  <div
                    className="h-full rounded-full bg-blue-500/50"
                    style={{ width: `${d.precipProb}%` }}
                  />
                </div>
                <p
                  className={`text-[11px] w-7 text-right shrink-0
                               ${d.precipProb >= 50 ? "text-blue-400" : "text-slate-600"}`}
                >
                  {d.precipProb}%
                </p>
                <div className="flex gap-1.5 shrink-0 w-12 justify-end">
                  <span
                    className="text-xs font-bold text-slate-100"
                    style={{ fontFamily: "var(--font-d)" }}
                  >
                    {d.tempMax}°
                  </span>
                  <span className="text-xs text-slate-500">{d.tempMin}°</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ── Row 3: Hourly ─────────────────────── */}
      <Card>
        <SectionLabel>Hourly forecast</SectionLabel>
        <div className="grid grid-cols-6 md:grid-cols-12 gap-2">
          {next12.map((h, i) => (
            <div
              key={i}
              className={`flex flex-col items-center gap-1.5 py-3 rounded-xl
                          transition-all duration-200 border
                          ${
                            i === 0
                              ? "bg-blue-500/15 border-blue-500/25"
                              : "bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.05]"
                          }`}
            >
              <p
                className={`text-[11px] font-medium ${i === 0 ? "text-blue-400" : "text-slate-500"}`}
              >
                {i === 0 ? "Now" : formatHour(h.time)}
              </p>
              <p className="text-xl">{h.conditionIcon}</p>
              <p
                className="text-sm font-bold text-slate-100"
                style={{ fontFamily: "var(--font-d)" }}
              >
                {h.temp}°
              </p>
              <p
                className={`text-[11px] ${h.precipProb >= 50 ? "text-blue-400" : "text-slate-600"}`}
              >
                💧{h.precipProb}%
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* ── Row 4: Insights + Precip + Moon ───── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Smart insights — derived from real data */}
        <Card>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-base">⚡</span>
            <SectionLabel>Smart insights</SectionLabel>
          </div>
          <div className="flex flex-col gap-2">
            {[
              ...(current.uvIndex >= 6
                ? [
                    {
                      icon: "☀️",
                      color: "text-yellow-400",
                      bg: "bg-yellow-500/10 border-yellow-500/20",
                      text: `UV index is ${current.uvIndex} — apply SPF 30+ before going outside.`,
                    },
                  ]
                : []),
              ...(next12.some((h) => h.precipProb >= 60)
                ? [
                    {
                      icon: "🌧️",
                      color: "text-blue-400",
                      bg: "bg-blue-500/10 border-blue-500/20",
                      text: `Rain expected later today — carry an umbrella.`,
                    },
                  ]
                : []),
              ...(current.windSpeed >= 30
                ? [
                    {
                      icon: "💨",
                      color: "text-cyan-400",
                      bg: "bg-cyan-500/10 border-cyan-500/20",
                      text: `Strong winds at ${current.windSpeed} km/h — secure loose outdoor items.`,
                    },
                  ]
                : []),
              ...(current.humidity >= 75
                ? [
                    {
                      icon: "💧",
                      color: "text-cyan-400",
                      bg: "bg-cyan-500/10 border-cyan-500/20",
                      text: `High humidity ${current.humidity}% — stay hydrated throughout the day.`,
                    },
                  ]
                : []),
              ...(airQuality.aqi > 100
                ? [
                    {
                      icon: "😷",
                      color: "text-orange-400",
                      bg: "bg-orange-500/10 border-orange-500/20",
                      text: `Air quality is ${airQuality.aqiText} — consider limiting outdoor activity.`,
                    },
                  ]
                : []),
              ...(current.uvIndex < 6 &&
              next12.every((h) => h.precipProb < 60) &&
              current.windSpeed < 30
                ? [
                    {
                      icon: "🏃",
                      color: "text-green-400",
                      bg: "bg-green-500/10 border-green-500/20",
                      text: "Good conditions for outdoor activities today.",
                    },
                  ]
                : []),
            ]
              .slice(0, 4)
              .map((ins, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-3 px-3.5 py-3 rounded-xl border ${ins.bg}`}
                >
                  <span className="text-lg shrink-0">{ins.icon}</span>
                  <p className={`text-xs leading-relaxed ${ins.color}`}>
                    {ins.text}
                  </p>
                </div>
              ))}
          </div>
        </Card>

        {/* Precipitation chart */}
        <Card>
          <SectionLabel>Precipitation this week</SectionLabel>
          <div className="flex items-end justify-between gap-1.5 h-28 mb-2">
            {precipData.map((p, i) => (
              <div
                key={i}
                className="flex-1 flex flex-col items-center justify-end gap-1 h-full"
              >
                <p className="text-[10px] text-slate-500">
                  {p.mm > 0 ? p.mm.toFixed(1) : ""}
                </p>
                <div
                  className="w-full rounded-t-lg overflow-hidden flex items-end"
                  style={{ height: "80%" }}
                >
                  <div
                    className={`w-full rounded-t-lg transition-all duration-500
                                ${i === 0 ? "bg-blue-500" : "bg-blue-500/40"}`}
                    style={{
                      height: `${(p.mm / maxPrecip) * 100}%`,
                      minHeight: p.mm > 0 ? 4 : 2,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between">
            {precipData.map((p) => (
              <p
                key={p.day}
                className="flex-1 text-center text-[10px] text-slate-500"
              >
                {p.day}
              </p>
            ))}
          </div>
          <div
            className="flex items-center justify-between mt-3 pt-3"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
          >
            <p className="text-xs text-slate-400">Total this week</p>
            <p
              className="text-sm font-bold text-blue-400"
              style={{ fontFamily: "var(--font-d)" }}
            >
              {daily.reduce((a, d) => a + d.precipMm, 0).toFixed(1)} mm
            </p>
          </div>
        </Card>

        {/* Moon phase — static for now */}
        <Card>
          <SectionLabel>Moon phase</SectionLabel>
          <div className="flex items-center gap-5 mb-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-5xl shrink-0"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 0 24px rgba(148,163,184,0.08)",
              }}
            >
              {MOON.emoji}
            </div>
            <div>
              <p
                className="text-base font-bold text-slate-100"
                style={{ fontFamily: "var(--font-d)" }}
              >
                {MOON.phase}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                {MOON.illumination}% illuminated
              </p>
              <p className="text-xs text-blue-400 mt-1">
                Full moon {MOON.nextFull}
              </p>
            </div>
          </div>
          <div className="mb-4">
            <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${MOON.illumination}%`,
                  background:
                    "linear-gradient(to right, rgba(148,163,184,0.4), rgba(241,245,249,0.9))",
                }}
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Age", value: MOON.age },
              { label: "Moonrise", value: MOON.rise },
              { label: "Moonset", value: MOON.set },
            ].map((m) => (
              <div
                key={m.label}
                className="text-center px-2 py-2.5 rounded-xl"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <p className="text-[10px] text-slate-500">{m.label}</p>
                <p className="text-xs font-semibold text-slate-200 mt-0.5">
                  {m.value}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
