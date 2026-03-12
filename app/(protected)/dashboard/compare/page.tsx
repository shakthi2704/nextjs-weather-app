"use client"

import { useState } from "react"

// ── Data ───────────────────────────────────────
const ALL_CITIES = [
  {
    id: "negombo",
    name: "Negombo",
    country: "Sri Lanka",
    icon: "⛅",
    temp: 34,
    high: 36,
    low: 24,
    condition: "Partly Cloudy",
    humidity: 72,
    wind: 18,
    rain: 40,
    uv: 7,
    pressure: 1012,
    aqi: 42,
    sunrise: "6:04 AM",
    sunset: "6:21 PM",
    feelsLike: 38,
  },
  {
    id: "colombo",
    name: "Colombo",
    country: "Sri Lanka",
    icon: "🌤️",
    temp: 33,
    high: 35,
    low: 23,
    condition: "Mostly Sunny",
    humidity: 65,
    wind: 14,
    rain: 20,
    uv: 8,
    pressure: 1015,
    aqi: 55,
    sunrise: "6:04 AM",
    sunset: "6:21 PM",
    feelsLike: 36,
  },
  {
    id: "kandy",
    name: "Kandy",
    country: "Sri Lanka",
    icon: "🌦️",
    temp: 28,
    high: 30,
    low: 20,
    condition: "Light Rain",
    humidity: 82,
    wind: 22,
    rain: 60,
    uv: 3,
    pressure: 1008,
    aqi: 38,
    sunrise: "6:03 AM",
    sunset: "6:22 PM",
    feelsLike: 31,
  },
  {
    id: "tokyo",
    name: "Tokyo",
    country: "Japan",
    icon: "🌤️",
    temp: 14,
    high: 16,
    low: 8,
    condition: "Mostly Sunny",
    humidity: 48,
    wind: 20,
    rain: 10,
    uv: 4,
    pressure: 1018,
    aqi: 62,
    sunrise: "5:55 AM",
    sunset: "6:02 PM",
    feelsLike: 12,
  },
  {
    id: "london",
    name: "London",
    country: "UK",
    icon: "🌧️",
    temp: 9,
    high: 11,
    low: 5,
    condition: "Rain",
    humidity: 88,
    wind: 28,
    rain: 80,
    uv: 1,
    pressure: 1002,
    aqi: 48,
    sunrise: "6:12 AM",
    sunset: "6:18 PM",
    feelsLike: 5,
  },
  {
    id: "newyork",
    name: "New York",
    country: "USA",
    icon: "☀️",
    temp: 18,
    high: 20,
    low: 10,
    condition: "Sunny",
    humidity: 52,
    wind: 15,
    rain: 5,
    uv: 6,
    pressure: 1016,
    aqi: 71,
    sunrise: "6:55 AM",
    sunset: "7:15 PM",
    feelsLike: 16,
  },
  {
    id: "dubai",
    name: "Dubai",
    country: "UAE",
    icon: "☀️",
    temp: 38,
    high: 40,
    low: 28,
    condition: "Sunny",
    humidity: 38,
    wind: 12,
    rain: 0,
    uv: 10,
    pressure: 1010,
    aqi: 35,
    sunrise: "6:20 AM",
    sunset: "6:30 PM",
    feelsLike: 42,
  },
]

const METRICS = [
  { key: "temp", label: "Temperature", unit: "°C", icon: "🌡️", best: "none" },
  {
    key: "feelsLike",
    label: "Feels Like",
    unit: "°C",
    icon: "🤔",
    best: "none",
  },
  { key: "high", label: "High", unit: "°C", icon: "🔴", best: "none" },
  { key: "low", label: "Low", unit: "°C", icon: "🔵", best: "none" },
  { key: "humidity", label: "Humidity", unit: "%", icon: "💧", best: "low" },
  { key: "wind", label: "Wind Speed", unit: "km/h", icon: "💨", best: "low" },
  { key: "rain", label: "Rain Chance", unit: "%", icon: "🌧️", best: "low" },
  { key: "uv", label: "UV Index", unit: "/ 11", icon: "☀️", best: "low" },
  { key: "pressure", label: "Pressure", unit: "hPa", icon: "🔵", best: "none" },
  { key: "aqi", label: "Air Quality", unit: "AQI", icon: "🌿", best: "low" },
]

const SLOT_COLORS = [
  {
    border: "border-blue-500/40",
    bg: "bg-blue-500/10",
    text: "text-blue-400",
    glow: "rgba(59,130,246,0.15)",
  },
  {
    border: "border-purple-500/40",
    bg: "bg-purple-500/10",
    text: "text-purple-400",
    glow: "rgba(168,85,247,0.15)",
  },
  {
    border: "border-pink-500/40",
    bg: "bg-pink-500/10",
    text: "text-pink-400",
    glow: "rgba(236,72,153,0.15)",
  },
]

type City = (typeof ALL_CITIES)[number]

const getBestIdx = (
  cities: (City | null)[],
  key: string,
  best: string,
): number => {
  if (best === "none") return -1
  const vals = cities.map((c) => (c ? (c as any)[key] : null))
  const valid = vals.filter((v) => v !== null) as number[]
  if (!valid.length) return -1
  const target = best === "low" ? Math.min(...valid) : Math.max(...valid)
  return vals.indexOf(target)
}

export default function ComparePage() {
  const [slots, setSlots] = useState<(City | null)[]>([
    ALL_CITIES[0],
    ALL_CITIES[3],
    null,
  ])
  const [openSlot, setOpenSlot] = useState<number | null>(null)
  const [search, setSearch] = useState("")

  const selectCity = (city: City) => {
    if (openSlot === null) return
    setSlots((prev) => {
      const next = [...prev]
      next[openSlot] = city
      return next
    })
    setOpenSlot(null)
    setSearch("")
  }

  const clearSlot = (i: number) => {
    setSlots((prev) => {
      const n = [...prev]
      n[i] = null
      return n
    })
  }

  const filtered = ALL_CITIES.filter(
    (c) =>
      (c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.country.toLowerCase().includes(search.toLowerCase())) &&
      !slots.some((s) => s?.id === c.id),
  )

  const activeCount = slots.filter(Boolean).length

  return (
    <div className="flex flex-col gap-4">
      {/* ── City selector slots ───────────────── */}
      <div className="grid grid-cols-3 gap-3">
        {slots.map((city, i) => {
          const col = SLOT_COLORS[i]
          return (
            <div key={i}>
              {city ? (
                <div
                  className={`relative rounded-2xl p-5 border ${col.border} ${col.bg}`}
                >
                  <button
                    onClick={() => clearSlot(i)}
                    className="absolute top-3 right-3 w-6 h-6 rounded-lg flex items-center
                               justify-center text-slate-500 hover:text-red-400
                               hover:bg-red-500/10 transition-all text-xs"
                  >
                    ✕
                  </button>
                  <p className="text-3xl mb-2">{city.icon}</p>
                  <p
                    className={`text-sm font-bold ${col.text}`}
                    style={{ fontFamily: "var(--font-d)" }}
                  >
                    {city.name}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {city.country}
                  </p>
                  <p
                    className="text-3xl font-extrabold text-slate-100 mt-2 leading-none"
                    style={{ fontFamily: "var(--font-d)", letterSpacing: -1 }}
                  >
                    {city.temp}°
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    {city.condition}
                  </p>
                  <button
                    onClick={() => {
                      setOpenSlot(i)
                      setSearch("")
                    }}
                    className="mt-3 text-[10px] text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    Change city →
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setOpenSlot(i)
                    setSearch("")
                  }}
                  className={`w-full h-full min-h-[160px] rounded-2xl flex flex-col items-center
                               justify-center gap-2 border-2 border-dashed transition-all duration-200
                               ${
                                 openSlot === i
                                   ? `${col.border} ${col.bg}`
                                   : "border-white/10 hover:border-white/20"
                               }`}
                >
                  <span className="text-2xl text-slate-600">+</span>
                  <p className="text-xs text-slate-500">Add city</p>
                </button>
              )}
            </div>
          )
        })}
      </div>

      {/* ── City search dropdown ──────────────── */}
      {openSlot !== null && (
        <div
          className="rounded-2xl p-4"
          style={{
            background: "rgba(9,21,37,0.98)",
            border: "1px solid rgba(59,130,246,0.3)",
          }}
        >
          <p className="text-xs text-slate-400 mb-3">
            Select a city for{" "}
            <span className="text-blue-400 font-semibold">
              Slot {openSlot + 1}
            </span>
          </p>
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-xl mb-3"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <span className="text-slate-500">🔍</span>
            <input
              autoFocus
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search city…"
              className="flex-1 bg-transparent text-xs text-slate-300 placeholder-slate-600 outline-none"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {filtered.map((c) => (
              <button
                key={c.id}
                onClick={() => selectCity(c)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs
                           text-slate-300 hover:text-white transition-all duration-150
                           hover:bg-white/[0.06]"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <span>{c.icon}</span>
                <span className="font-semibold">{c.name}</span>
                <span className="text-slate-500">{c.country}</span>
                <span className="text-slate-400 ml-1">{c.temp}°</span>
              </button>
            ))}
          </div>
          <button
            onClick={() => {
              setOpenSlot(null)
              setSearch("")
            }}
            className="mt-3 text-xs text-slate-600 hover:text-slate-400 transition-colors"
          >
            Cancel
          </button>
        </div>
      )}

      {/* ── Comparison table ──────────────────── */}
      {activeCount >= 2 && (
        <div
          className="rounded-2xl overflow-hidden"
          style={{ border: "1px solid rgba(255,255,255,0.07)" }}
        >
          <table className="w-full">
            <thead>
              <tr
                style={{
                  background: "rgba(255,255,255,0.03)",
                  borderBottom: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <th
                  className="text-left text-[11px] font-semibold text-slate-500
                               uppercase tracking-wider px-5 py-3 w-36"
                >
                  Metric
                </th>
                {slots.map((city, i) =>
                  city ? (
                    <th
                      key={i}
                      className={`text-left px-5 py-3 ${SLOT_COLORS[i].text}`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{city.icon}</span>
                        <span className="text-sm font-bold">{city.name}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-normal mt-0.5">
                        {city.country}
                      </p>
                    </th>
                  ) : null,
                )}
              </tr>
            </thead>
            <tbody>
              {METRICS.map((m, mi) => {
                const bestIdx = getBestIdx(slots, m.key, m.best)
                return (
                  <tr
                    key={m.key}
                    className="transition-colors hover:bg-white/[0.02]"
                    style={{
                      borderBottom:
                        mi < METRICS.length - 1
                          ? "1px solid rgba(255,255,255,0.04)"
                          : "none",
                    }}
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{m.icon}</span>
                        <p className="text-xs text-slate-400">{m.label}</p>
                      </div>
                    </td>
                    {slots.map((city, si) =>
                      city ? (
                        <td key={si} className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <p
                              className={`text-sm font-bold ${bestIdx === si ? SLOT_COLORS[si].text : "text-slate-100"}`}
                              style={{ fontFamily: "var(--font-d)" }}
                            >
                              {(city as any)[m.key]}
                              {m.unit}
                            </p>
                            {bestIdx === si && (
                              <span
                                className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${SLOT_COLORS[si].bg} ${SLOT_COLORS[si].text} ${SLOT_COLORS[si].border} border`}
                              >
                                BEST
                              </span>
                            )}
                          </div>
                        </td>
                      ) : null,
                    )}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Placeholder when < 2 cities ──────── */}
      {activeCount < 2 && openSlot === null && (
        <div
          className="flex flex-col items-center justify-center py-16 rounded-2xl"
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <p className="text-4xl mb-3">⚖️</p>
          <p className="text-slate-300 text-sm font-semibold">
            Add at least 2 cities to compare
          </p>
          <p className="text-slate-600 text-xs mt-1">
            Click an empty slot above to get started
          </p>
        </div>
      )}
    </div>
  )
}
