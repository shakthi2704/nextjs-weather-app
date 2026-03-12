// src/app/(protected)/dashboard/favorites/page.tsx
"use client"

import { useState, useEffect } from "react"
import type { CurrentWeather } from "@/types"

interface Favorite {
  id: string
  cityName: string
  country: string
  lat: number
  lon: number
  timezone: string | null
}

interface FavoriteWithWeather extends Favorite {
  weather?: CurrentWeather
  loading: boolean
  error: boolean
}

// ── Suggested cities to add ────────────────────
const SUGGESTIONS = [
  { cityName: "London", country: "UK", lat: 51.51, lon: -0.13 },
  { cityName: "New York", country: "US", lat: 40.71, lon: -74.01 },
  { cityName: "Tokyo", country: "Japan", lat: 35.68, lon: 139.69 },
  { cityName: "Dubai", country: "UAE", lat: 25.2, lon: 55.27 },
  { cityName: "Sydney", country: "Australia", lat: -33.87, lon: 151.21 },
  { cityName: "Paris", country: "France", lat: 48.85, lon: 2.35 },
  { cityName: "Singapore", country: "Singapore", lat: 1.35, lon: 103.82 },
  { cityName: "Mumbai", country: "India", lat: 19.08, lon: 72.88 },
]

const getAqiColor = (aqi: number) =>
  aqi <= 50
    ? "#22c55e"
    : aqi <= 100
      ? "#eab308"
      : aqi <= 150
        ? "#f97316"
        : "#ef4444"

// ── Skeleton ───────────────────────────────────
const Skeleton = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse rounded-xl bg-white/5 ${className}`} />
)

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteWithWeather[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<"grid" | "list">("grid")
  const [adding, setAdding] = useState<string | null>(null)
  const [search, setSearch] = useState("")

  // ── Load favorites from DB ─────────────────
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/favorites")
        const data = await res.json()
        const favs: FavoriteWithWeather[] = data.map((f: Favorite) => ({
          ...f,
          loading: true,
          error: false,
        }))
        setFavorites(favs)

        // Fetch weather for each favorite in parallel
        favs.forEach(async (fav) => {
          try {
            const params = new URLSearchParams({
              lat: String(fav.lat),
              lon: String(fav.lon),
              city: fav.cityName,
              country: fav.country,
              timezone: fav.timezone ?? "auto",
            })
            const wRes = await fetch(`/api/weather?${params}`)
            const wData = await wRes.json()

            setFavorites((prev) =>
              prev.map((f) =>
                f.id === fav.id
                  ? { ...f, weather: wData.current, loading: false }
                  : f,
              ),
            )
          } catch {
            setFavorites((prev) =>
              prev.map((f) =>
                f.id === fav.id ? { ...f, loading: false, error: true } : f,
              ),
            )
          }
        })
      } catch {
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // ── Add favorite ───────────────────────────
  const addFavorite = async (city: (typeof SUGGESTIONS)[0]) => {
    setAdding(city.cityName)
    try {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(city),
      })
      const data = await res.json()

      if (!res.ok) {
        alert(data.error ?? "Failed to add favorite")
        return
      }

      const newFav: FavoriteWithWeather = {
        ...data,
        loading: true,
        error: false,
      }
      setFavorites((prev) => [...prev, newFav])

      // Fetch its weather
      const params = new URLSearchParams({
        lat: String(city.lat),
        lon: String(city.lon),
        city: city.cityName,
        country: city.country,
        timezone: "auto",
      })
      const wRes = await fetch(`/api/weather?${params}`)
      const wData = await wRes.json()
      setFavorites((prev) =>
        prev.map((f) =>
          f.id === data.id
            ? { ...f, weather: wData.current, loading: false }
            : f,
        ),
      )
    } catch {
      alert("Failed to add favorite")
    } finally {
      setAdding(null)
    }
  }

  // ── Remove favorite ────────────────────────
  // const removeFavorite = async (id: string) => {
  //   const res = await fetch(`/api/favorites?id=${id}`, { method: "DELETE" })
  //   if (res.ok) {
  //     setFavorites((prev) => prev.filter((f) => f.id !== id))
  //   }
  // }

  const removeFavorite = async (id: string, cityName: string) => {
    if (!confirm(`Remove ${cityName} from favourites?`)) return

    const res = await fetch(`/api/favorites?id=${id}`, { method: "DELETE" })
    if (res.ok) {
      setFavorites((prev) => prev.filter((f) => f.id !== id))
    }
  }

  const savedNames = favorites.map((f) => f.cityName)
  const filteredSuggestions = SUGGESTIONS.filter(
    (s) =>
      !savedNames.includes(s.cityName) &&
      (search === "" ||
        s.cityName.toLowerCase().includes(search.toLowerCase())),
  )

  return (
    <div className="flex flex-col gap-4">
      {/* ── Header ────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-xl font-bold text-slate-100"
            style={{ fontFamily: "var(--font-d)" }}
          >
            Favourite Locations
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {favorites.length} saved{" "}
            {favorites.length === 1 ? "city" : "cities"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Search */}
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <span className="text-slate-500">🔍</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search cities…"
              className="bg-transparent text-slate-300 placeholder-slate-600 outline-none text-sm w-32"
            />
          </div>
          {/* View toggle */}
          {["grid", "list"].map((v) => (
            <button
              key={v}
              onClick={() => setView(v as "grid" | "list")}
              className="px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200"
              style={{
                background:
                  view === v
                    ? "rgba(59,130,246,0.15)"
                    : "rgba(255,255,255,0.04)",
                border:
                  view === v
                    ? "1px solid rgba(59,130,246,0.35)"
                    : "1px solid rgba(255,255,255,0.08)",
                color: view === v ? "#60a5fa" : "#64748b",
              }}
            >
              {v === "grid" ? "⊞ Grid" : "☰ List"}
            </button>
          ))}
        </div>
      </div>

      {/* ── Empty state ────────────────────────── */}
      {!loading && favorites.length === 0 && (
        <div
          className="flex flex-col items-center justify-center py-16 gap-3 rounded-2xl"
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px dashed rgba(255,255,255,0.08)",
          }}
        >
          <p className="text-4xl">⭐</p>
          <p className="text-slate-300 font-semibold">No favourites yet</p>
          <p className="text-slate-500 text-sm">
            Add cities below to track their weather
          </p>
        </div>
      )}

      {/* ── Grid view ─────────────────────────── */}
      {view === "grid" && favorites.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {favorites.map((fav) => (
            <div
              key={fav.id}
              className="group relative rounded-2xl p-5 transition-all duration-200"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              {/* Remove button */}
              <button
                onClick={() => removeFavorite(fav.id, fav.cityName)}
                className="absolute top-3 right-3 w-7 h-7 rounded-lg flex items-center justify-center
                           text-slate-600 hover:text-red-600 hover:bg-red-500/10 transition-all
                           opacity-0 group-hover:opacity-100 text-xs"
              >
                ✕
              </button>

              {fav.loading ? (
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-16" />
                  <Skeleton className="h-3 w-32" />
                </div>
              ) : fav.error ? (
                <div className="text-center py-4">
                  <p className="text-slate-500 text-xs">Failed to load</p>
                  <p className="text-lg mt-1">⚠️</p>
                </div>
              ) : fav.weather ? (
                <>
                  <div className="flex items-start justify-between mt-6">
                    <div>
                      <p
                        className="text-sm font-bold text-slate-100"
                        style={{ fontFamily: "var(--font-d)" }}
                      >
                        {fav.cityName}
                      </p>
                      <p className="text-xs text-slate-500">{fav.country}</p>
                    </div>
                    <span className="text-3xl">
                      {fav.weather.conditionIcon}
                    </span>
                  </div>

                  <p
                    className="text-4xl font-black text-slate-100 mb-1"
                    style={{ fontFamily: "var(--font-d)", letterSpacing: -2 }}
                  >
                    {fav.weather.temp}°
                  </p>
                  <p className="text-xs text-slate-400 mb-4">
                    {fav.weather.conditionText}
                  </p>

                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { label: "Humidity", value: `${fav.weather.humidity}%` },
                      { label: "Wind", value: `${fav.weather.windSpeed}km/h` },
                      { label: "UV", value: `${fav.weather.uvIndex}` },
                    ].map((s) => (
                      <div
                        key={s.label}
                        className="text-center px-1 py-1.5 rounded-lg"
                        style={{ background: "rgba(255,255,255,0.04)" }}
                      >
                        <p className="text-[9px] text-slate-600">{s.label}</p>
                        <p className="text-xs font-semibold text-slate-300 mt-0.5">
                          {s.value}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div
                    className="flex items-center justify-between mt-3 pt-3"
                    style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
                  >
                    <span className="text-xs text-slate-500">
                      ↑ {fav.weather.tempMax}° ↓ {fav.weather.tempMin}°
                    </span>
                    <span
                      className="text-xs font-semibold"
                      style={{ color: getAqiColor(50) }}
                    >
                      Feels {fav.weather.feelsLike}°
                    </span>
                  </div>
                </>
              ) : null}
            </div>
          ))}
        </div>
      )}

      {/* ── List view ─────────────────────────── */}
      {view === "list" && favorites.length > 0 && (
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
                {[
                  "City",
                  "Condition",
                  "Temp",
                  "Feels Like",
                  "Humidity",
                  "Wind",
                  "UV",
                  "",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 text-[10px] text-slate-500
                                         uppercase tracking-wider font-semibold"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {favorites.map((fav, i) => (
                <tr
                  key={fav.id}
                  className="transition-colors hover:bg-white/[0.02]"
                  style={{
                    borderTop:
                      i > 0 ? "1px solid rgba(255,255,255,0.04)" : "none",
                  }}
                >
                  <td className="px-4 py-3">
                    <p className="font-semibold text-slate-100">
                      {fav.cityName}
                    </p>
                    <p className="text-xs text-slate-500">{fav.country}</p>
                  </td>
                  <td className="px-4 py-3">
                    {fav.loading ? (
                      <Skeleton className="h-4 w-20" />
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <span>{fav.weather?.conditionIcon}</span>
                        <span className="text-slate-400 text-xs">
                          {fav.weather?.conditionText}
                        </span>
                      </div>
                    )}
                  </td>
                  <td
                    className="px-4 py-3 font-bold text-slate-100"
                    style={{ fontFamily: "var(--font-d)" }}
                  >
                    {fav.loading ? (
                      <Skeleton className="h-4 w-10" />
                    ) : (
                      `${fav.weather?.temp}°C`
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-400">
                    {fav.loading ? (
                      <Skeleton className="h-4 w-10" />
                    ) : (
                      `${fav.weather?.feelsLike}°C`
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-400">
                    {fav.loading ? (
                      <Skeleton className="h-4 w-10" />
                    ) : (
                      `${fav.weather?.humidity}%`
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-400">
                    {fav.loading ? (
                      <Skeleton className="h-4 w-14" />
                    ) : (
                      `${fav.weather?.windSpeed} km/h`
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-400">
                    {fav.loading ? (
                      <Skeleton className="h-4 w-8" />
                    ) : (
                      fav.weather?.uvIndex
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => removeFavorite(fav.id, fav.cityName)}
                      className="text-slate-600 hover:text-red-400 transition-colors text-xs
                                 px-2 py-1 rounded-lg hover:bg-red-500/10"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
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
        <div className="flex flex-wrap gap-2">
          {filteredSuggestions.map((city) => (
            <button
              key={city.cityName}
              onClick={() => addFavorite(city)}
              disabled={adding === city.cityName}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold
                         transition-all duration-200 disabled:opacity-50 disabled:cursor-wait"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "#94a3b8",
              }}
            >
              {adding === city.cityName ? (
                <span
                  className="w-3 h-3 border border-blue-400/30 border-t-blue-400
                                 rounded-full animate-spin"
                />
              ) : (
                "＋"
              )}
              {city.cityName}
              <span className="text-slate-600">{city.country}</span>
            </button>
          ))}
          {filteredSuggestions.length === 0 && (
            <p className="text-xs text-slate-600">
              All suggested cities have been added!
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
