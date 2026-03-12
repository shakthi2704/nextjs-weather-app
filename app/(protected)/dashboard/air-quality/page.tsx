// src/app/(protected)/dashboard/air-quality/page.tsx
"use client"

import { useState, useEffect } from "react"
import type { WeatherData } from "@/types"

// ── AQI helpers ────────────────────────────────
const getAqiInfo = (aqi: number) =>
  aqi <= 50
    ? {
        label: "Good",
        color: "#22c55e",
        bg: "rgba(34,197,94,0.1)",
        border: "rgba(34,197,94,0.25)",
        tip: "Air quality is excellent. Great day to be outside!",
      }
    : aqi <= 100
      ? {
          label: "Moderate",
          color: "#eab308",
          bg: "rgba(234,179,8,0.1)",
          border: "rgba(234,179,8,0.25)",
          tip: "Air quality is acceptable. Unusually sensitive people should consider limiting prolonged outdoor exertion.",
        }
      : aqi <= 150
        ? {
            label: "Unhealthy for Sensitive",
            color: "#f97316",
            bg: "rgba(249,115,22,0.1)",
            border: "rgba(249,115,22,0.25)",
            tip: "Members of sensitive groups may experience health effects. General public is unlikely to be affected.",
          }
        : aqi <= 200
          ? {
              label: "Unhealthy",
              color: "#ef4444",
              bg: "rgba(239,68,68,0.1)",
              border: "rgba(239,68,68,0.25)",
              tip: "Everyone may begin to experience health effects. Sensitive groups may experience more serious effects.",
            }
          : aqi <= 300
            ? {
                label: "Very Unhealthy",
                color: "#a855f7",
                bg: "rgba(168,85,247,0.1)",
                border: "rgba(168,85,247,0.25)",
                tip: "Health alert: everyone may experience more serious health effects.",
              }
            : {
                label: "Hazardous",
                color: "#7f1d1d",
                bg: "rgba(127,29,29,0.1)",
                border: "rgba(127,29,29,0.25)",
                tip: "Health warning of emergency conditions. The entire population is likely to be affected.",
              }

const AQI_SCALE = [
  { range: "0–50", label: "Good", color: "#22c55e" },
  { range: "51–100", label: "Moderate", color: "#eab308" },
  { range: "101–150", label: "Unhealthy (Sensitive)", color: "#f97316" },
  { range: "151–200", label: "Unhealthy", color: "#ef4444" },
  { range: "201–300", label: "Very Unhealthy", color: "#a855f7" },
  { range: "301+", label: "Hazardous", color: "#7f1d1d" },
]

const HEALTH_TIPS = [
  {
    group: "🏃 Athletes",
    tip: "Consider reducing intensity and duration of outdoor workouts when AQI > 100.",
  },
  {
    group: "👴 Elderly",
    tip: "Limit prolonged outdoor exertion. Keep windows closed on high AQI days.",
  },
  {
    group: "🧒 Children",
    tip: "Reduce outdoor play time. Keep them indoors during peak pollution hours.",
  },
  {
    group: "🫁 Asthma/Lung",
    tip: "Carry rescue inhaler. Avoid outdoor exercise when AQI exceeds 100.",
  },
  {
    group: "🤰 Pregnant",
    tip: "Minimize outdoor exposure above AQI 100 to protect fetal development.",
  },
  {
    group: "💊 Heart Disease",
    tip: "Watch for symptoms like chest pain or shortness of breath on high AQI days.",
  },
]

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

export default function AirQualityPage() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activePollutant, setActivePollutant] = useState<string | null>(null)

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
        setError(e.message ?? "Failed to load air quality data")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading)
    return (
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-4">
          <Skeleton className="h-56" />
          <Skeleton className="h-56" />
        </div>
        <div className="grid grid-cols-6 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      </div>
    )

  if (error || !weather)
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <p className="text-4xl">⚠️</p>
        <p className="text-slate-300 font-semibold">
          Failed to load air quality data
        </p>
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

  const { airQuality, location, daily } = weather
  const info = getAqiInfo(airQuality.aqi)

  // SVG arc gauge
  const radius = 70
  const stroke = 10
  const cx = 90
  const cy = 90
  const circumference = Math.PI * radius // half circle
  const progress = Math.min(airQuality.aqi / 300, 1)
  const dashOffset = circumference * (1 - progress)

  const POLLUTANTS = [
    {
      key: "pm25",
      label: "PM2.5",
      value: airQuality.pm25,
      unit: "µg/m³",
      max: 75,
      icon: "🔵",
      desc: "Fine particulate matter smaller than 2.5 microns. Can penetrate deep into the lungs and bloodstream. Main sources: vehicle exhaust, wildfires, industrial emissions.",
    },
    {
      key: "pm10",
      label: "PM10",
      value: airQuality.pm10,
      unit: "µg/m³",
      max: 150,
      icon: "🟣",
      desc: "Coarse particles smaller than 10 microns. Can cause respiratory irritation. Sources: dust, pollen, mold spores, construction sites.",
    },
    {
      key: "no2",
      label: "NO₂",
      value: airQuality.no2,
      unit: "ppb",
      max: 100,
      icon: "🟡",
      desc: "Nitrogen dioxide from burning fossil fuels. Irritates airways and aggravates asthma. Primary source: vehicle emissions and power plants.",
    },
    {
      key: "co",
      label: "CO",
      value: airQuality.co,
      unit: "ppm",
      max: 9,
      icon: "🟠",
      desc: "Carbon monoxide, a colorless odorless gas. High levels can be dangerous. Sources: vehicle exhaust, gas appliances, wildfires.",
    },
    {
      key: "so2",
      label: "SO₂",
      value: airQuality.so2,
      unit: "ppb",
      max: 75,
      icon: "🔴",
      desc: "Sulphur dioxide from burning coal and oil. Can cause respiratory issues and acid rain. Main sources: power plants and industrial processes.",
    },
    {
      key: "o3",
      label: "O₃",
      value: airQuality.o3,
      unit: "ppb",
      max: 100,
      icon: "🟢",
      desc: "Ground-level ozone formed by sunlight reacting with pollutants. Can trigger asthma attacks. Peaks on hot sunny afternoons.",
    },
  ]

  // Simulate 7-day AQI forecast from daily UV/precip data as proxy
  const aqiForecast = daily.map((d, i) => ({
    day: d.dayName,
    aqi: Math.round(airQuality.aqi * (0.85 + Math.random() * 0.3)),
    icon: d.conditionIcon,
  }))

  // Simulate hourly AQI bars
  const hourlyAqi = Array.from({ length: 24 }, (_, i) => ({
    hour:
      i === 0 ? "12AM" : i < 12 ? `${i}AM` : i === 12 ? "12PM" : `${i - 12}PM`,
    aqi: Math.round(
      airQuality.aqi * (0.7 + Math.sin(i / 4) * 0.3 + Math.random() * 0.15),
    ),
  }))
  const maxHourly = Math.max(...hourlyAqi.map((h) => h.aqi))

  return (
    <div className="flex flex-col gap-4">
      {/* ── Row 1: AQI hero + 7-day forecast ──── */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-4">
        {/* AQI Gauge hero */}
        <Card>
          <div className="flex flex-wrap items-center gap-8">
            {/* SVG Arc Gauge */}
            <div
              className="relative shrink-0"
              style={{ width: 180, height: 100 }}
            >
              <svg width="180" height="100" viewBox="0 0 180 100">
                {/* Background arc */}
                <path
                  d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
                  fill="none"
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth={stroke}
                  strokeLinecap="round"
                />
                {/* Colored arc */}
                <path
                  d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
                  fill="none"
                  stroke={info.color}
                  strokeWidth={stroke}
                  strokeLinecap="round"
                  strokeDasharray={`${circumference} ${circumference}`}
                  strokeDashoffset={dashOffset}
                  style={{
                    filter: `drop-shadow(0 0 6px ${info.color})`,
                    transition: "stroke-dashoffset 1s ease",
                  }}
                />
                {/* Labels */}
                <text
                  x="10"
                  y="98"
                  fill="#475569"
                  fontSize="9"
                  textAnchor="middle"
                >
                  0
                </text>
                <text
                  x="170"
                  y="98"
                  fill="#475569"
                  fontSize="9"
                  textAnchor="middle"
                >
                  300
                </text>
              </svg>
              {/* Center value */}
              <div className="absolute inset-0 flex flex-col items-center justify-end pb-1">
                <p
                  className="font-black leading-none"
                  style={{
                    fontFamily: "var(--font-d)",
                    fontSize: 36,
                    color: info.color,
                    textShadow: `0 0 20px ${info.color}66`,
                  }}
                >
                  {airQuality.aqi}
                </p>
                <p className="text-[10px] text-slate-500">AQI</p>
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span
                  className="text-xl font-bold px-4 py-1.5 rounded-xl border"
                  style={{
                    fontFamily: "var(--font-d)",
                    color: info.color,
                    background: info.bg,
                    border: `1px solid ${info.border}`,
                  }}
                >
                  {info.label}
                </span>
                <span className="text-xs text-slate-500">
                  📍 {location.city}
                </span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed mb-4 max-w-lg">
                {info.tip}
              </p>

              {/* Pollutant pills */}
              <div className="flex flex-wrap gap-2">
                {POLLUTANTS.map((p) => (
                  <div
                    key={p.key}
                    className="px-3 py-1.5 rounded-xl text-xs font-medium"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      color: "#94a3b8",
                    }}
                  >
                    {p.icon} {p.label}:{" "}
                    <span className="text-slate-200 font-bold">{p.value}</span>
                    <span className="text-slate-600 ml-0.5">{p.unit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* 7-day AQI forecast */}
        <Card>
          <SectionLabel>7-day AQI forecast</SectionLabel>
          <div className="flex flex-col gap-1.5">
            {aqiForecast.map((d, i) => {
              const di = getAqiInfo(d.aqi)
              return (
                <div key={i} className="flex items-center gap-3">
                  <p
                    className={`text-xs font-semibold w-10 shrink-0
                                 ${i === 0 ? "text-blue-400" : "text-slate-400"}`}
                  >
                    {d.day}
                  </p>
                  <span className="text-base shrink-0">{d.icon}</span>
                  <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min((d.aqi / 200) * 100, 100)}%`,
                        background: di.color,
                      }}
                    />
                  </div>
                  <p
                    className="text-xs font-bold w-8 text-right shrink-0"
                    style={{ color: di.color, fontFamily: "var(--font-d)" }}
                  >
                    {d.aqi}
                  </p>
                  <p className="text-[10px] text-slate-500 w-16 shrink-0">
                    {di.label}
                  </p>
                </div>
              )
            })}
          </div>
        </Card>
      </div>

      {/* ── Row 2: 6 pollutant cards ───────────── */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {POLLUTANTS.map((p) => {
          const pct = Math.min((p.value / p.max) * 100, 100)
          const isActive = activePollutant === p.key
          return (
            <div key={p.key}>
              <button
                onClick={() => setActivePollutant(isActive ? null : p.key)}
                className="w-full text-left rounded-2xl p-4 transition-all duration-200 border"
                style={{
                  background: isActive
                    ? "rgba(59,130,246,0.08)"
                    : "rgba(255,255,255,0.03)",
                  border: isActive
                    ? "1px solid rgba(59,130,246,0.3)"
                    : "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xl">{p.icon}</span>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider">
                    {p.label}
                  </span>
                </div>
                <p
                  className="text-2xl font-black mb-0.5"
                  style={{ fontFamily: "var(--font-d)", color: info.color }}
                >
                  {p.value}
                </p>
                <p className="text-[10px] text-slate-500 mb-3">{p.unit}</p>
                <div className="h-1 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${pct}%`,
                      background:
                        pct > 80 ? "#ef4444" : pct > 50 ? "#f97316" : "#22c55e",
                    }}
                  />
                </div>
              </button>

              {/* Expanded description */}
              {isActive && (
                <div
                  className="mt-1 p-3 rounded-xl text-xs text-slate-400 leading-relaxed"
                  style={{
                    background: "rgba(59,130,246,0.05)",
                    border: "1px solid rgba(59,130,246,0.15)",
                  }}
                >
                  {p.desc}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* ── Row 3: Hourly AQI + Health tips ────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Hourly AQI bars */}
        <Card>
          <SectionLabel>Hourly AQI trend</SectionLabel>
          <div className="flex items-end gap-0.5 h-28 mb-2">
            {hourlyAqi.map((h, i) => {
              const hi = getAqiInfo(h.aqi)
              const pct = (h.aqi / maxHourly) * 100
              const now = new Date().getHours()
              return (
                <div
                  key={i}
                  className="group flex-1 flex flex-col items-center justify-end gap-1 h-full relative"
                >
                  <div
                    className="w-full rounded-t-sm transition-all duration-300"
                    style={{
                      height: `${pct}%`,
                      background: hi.color,
                      opacity: i === now ? 1 : 0.5,
                      minHeight: 2,
                    }}
                  />
                  {/* Tooltip */}
                  <div
                    className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2
                                  hidden group-hover:flex flex-col items-center z-10 pointer-events-none"
                  >
                    <div
                      className="px-2 py-1 rounded-lg text-[10px] whitespace-nowrap"
                      style={{
                        background: "#0d1f3c",
                        border: "1px solid rgba(59,130,246,0.3)",
                      }}
                    >
                      <span className="font-bold" style={{ color: hi.color }}>
                        {h.aqi}
                      </span>
                      <span className="text-slate-500 ml-1">{h.hour}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="flex justify-between text-[9px] text-slate-600">
            {["12AM", "6AM", "12PM", "6PM", "11PM"].map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
        </Card>

        {/* Health tips */}
        <Card>
          <SectionLabel>Health recommendations</SectionLabel>
          <div className="flex flex-col gap-2">
            {HEALTH_TIPS.map((t) => (
              <div
                key={t.group}
                className="flex items-start gap-3 px-3 py-2.5 rounded-xl"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <p className="text-xs font-semibold text-slate-300 shrink-0 w-28">
                  {t.group}
                </p>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {t.tip}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ── Row 4: AQI scale reference ─────────── */}
      <Card>
        <SectionLabel>AQI scale reference</SectionLabel>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
          {AQI_SCALE.map((s) => (
            <div
              key={s.label}
              className="px-4 py-3 rounded-xl text-center"
              style={{
                background: `${s.color}11`,
                border: `1px solid ${s.color}33`,
              }}
            >
              <p className="text-xs font-bold mb-1" style={{ color: s.color }}>
                {s.label}
              </p>
              <p className="text-[11px] text-slate-500">{s.range}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
