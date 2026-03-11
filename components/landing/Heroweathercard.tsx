"use client"

import { useState } from "react"

// ── Types ──────────────────────────────────────
interface HourData {
  time: string
  icon: string
  tempC: number
  tempF: number
  rain: number
  isNow?: boolean
}

interface DayData {
  day: string
  icon: string
  highC: number
  highF: number
  lowC: number
  lowF: number
  rain: number
}

// ── Static demo data ───────────────────────────
const HOURLY: HourData[] = [
  { time: "2 AM", icon: "🌙", tempC: 26, tempF: 79, rain: 5 },
  { time: "5 AM", icon: "🌙", tempC: 24, tempF: 75, rain: 8 },
  { time: "8 AM", icon: "⛅", tempC: 27, tempF: 81, rain: 12 },
  { time: "11 AM", icon: "🌤️", tempC: 32, tempF: 90, rain: 20 },
  { time: "2 PM", icon: "⛅", tempC: 34, tempF: 93, rain: 35, isNow: true },
  { time: "5 PM", icon: "🌦️", tempC: 32, tempF: 90, rain: 45 },
  { time: "8 PM", icon: "🌧️", tempC: 28, tempF: 82, rain: 60 },
  { time: "11 PM", icon: "🌧️", tempC: 26, tempF: 79, rain: 40 },
]

const DAILY: DayData[] = [
  {
    day: "Today",
    icon: "⛅",
    highC: 34,
    highF: 93,
    lowC: 24,
    lowF: 75,
    rain: 35,
  },
  {
    day: "Wed",
    icon: "🌤️",
    highC: 35,
    highF: 95,
    lowC: 24,
    lowF: 75,
    rain: 15,
  },
  {
    day: "Thu",
    icon: "⛅",
    highC: 34,
    highF: 93,
    lowC: 24,
    lowF: 75,
    rain: 30,
  },
  { day: "Fri", icon: "☀️", highC: 33, highF: 91, lowC: 24, lowF: 75, rain: 5 },
  {
    day: "Sat",
    icon: "🌦️",
    highC: 32,
    highF: 90,
    lowC: 25,
    lowF: 77,
    rain: 55,
  },
]

const STATS = [
  { label: "Humidity", value: "72%", icon: "💧" },
  { label: "Wind", value: "14 km/h SW", icon: "💨" },
  { label: "UV Index", value: "8 · High", icon: "☀️" },
  { label: "Visibility", value: "10 km", icon: "👁️" },
]

// ── Component ──────────────────────────────────
const HeroWeatherCard = () => {
  const [unit, setUnit] = useState<"C" | "F">("C")
  const isC = unit === "C"

  const fmt = (c: number, f: number) => `${isC ? c : f}°`

  return (
    <div className="relative z-10 w-full max-w-4xl mx-auto px-4 pb-20">
      <div
        className="rounded-3xl overflow-hidden border border-white/10
                   transition-transform duration-300 hover:-translate-y-1"
        style={{
          background: "rgba(9,21,37,0.75)",
          backdropFilter: "blur(32px)",
          boxShadow:
            "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)",
        }}
      >
        {/* ── Top: current + forecast ──────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Left — current weather */}
          <div className="p-7 border-b md:border-b-0 md:border-r border-white/5">
            {/* Location + date */}
            <div className="flex items-center gap-1.5 text-slate-400 text-sm mb-5">
              <span>📍</span>
              <span>Negombo, Sri Lanka</span>
              <span className="text-slate-600 mx-1">·</span>
              <span>Tuesday, March 10</span>
            </div>

            {/* Temperature */}
            <div className="flex items-end gap-4 mb-3">
              <span
                className="font-extrabold text-slate-100 leading-none cursor-pointer
                           select-none transition-all duration-200 hover:opacity-80"
                style={{
                  fontFamily: "var(--font-d)",
                  fontSize: 80,
                  letterSpacing: -4,
                }}
                onClick={() => setUnit(isC ? "F" : "C")}
              >
                {isC ? "34°" : "93°"}
              </span>

              <div className="pb-3 flex flex-col gap-2">
                {/* Unit toggle */}
                <div className="flex items-center gap-0.5 bg-white/5 rounded-lg p-0.5">
                  {(["C", "F"] as const).map((u) => (
                    <button
                      key={u}
                      onClick={() => setUnit(u)}
                      className={`px-2.5 py-1 rounded-md text-xs font-bold
                                  transition-all duration-200 cursor-pointer
                                  ${
                                    unit === u
                                      ? "bg-blue-500 text-white"
                                      : "text-slate-400 hover:text-slate-200"
                                  }`}
                    >
                      °{u}
                    </button>
                  ))}
                </div>

                {/* H/L badges */}
                <div className="flex gap-1.5">
                  <span
                    className="px-2 py-0.5 rounded-lg text-xs font-semibold
                                   bg-red-500/10 text-red-400 border border-red-500/20"
                  >
                    ↑ {fmt(36, 97)}
                  </span>
                  <span
                    className="px-2 py-0.5 rounded-lg text-xs font-semibold
                                   bg-blue-500/10 text-blue-400 border border-blue-500/20"
                  >
                    ↓ {fmt(24, 75)}
                  </span>
                </div>

                <p className="text-xs text-slate-500">
                  Feels like {fmt(38, 100)}
                </p>
              </div>
            </div>

            {/* Condition */}
            <p
              className="font-semibold text-lg text-slate-200 mb-1"
              style={{ fontFamily: "var(--font-d)" }}
            >
              ⛅ Partly Cloudy
            </p>
            <p className="text-sm text-slate-400 leading-relaxed mb-5">
              Intervals of clouds and sun with a couple of afternoon showers
            </p>

            {/* Quick stats */}
            <div className="grid grid-cols-2 gap-3 pt-5 border-t border-white/5">
              {STATS.map((s) => (
                <div key={s.label} className="flex items-center gap-2">
                  <span className="text-base">{s.icon}</span>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">
                      {s.label}
                    </p>
                    <p
                      className="text-sm font-semibold text-slate-100"
                      style={{ fontFamily: "var(--font-d)" }}
                    >
                      {s.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — 5-day forecast */}
          <div className="p-7">
            <p
              className="text-[11px] font-semibold text-slate-500
                          uppercase tracking-widest mb-4"
            >
              5-Day Forecast
            </p>
            <div className="flex flex-col gap-1.5">
              {DAILY.map((d, i) => (
                <div
                  key={d.day}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl
                              cursor-pointer transition-all duration-200
                              ${
                                i === 0
                                  ? "bg-blue-500/15 border border-blue-500/25"
                                  : "hover:bg-white/5 border border-transparent"
                              }`}
                >
                  <span
                    className={`text-sm font-medium w-12
                                    ${i === 0 ? "text-blue-400" : "text-slate-300"}`}
                  >
                    {d.day}
                  </span>
                  <span className="text-xl">{d.icon}</span>
                  <div className="flex items-center gap-2 text-sm">
                    <span
                      className="font-bold text-slate-100"
                      style={{ fontFamily: "var(--font-d)" }}
                    >
                      {fmt(d.highC, d.highF)}
                    </span>
                    <span className="text-slate-500">
                      {fmt(d.lowC, d.lowF)}
                    </span>
                  </div>
                  <span className="text-xs text-blue-400">💧{d.rain}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Hourly strip ─────────────────── */}
        <div className="border-t border-white/5 flex overflow-x-auto scrollbar-hide">
          {HOURLY.map((h) => (
            <div
              key={h.time}
              className={`flex-1 min-w-[80px] px-3 py-4 text-center
                          border-r border-white/5 last:border-r-0
                          cursor-pointer transition-all duration-200
                          ${
                            h.isNow
                              ? "bg-blue-500/15 border-blue-500/30"
                              : "hover:bg-white/5"
                          }`}
            >
              <p className="text-[11px] text-slate-500 mb-2">{h.time}</p>
              <p className="text-xl mb-2">{h.icon}</p>
              <p
                className="text-sm font-bold text-slate-100 mb-1"
                style={{ fontFamily: "var(--font-d)" }}
              >
                {fmt(h.tempC, h.tempF)}
              </p>
              <p className="text-[10px] text-blue-400">💧{h.rain}%</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default HeroWeatherCard
