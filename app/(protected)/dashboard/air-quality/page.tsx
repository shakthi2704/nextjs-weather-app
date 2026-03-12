"use client"

import { useState } from "react"

// ── Data ───────────────────────────────────────
const AQI = {
  score: 42,
  label: "Good",
  labelColor: "text-green-400",
  barColor: "bg-green-500",
  message:
    "Air quality is satisfactory. Outdoor activities are safe for everyone.",
  updatedAt: "Updated 10 min ago",
}

const POLLUTANTS = [
  {
    id: "pm25",
    label: "PM2.5",
    value: 12,
    unit: "µg/m³",
    limit: 25,
    description: "Fine particles — main contributor to haze and lung issues.",
  },
  {
    id: "pm10",
    label: "PM10",
    value: 28,
    unit: "µg/m³",
    limit: 50,
    description: "Coarse dust particles from roads, construction, and wind.",
  },
  {
    id: "o3",
    label: "O₃",
    value: 48,
    unit: "ppb",
    limit: 100,
    description:
      "Ground-level ozone formed by sunlight reacting with pollutants.",
  },
  {
    id: "no2",
    label: "NO₂",
    value: 18,
    unit: "ppb",
    limit: 53,
    description: "Nitrogen dioxide from vehicle exhaust and power plants.",
  },
  {
    id: "so2",
    label: "SO₂",
    value: 4,
    unit: "ppb",
    limit: 75,
    description: "Sulfur dioxide mainly from burning fossil fuels.",
  },
  {
    id: "co",
    label: "CO",
    value: 0.4,
    unit: "ppm",
    limit: 9,
    description: "Carbon monoxide from incomplete combustion of fuels.",
  },
]

const HOURLY_AQI = [
  { time: "12 AM", aqi: 38 },
  { time: "2 AM", aqi: 35 },
  { time: "4 AM", aqi: 33 },
  { time: "6 AM", aqi: 36 },
  { time: "8 AM", aqi: 44 },
  { time: "10 AM", aqi: 52 },
  { time: "12 PM", aqi: 58 },
  { time: "2 PM", aqi: 62 },
  { time: "4 PM", aqi: 55 },
  { time: "6 PM", aqi: 48 },
  { time: "8 PM", aqi: 44 },
  { time: "10 PM", aqi: 40 },
]

const DAILY_AQI = [
  {
    day: "Today",
    aqi: 42,
    label: "Good",
    color: "text-green-400",
    bg: "bg-green-500",
  },
  {
    day: "Wed",
    aqi: 38,
    label: "Good",
    color: "text-green-400",
    bg: "bg-green-500",
  },
  {
    day: "Thu",
    aqi: 35,
    label: "Good",
    color: "text-green-400",
    bg: "bg-green-500",
  },
  {
    day: "Fri",
    aqi: 61,
    label: "Moderate",
    color: "text-yellow-400",
    bg: "bg-yellow-500",
  },
  {
    day: "Sat",
    aqi: 88,
    label: "Moderate",
    color: "text-yellow-400",
    bg: "bg-yellow-500",
  },
  {
    day: "Sun",
    aqi: 112,
    label: "Unhealthy",
    color: "text-orange-400",
    bg: "bg-orange-500",
  },
  {
    day: "Mon",
    aqi: 74,
    label: "Moderate",
    color: "text-yellow-400",
    bg: "bg-yellow-500",
  },
]

const HEALTH_TIPS = [
  {
    icon: "🏃",
    group: "General",
    tip: "Safe for all outdoor activities today.",
  },
  {
    icon: "👶",
    group: "Children",
    tip: "No restrictions — fine for outdoor play.",
  },
  {
    icon: "🫁",
    group: "Sensitive groups",
    tip: "Unusually sensitive people should consider reducing effort.",
  },
  {
    icon: "👴",
    group: "Elderly",
    tip: "Low risk — normal activities are fine.",
  },
]

const AQI_SCALE = [
  {
    range: "0–50",
    label: "Good",
    color: "#22c55e",
    desc: "Satisfactory, minimal risk.",
  },
  {
    range: "51–100",
    label: "Moderate",
    color: "#eab308",
    desc: "Acceptable, some pollutants present.",
  },
  {
    range: "101–150",
    label: "Unhealthy*",
    color: "#f97316",
    desc: "Sensitive groups may be affected.",
  },
  {
    range: "151–200",
    label: "Unhealthy",
    color: "#ef4444",
    desc: "Everyone may experience effects.",
  },
  {
    range: "201–300",
    label: "Very Unhealthy",
    color: "#9333ea",
    desc: "Health alert — everyone affected.",
  },
  {
    range: "300+",
    label: "Hazardous",
    color: "#7f1d1d",
    desc: "Emergency conditions.",
  },
]

const getAqiColor = (aqi: number) =>
  aqi <= 50
    ? "#22c55e"
    : aqi <= 100
      ? "#eab308"
      : aqi <= 150
        ? "#f97316"
        : aqi <= 200
          ? "#ef4444"
          : aqi <= 300
            ? "#9333ea"
            : "#7f1d1d"

// ── Helpers ────────────────────────────────────
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

// ── Page ───────────────────────────────────────
export default function AirQualityPage() {
  const [activePollutant, setActivePollutant] = useState<string | null>(null)
  const maxHourly = Math.max(...HOURLY_AQI.map((h) => h.aqi))

  return (
    <div className="flex flex-col gap-4">
      {/* ── Row 1: AQI hero + 7-day ───────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-4">
        {/* AQI Hero */}
        <div
          className="rounded-2xl p-6 relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, rgba(34,197,94,0.15) 0%, rgba(9,21,37,0.95) 70%)",
            border: "1px solid rgba(34,197,94,0.2)",
          }}
        >
          <div
            className="absolute -top-10 -right-10 w-64 h-64 rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse, rgba(34,197,94,0.1) 0%, transparent 70%)",
            }}
          />
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-slate-400 text-xs mb-4">
                <span>📍</span>
                <span>Negombo, Sri Lanka</span>
                <span className="ml-2 text-slate-600">·</span>
                <span className="text-slate-500">{AQI.updatedAt}</span>
              </div>
              <div className="flex items-end gap-4">
                <span
                  className="font-extrabold leading-none"
                  style={{
                    fontFamily: "var(--font-d)",
                    fontSize: 88,
                    letterSpacing: -5,
                    color: getAqiColor(AQI.score),
                  }}
                >
                  {AQI.score}
                </span>
                <div className="pb-3">
                  <span
                    className="px-3 py-1 rounded-xl text-sm font-bold border"
                    style={{
                      color: getAqiColor(AQI.score),
                      background: "rgba(34,197,94,0.1)",
                      borderColor: "rgba(34,197,94,0.3)",
                    }}
                  >
                    {AQI.label}
                  </span>
                  <p className="text-[10px] text-slate-500 mt-1.5 uppercase tracking-wider">
                    AQI Score
                  </p>
                </div>
              </div>
              <p className="text-sm text-slate-300 mt-2 max-w-sm">
                {AQI.message}
              </p>
            </div>

            {/* AQI gauge */}
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                <svg width="140" height="80" viewBox="0 0 140 80">
                  {/* Background arc */}
                  <path
                    d="M 10 75 A 60 60 0 0 1 130 75"
                    fill="none"
                    stroke="rgba(255,255,255,0.06)"
                    strokeWidth="10"
                    strokeLinecap="round"
                  />
                  {/* Colored arc */}
                  <path
                    d="M 10 75 A 60 60 0 0 1 130 75"
                    fill="none"
                    stroke="url(#aqiGrad)"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray="188"
                    strokeDashoffset={188 - (AQI.score / 300) * 188}
                  />
                  <defs>
                    <linearGradient
                      id="aqiGrad"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="#22c55e" />
                      <stop offset="40%" stopColor="#eab308" />
                      <stop offset="70%" stopColor="#f97316" />
                      <stop offset="100%" stopColor="#ef4444" />
                    </linearGradient>
                  </defs>
                  {/* Needle dot */}
                  <circle
                    cx="70"
                    cy="75"
                    r="5"
                    fill={getAqiColor(AQI.score)}
                    style={{
                      filter: `drop-shadow(0 0 6px ${getAqiColor(AQI.score)})`,
                    }}
                  />
                </svg>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
                  <p className="text-[10px] text-slate-500">out of 300</p>
                </div>
              </div>
              <div className="text-center">
                <p className="text-xs text-slate-400">Breathing quality</p>
                <p className="text-sm font-bold text-green-400 mt-0.5">
                  Safe for all
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 7-day AQI forecast */}
        <Card>
          <SectionLabel>7-day AQI forecast</SectionLabel>
          <div className="flex flex-col gap-1.5">
            {DAILY_AQI.map((d, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-colors
                            ${i === 0 ? "bg-green-500/[0.06]" : "hover:bg-white/[0.03]"}`}
              >
                <p
                  className={`text-xs font-semibold w-9 shrink-0 ${i === 0 ? "text-green-400" : "text-slate-300"}`}
                >
                  {d.day}
                </p>
                <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${d.bg} opacity-70`}
                    style={{ width: `${(d.aqi / 150) * 100}%` }}
                  />
                </div>
                <p
                  className={`text-xs font-bold w-8 text-right shrink-0 ${d.color}`}
                  style={{ fontFamily: "var(--font-d)" }}
                >
                  {d.aqi}
                </p>
                <p className={`text-[10px] w-16 shrink-0 ${d.color}`}>
                  {d.label}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ── Row 2: Pollutants ─────────────────── */}
      <Card>
        <SectionLabel>Pollutant breakdown</SectionLabel>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
          {POLLUTANTS.map((p) => {
            const pct = Math.min((p.value / p.limit) * 100, 100)
            const isActive = activePollutant === p.id
            const safe = pct < 60
            return (
              <button
                key={p.id}
                onClick={() => setActivePollutant(isActive ? null : p.id)}
                className={`flex flex-col gap-2 p-4 rounded-xl text-left transition-all duration-200 border
                            ${
                              isActive
                                ? "border-blue-500/40 bg-blue-500/[0.08]"
                                : "border-white/[0.06] bg-white/[0.02] hover:border-white/15"
                            }`}
              >
                <p className="text-[10px] text-slate-500 uppercase tracking-wider">
                  {p.label}
                </p>
                <p
                  className="text-xl font-extrabold text-slate-100 leading-none"
                  style={{ fontFamily: "var(--font-d)" }}
                >
                  {p.value}
                  <span className="text-xs font-normal text-slate-500 ml-1">
                    {p.unit}
                  </span>
                </p>
                <div className="w-full h-1 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${safe ? "bg-green-500" : "bg-orange-500"}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <p
                  className={`text-[10px] ${safe ? "text-green-400" : "text-orange-400"}`}
                >
                  {pct < 40 ? "Good" : pct < 70 ? "Moderate" : "High"}
                </p>
              </button>
            )
          })}
        </div>

        {/* Expanded description */}
        {activePollutant &&
          (() => {
            const p = POLLUTANTS.find((p) => p.id === activePollutant)!
            return (
              <div
                className="mt-3 px-4 py-3 rounded-xl text-xs text-slate-300 leading-relaxed"
                style={{
                  background: "rgba(59,130,246,0.06)",
                  border: "1px solid rgba(59,130,246,0.15)",
                }}
              >
                <span className="font-semibold text-blue-400">
                  {p.label} —{" "}
                </span>
                {p.description} Current level:{" "}
                <span className="font-semibold text-slate-100">
                  {p.value} {p.unit}
                </span>{" "}
                (limit: {p.limit} {p.unit})
              </div>
            )
          })()}
      </Card>

      {/* ── Row 3: Hourly chart + Health tips ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Hourly AQI chart */}
        <Card>
          <SectionLabel>AQI trend today</SectionLabel>
          <div className="flex items-end gap-1.5 h-28 mb-2">
            {HOURLY_AQI.map((h, i) => (
              <div
                key={i}
                className="flex-1 flex flex-col items-center justify-end h-full group"
              >
                <div
                  className="relative w-full rounded-t-lg transition-all duration-300 cursor-pointer"
                  style={{
                    height: `${(h.aqi / maxHourly) * 100}%`,
                    background: getAqiColor(h.aqi),
                    opacity: 0.7,
                    minHeight: 4,
                  }}
                >
                  {/* Tooltip */}
                  <div
                    className="absolute -top-7 left-1/2 -translate-x-1/2 hidden group-hover:block
                                  px-1.5 py-0.5 rounded text-[10px] font-bold text-slate-100 whitespace-nowrap z-10"
                    style={{
                      background: "rgba(9,21,37,0.95)",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    {h.aqi}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between">
            {HOURLY_AQI.filter((_, i) => i % 3 === 0).map((h) => (
              <p key={h.time} className="text-[10px] text-slate-600">
                {h.time}
              </p>
            ))}
          </div>
          <div
            className="flex items-center justify-between mt-3 pt-3"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
          >
            <p className="text-xs text-slate-400">Daily peak</p>
            <p
              className="text-sm font-bold text-yellow-400"
              style={{ fontFamily: "var(--font-d)" }}
            >
              {maxHourly} AQI at{" "}
              {HOURLY_AQI.find((h) => h.aqi === maxHourly)?.time}
            </p>
          </div>
        </Card>

        {/* Health tips */}
        <Card>
          <SectionLabel>Health recommendations</SectionLabel>
          <div className="flex flex-col gap-2">
            {HEALTH_TIPS.map((t, i) => (
              <div
                key={i}
                className="flex items-start gap-3 px-3.5 py-3 rounded-xl"
                style={{
                  background: "rgba(34,197,94,0.06)",
                  border: "1px solid rgba(34,197,94,0.12)",
                }}
              >
                <span className="text-lg shrink-0">{t.icon}</span>
                <div>
                  <p className="text-[10px] text-green-500 font-semibold uppercase tracking-wider mb-0.5">
                    {t.group}
                  </p>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {t.tip}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ── Row 4: AQI scale reference ────────── */}
      <Card>
        <SectionLabel>AQI scale reference</SectionLabel>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-2">
          {AQI_SCALE.map((s, i) => (
            <div
              key={i}
              className={`px-3 py-3 rounded-xl border transition-all
                          ${
                            AQI.score >= parseInt(s.range) &&
                            AQI.score <=
                              parseInt(s.range.split("–")[1] || "999")
                              ? "border-white/20 bg-white/[0.05]"
                              : "border-white/[0.06]"
                          }`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <div
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ background: s.color }}
                />
                <p className="text-xs font-semibold text-slate-200">
                  {s.label}
                </p>
              </div>
              <p className="text-[10px] text-slate-500 mb-1">{s.range}</p>
              <p className="text-[10px] text-slate-500 leading-relaxed">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
