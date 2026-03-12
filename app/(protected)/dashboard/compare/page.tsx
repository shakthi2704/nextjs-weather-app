// src/app/(protected)/dashboard/compare/page.tsx
"use client"

import { useState, useEffect } from "react"
import type { WeatherData } from "@/types"

// ── City slots config ──────────────────────────
const SLOT_COLORS = [
  {
    accent: "#3b82f6",
    bg: "rgba(59,130,246,0.08)",
    border: "rgba(59,130,246,0.25)",
  },
  {
    accent: "#a855f7",
    bg: "rgba(168,85,247,0.08)",
    border: "rgba(168,85,247,0.25)",
  },
  {
    accent: "#ec4899",
    bg: "rgba(236,72,153,0.08)",
    border: "rgba(236,72,153,0.25)",
  },
]

// ── Comparison metrics ─────────────────────────
const METRICS = [
  { key: "temp", label: "Temperature", unit: "°C", icon: "🌡️", best: "none" },
  {
    key: "feelsLike",
    label: "Feels Like",
    unit: "°C",
    icon: "🤔",
    best: "none",
  },
  { key: "tempMax", label: "Day High", unit: "°C", icon: "↑", best: "high" },
  { key: "tempMin", label: "Day Low", unit: "°C", icon: "↓", best: "low" },
  { key: "humidity", label: "Humidity", unit: "%", icon: "💧", best: "low" },
  {
    key: "windSpeed",
    label: "Wind Speed",
    unit: "km/h",
    icon: "💨",
    best: "low",
  },
  { key: "uvIndex", label: "UV Index", unit: "", icon: "☀️", best: "low" },
  {
    key: "pressure",
    label: "Pressure",
    unit: " hPa",
    icon: "🔵",
    best: "none",
  },
  {
    key: "visibility",
    label: "Visibility",
    unit: " km",
    icon: "👁️",
    best: "high",
  },
  {
    key: "cloudCover",
    label: "Cloud Cover",
    unit: "%",
    icon: "☁️",
    best: "low",
  },
]

const Skeleton = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse rounded-xl bg-white/5 ${className}`} />
)

interface CityResult {
  cityName: string
  country: string
  lat: number
  lon: number
}

interface Slot {
  city: CityResult | null
  weather: WeatherData | null
  loading: boolean
}

export default function ComparePage() {
  const [slots, setSlots] = useState<Slot[]>([
    { city: null, weather: null, loading: false },
    { city: null, weather: null, loading: false },
    { city: null, weather: null, loading: false },
  ])
  const [openSlot, setOpenSlot] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<CityResult[]>([])
  const [searching, setSearching] = useState(false)

  // ── Real-time geocoding search ─────────────
  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([])
      return
    }

    const timer = setTimeout(async () => {
      setSearching(true)
      try {
        const res = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchQuery)}&count=8&language=en&format=json`,
        )
        const data = await res.json()
        setSearchResults(
          (data.results ?? []).map((r: any) => ({
            cityName: r.name,
            country: r.country ?? "",
            lat: r.latitude,
            lon: r.longitude,
          })),
        )
      } catch {
        setSearchResults([])
      } finally {
        setSearching(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // ── Select city for a slot ─────────────────
  const selectCity = async (slotIdx: number, city: CityResult) => {
    setOpenSlot(null)
    setSearchQuery("")
    setSearchResults([])

    setSlots((prev) =>
      prev.map((s, i) =>
        i === slotIdx ? { city, weather: null, loading: true } : s,
      ),
    )

    try {
      const params = new URLSearchParams({
        lat: String(city.lat),
        lon: String(city.lon),
        city: city.cityName,
        country: city.country,
        timezone: "auto",
      })
      const res = await fetch(`/api/weather?${params}`)
      const data = await res.json()
      setSlots((prev) =>
        prev.map((s, i) =>
          i === slotIdx ? { city, weather: data, loading: false } : s,
        ),
      )
    } catch {
      setSlots((prev) =>
        prev.map((s, i) =>
          i === slotIdx ? { city, weather: null, loading: false } : s,
        ),
      )
    }
  }

  // ── Clear a slot ───────────────────────────
  const clearSlot = (idx: number) => {
    setSlots((prev) =>
      prev.map((s, i) =>
        i === idx ? { city: null, weather: null, loading: false } : s,
      ),
    )
  }

  // ── Get best value index per metric ────────
  const getBestIdx = (key: string, best: string) => {
    if (best === "none") return -1
    const values = slots
      .map(
        (s) =>
          s.weather?.current[key as keyof typeof s.weather.current] as number,
      )
      .filter((v) => v !== undefined && v !== null)
    if (values.length < 2) return -1
    const target = best === "high" ? Math.max(...values) : Math.min(...values)
    return slots.findIndex(
      (s) =>
        (s.weather?.current[
          key as keyof typeof s.weather.current
        ] as number) === target,
    )
  }

  const filledSlots = slots.filter((s) => s.weather).length

  return (
    <div className="flex flex-col gap-4">
      {/* ── Header ────────────────────────────── */}
      <div>
        <h1
          className="text-xl font-bold text-slate-100"
          style={{ fontFamily: "var(--font-d)" }}
        >
          Compare Cities
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Select up to 3 cities to compare weather side by side
        </p>
      </div>

      {/* ── City slots ────────────────────────── */}
      <div className="grid grid-cols-3 gap-4">
        {slots.map((slot, idx) => {
          const color = SLOT_COLORS[idx]
          const isOpen = openSlot === idx

          return (
            <div key={idx} className="relative">
              <div
                className="rounded-2xl p-4 transition-all duration-200"
                style={{
                  background: slot.city ? color.bg : "rgba(255,255,255,0.02)",
                  border: slot.city
                    ? `1px solid ${color.border}`
                    : "1px dashed rgba(255,255,255,0.1)",
                  minHeight: 160,
                }}
              >
                {slot.loading ? (
                  <div className="flex flex-col gap-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-12 w-16 mt-2" />
                    <Skeleton className="h-3 w-32" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                ) : slot.weather ? (
                  <>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p
                          className="text-sm font-bold"
                          style={{
                            fontFamily: "var(--font-d)",
                            color: color.accent,
                          }}
                        >
                          {slot.city?.cityName}
                        </p>
                        <p className="text-xs text-slate-500">
                          {slot.city?.country}
                        </p>
                      </div>
                      <button
                        onClick={() => clearSlot(idx)}
                        className="text-slate-600 hover:text-red-400 transition-colors
                                   text-xs px-1.5 py-1 rounded-lg hover:bg-red-500/10"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">
                        {slot.weather.current.conditionIcon}
                      </span>
                      <div>
                        <p
                          className="text-3xl font-black text-slate-100"
                          style={{
                            fontFamily: "var(--font-d)",
                            letterSpacing: -1,
                          }}
                        >
                          {slot.weather.current.temp}°C
                        </p>
                        <p className="text-xs text-slate-400">
                          {slot.weather.current.conditionText}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <span className="text-xs text-red-400">
                        ↑ {slot.weather.current.tempMax}°
                      </span>
                      <span className="text-xs text-blue-400">
                        ↓ {slot.weather.current.tempMin}°
                      </span>
                      <span className="text-xs text-slate-500">
                        · {slot.weather.current.humidity}% humidity
                      </span>
                    </div>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setOpenSlot(isOpen ? null : idx)
                      setSearchQuery("")
                      setSearchResults([])
                    }}
                    className="w-full h-full flex flex-col items-center justify-center gap-2
                               min-h-[120px] transition-colors hover:bg-white/[0.03] rounded-xl"
                  >
                    <span className="text-3xl opacity-30">＋</span>
                    <p className="text-xs text-slate-600">Add city</p>
                  </button>
                )}

                {slot.weather && (
                  <button
                    onClick={() => {
                      setOpenSlot(isOpen ? null : idx)
                      setSearchQuery("")
                      setSearchResults([])
                    }}
                    className="mt-3 w-full py-1.5 rounded-xl text-xs font-medium transition-all
                               text-slate-500 hover:text-slate-300"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    Change city
                  </button>
                )}
              </div>

              {/* Search dropdown */}
              {isOpen && (
                <div
                  className="absolute top-full mt-2 left-0 right-0 z-50 rounded-2xl overflow-hidden"
                  style={{
                    background: "rgba(9,21,37,0.98)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    backdropFilter: "blur(24px)",
                    boxShadow: "0 16px 48px rgba(0,0,0,0.5)",
                  }}
                >
                  <div className="p-3 border-b border-white/[0.06]">
                    <input
                      type="text"
                      autoFocus
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search any city worldwide…"
                      className="w-full bg-white/5 rounded-xl px-3 py-2 text-sm text-slate-300
                                 placeholder-slate-600 outline-none border border-white/10"
                    />
                  </div>
                  <div
                    className="max-h-48 overflow-y-auto"
                    style={{ scrollbarWidth: "none" }}
                  >
                    {searching && (
                      <div className="flex items-center justify-center gap-2 py-4">
                        <span
                          className="w-3 h-3 border border-blue-400/30 border-t-blue-400
                                         rounded-full animate-spin"
                        />
                        <p className="text-xs text-slate-500">Searching…</p>
                      </div>
                    )}

                    {!searching && searchQuery.length < 2 && (
                      <p className="text-xs text-slate-600 text-center py-4">
                        Type at least 2 characters…
                      </p>
                    )}

                    {!searching &&
                      searchQuery.length >= 2 &&
                      searchResults
                        .filter(
                          (c) =>
                            !slots.some(
                              (s, i) =>
                                i !== idx && s.city?.cityName === c.cityName,
                            ),
                        )
                        .map((city) => (
                          <button
                            key={`${city.cityName}-${city.lat}`}
                            onClick={() => selectCity(idx, city)}
                            className="w-full flex items-center justify-between px-4 py-2.5
                                     hover:bg-white/[0.05] transition-colors text-left"
                          >
                            <span className="text-sm text-slate-300 font-medium">
                              {city.cityName}
                            </span>
                            <span className="text-xs text-slate-600">
                              {city.country}
                            </span>
                          </button>
                        ))}

                    {!searching &&
                      searchQuery.length >= 2 &&
                      searchResults.length === 0 && (
                        <p className="text-xs text-slate-600 text-center py-4">
                          No cities found
                        </p>
                      )}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* ── Placeholder when < 2 cities ────────── */}
      {filledSlots < 2 && (
        <div
          className="flex flex-col items-center justify-center py-12 rounded-2xl gap-3"
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px dashed rgba(255,255,255,0.07)",
          }}
        >
          <p className="text-3xl">🌍</p>
          <p className="text-slate-400 font-semibold text-sm">
            Select at least 2 cities to compare
          </p>
          <p className="text-slate-600 text-xs">
            Click the + cards above to get started
          </p>
        </div>
      )}

      {/* ── Comparison table ─────────────────── */}
      {filledSlots >= 2 && (
        <div
          className="rounded-2xl overflow-hidden"
          style={{ border: "1px solid rgba(255,255,255,0.07)" }}
        >
          <table className="w-full text-sm">
            <thead>
              <tr
                style={{
                  background: "rgba(255,255,255,0.03)",
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <th className="text-left px-5 py-3 text-[10px] text-slate-500 uppercase tracking-wider font-semibold w-36">
                  Metric
                </th>
                {slots.map((slot, idx) => (
                  <th key={idx} className="text-center px-4 py-3">
                    {slot.city ? (
                      <div>
                        <p
                          className="text-sm font-bold"
                          style={{ color: SLOT_COLORS[idx].accent }}
                        >
                          {slot.city.cityName}
                        </p>
                        <p className="text-[10px] text-slate-600">
                          {slot.city.country}
                        </p>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-700">—</p>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {METRICS.map((metric) => {
                const bestIdx = getBestIdx(metric.key, metric.best)
                return (
                  <tr
                    key={metric.key}
                    className="transition-colors hover:bg-white/[0.02]"
                    style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{metric.icon}</span>
                        <span className="text-xs text-slate-400">
                          {metric.label}
                        </span>
                      </div>
                    </td>
                    {slots.map((slot, sIdx) => {
                      const val =
                        slot.weather?.current[
                          metric.key as keyof typeof slot.weather.current
                        ]
                      const isBest = bestIdx === sIdx
                      const color = SLOT_COLORS[sIdx]
                      return (
                        <td key={sIdx} className="px-4 py-3 text-center">
                          {slot.loading ? (
                            <Skeleton className="h-4 w-12 mx-auto" />
                          ) : val !== undefined && val !== null ? (
                            <div className="flex items-center justify-center gap-1.5">
                              <span
                                className="text-sm font-bold"
                                style={{
                                  fontFamily: "var(--font-d)",
                                  color: isBest ? color.accent : "#e2e8f0",
                                }}
                              >
                                {val}
                                {metric.unit}
                              </span>
                              {isBest && (
                                <span
                                  className="text-[9px] font-bold px-1.5 py-0.5 rounded-md"
                                  style={{
                                    background: color.bg,
                                    color: color.accent,
                                    border: `1px solid ${color.border}`,
                                  }}
                                >
                                  BEST
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-slate-700 text-xs">—</span>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
