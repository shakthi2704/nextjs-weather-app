"use client"

import { useState } from "react"
import Link from "next/link"

// ── Data ───────────────────────────────────────
const INITIAL_FAVORITES = [
  {
    id: 1,
    name: "Negombo",
    country: "Sri Lanka",
    code: "LK",
    icon: "⛅",
    temp: 34,
    high: 36,
    low: 24,
    condition: "Partly Cloudy",
    humidity: 72,
    wind: 18,
    rain: 40,
    uv: 7,
    aqi: 42,
  },
  {
    id: 2,
    name: "Colombo",
    country: "Sri Lanka",
    code: "LK",
    icon: "🌤️",
    temp: 33,
    high: 35,
    low: 23,
    condition: "Mostly Sunny",
    humidity: 65,
    wind: 14,
    rain: 20,
    uv: 8,
    aqi: 55,
  },
  {
    id: 3,
    name: "Kandy",
    country: "Sri Lanka",
    code: "LK",
    icon: "🌦️",
    temp: 28,
    high: 30,
    low: 20,
    condition: "Light Rain",
    humidity: 82,
    wind: 22,
    rain: 60,
    uv: 3,
    aqi: 38,
  },
  {
    id: 4,
    name: "Galle",
    country: "Sri Lanka",
    code: "LK",
    icon: "⛅",
    temp: 31,
    high: 33,
    low: 22,
    condition: "Partly Cloudy",
    humidity: 74,
    wind: 16,
    rain: 30,
    uv: 6,
    aqi: 44,
  },
  {
    id: 5,
    name: "Tokyo",
    country: "Japan",
    code: "JP",
    icon: "🌤️",
    temp: 14,
    high: 16,
    low: 8,
    condition: "Mostly Sunny",
    humidity: 48,
    wind: 20,
    rain: 10,
    uv: 4,
    aqi: 62,
  },
  {
    id: 6,
    name: "London",
    country: "UK",
    code: "GB",
    icon: "🌧️",
    temp: 9,
    high: 11,
    low: 5,
    condition: "Rain",
    humidity: 88,
    wind: 28,
    rain: 80,
    uv: 1,
    aqi: 48,
  },
  {
    id: 7,
    name: "New York",
    country: "USA",
    code: "US",
    icon: "☀️",
    temp: 18,
    high: 20,
    low: 10,
    condition: "Sunny",
    humidity: 52,
    wind: 15,
    rain: 5,
    uv: 6,
    aqi: 71,
  },
  {
    id: 8,
    name: "Dubai",
    country: "UAE",
    code: "AE",
    icon: "☀️",
    temp: 38,
    high: 40,
    low: 28,
    condition: "Sunny",
    humidity: 38,
    wind: 12,
    rain: 0,
    uv: 10,
    aqi: 35,
  },
]

const SUGGESTIONS = [
  { name: "Singapore", country: "Singapore", code: "SG", icon: "🌦️", temp: 30 },
  { name: "Sydney", country: "Australia", code: "AU", icon: "☀️", temp: 24 },
  { name: "Paris", country: "France", code: "FR", icon: "⛅", temp: 12 },
  { name: "Mumbai", country: "India", code: "IN", icon: "🌤️", temp: 36 },
]

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
      : {
          label: "Unhealthy",
          color: "text-orange-400",
          bg: "bg-orange-500/10 border-orange-500/20",
        }

// ── Page ───────────────────────────────────────
export default function FavoritesPage() {
  const [favorites, setFavorites] = useState(INITIAL_FAVORITES)
  const [search, setSearch] = useState("")
  const [view, setView] = useState<"grid" | "list">("grid")

  const removeFavorite = (id: number) =>
    setFavorites((prev) => prev.filter((f) => f.id !== id))

  const filtered = favorites.filter(
    (f) =>
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.country.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="flex flex-col gap-4">
      {/* ── Header row ────────────────────────── */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        {/* Search */}
        <div
          className="flex items-center gap-2 px-3 py-2.5 rounded-xl flex-1 max-w-xs"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <span className="text-slate-500 text-sm">🔍</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search favourites…"
            className="flex-1 bg-transparent text-xs text-slate-300 placeholder-slate-600 outline-none"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="text-slate-500 hover:text-slate-300 text-xs"
            >
              ✕
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div
            className="flex rounded-xl overflow-hidden"
            style={{ border: "1px solid rgba(255,255,255,0.08)" }}
          >
            {(["grid", "list"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3 py-2 text-xs font-semibold transition-colors
                            ${
                              view === v
                                ? "bg-blue-500/20 text-blue-400"
                                : "bg-transparent text-slate-500 hover:text-slate-300"
                            }`}
              >
                {v === "grid" ? "⊞ Grid" : "☰ List"}
              </button>
            ))}
          </div>

          <span className="text-xs text-slate-500">
            {favorites.length} saved
          </span>
        </div>
      </div>

      {/* ── Favourites grid / list ────────────── */}
      {filtered.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-20 rounded-2xl"
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <p className="text-4xl mb-3">🔍</p>
          <p className="text-slate-400 text-sm font-semibold">
            No results for "{search}"
          </p>
          <p className="text-slate-600 text-xs mt-1">
            Try a different city or country name
          </p>
        </div>
      ) : view === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
          {filtered.map((fav) => {
            const aqi = getAqiLabel(fav.aqi)
            return (
              <div
                key={fav.id}
                className="group relative rounded-2xl p-5 transition-all duration-200
                           hover:-translate-y-0.5"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                {/* Remove button */}
                <button
                  onClick={() => removeFavorite(fav.id)}
                  className="absolute top-3 right-3 w-6 h-6 rounded-lg flex items-center justify-center
                             text-slate-600 hover:text-red-400 hover:bg-red-500/10
                             opacity-0 group-hover:opacity-100 transition-all text-xs"
                >
                  ✕
                </button>

                {/* Location */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p
                      className="text-sm font-bold text-slate-100"
                      style={{ fontFamily: "var(--font-d)" }}
                    >
                      {fav.name}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      {fav.country}
                    </p>
                  </div>
                  <span className="text-3xl">{fav.icon}</span>
                </div>

                {/* Temp */}
                <div className="flex items-end gap-2 mb-3">
                  <span
                    className="font-extrabold text-slate-100 leading-none"
                    style={{
                      fontFamily: "var(--font-d)",
                      fontSize: 44,
                      letterSpacing: -2,
                    }}
                  >
                    {fav.temp}°
                  </span>
                  <div className="pb-1.5">
                    <p className="text-[10px] text-slate-500 leading-none">
                      {fav.condition}
                    </p>
                    <div className="flex gap-1.5 mt-1">
                      <span className="text-[10px] text-red-400">
                        ↑{fav.high}°
                      </span>
                      <span className="text-[10px] text-blue-400">
                        ↓{fav.low}°
                      </span>
                    </div>
                  </div>
                </div>

                {/* Stats strip */}
                <div className="flex gap-2 mb-3">
                  {[
                    { icon: "💧", v: `${fav.rain}%` },
                    { icon: "💨", v: `${fav.wind}km/h` },
                    { icon: "💦", v: `${fav.humidity}%` },
                  ].map((s) => (
                    <div
                      key={s.icon}
                      className="flex-1 flex flex-col items-center py-1.5 rounded-lg"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.06)",
                      }}
                    >
                      <span className="text-sm">{s.icon}</span>
                      <p className="text-[10px] text-slate-400 mt-0.5">{s.v}</p>
                    </div>
                  ))}
                </div>

                {/* AQI badge + link */}
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-lg border ${aqi.bg} ${aqi.color}`}
                  >
                    AQI {fav.aqi} · {aqi.label}
                  </span>
                  <Link
                    href="/dashboard/forecast"
                    className="text-[10px] text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Forecast →
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        /* List view */
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
                {[
                  "Location",
                  "Condition",
                  "Temp",
                  "H / L",
                  "Rain",
                  "Wind",
                  "Humidity",
                  "AQI",
                  "",
                ].map((col) => (
                  <th
                    key={col}
                    className="text-left text-[11px] font-semibold text-slate-500
                                 uppercase tracking-wider px-4 py-3 whitespace-nowrap"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((fav, i) => {
                const aqi = getAqiLabel(fav.aqi)
                return (
                  <tr
                    key={fav.id}
                    className="hover:bg-white/[0.02] transition-colors group"
                    style={{
                      borderBottom:
                        i < filtered.length - 1
                          ? "1px solid rgba(255,255,255,0.04)"
                          : "none",
                    }}
                  >
                    <td className="px-4 py-3">
                      <p className="text-xs font-bold text-slate-100">
                        {fav.name}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        {fav.country}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{fav.icon}</span>
                        <p className="text-xs text-slate-400 hidden md:block">
                          {fav.condition}
                        </p>
                      </div>
                    </td>
                    <td
                      className="px-4 py-3 text-sm font-bold text-slate-100"
                      style={{ fontFamily: "var(--font-d)" }}
                    >
                      {fav.temp}°C
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-red-400">↑{fav.high}°</span>
                      <span className="text-xs text-slate-600 mx-1">/</span>
                      <span className="text-xs text-blue-400">↓{fav.low}°</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-400">
                      {fav.rain}%
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-400">
                      {fav.wind} km/h
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-400">
                      {fav.humidity}%
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-lg border ${aqi.bg} ${aqi.color}`}
                      >
                        {fav.aqi} · {aqi.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => removeFavorite(fav.id)}
                        className="text-slate-600 hover:text-red-400 text-xs opacity-0 group-hover:opacity-100 transition-all"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Suggestions ───────────────────────── */}
      <div
        className="rounded-2xl p-5"
        style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-3">
          Suggested cities
        </p>
        <div className="flex gap-2 flex-wrap">
          {SUGGESTIONS.map((s) => (
            <button
              key={s.name}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs
                         text-slate-400 hover:text-slate-200 transition-all duration-200
                         hover:border-white/15"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <span>{s.icon}</span>
              <span>{s.name}</span>
              <span className="text-slate-600">{s.temp}°</span>
              <span className="text-blue-500 text-[10px] ml-1">+ Add</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
