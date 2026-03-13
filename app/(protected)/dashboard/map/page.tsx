// src/app/(protected)/dashboard/map/page.tsx
"use client"

import { useState, useEffect, useRef } from "react"
import type { WeatherData } from "@/types"

const LAYERS = [
  {
    id: "temp",
    label: "Temperature",
    icon: "🌡️",
    color: "#ef4444",
    desc: "Surface temperature distribution across regions.",
  },
  {
    id: "precip",
    label: "Precipitation",
    icon: "🌧️",
    color: "#3b82f6",
    desc: "Current precipitation intensity and coverage.",
  },
  {
    id: "wind",
    label: "Wind",
    icon: "💨",
    color: "#22c55e",
    desc: "Wind speed and direction at surface level.",
  },
  {
    id: "cloud",
    label: "Cloud Cover",
    icon: "☁️",
    color: "#94a3b8",
    desc: "Cloud coverage percentage across the globe.",
  },
]

const OWM_LAYER_MAP: Record<string, string> = {
  temp: "temp_new",
  precip: "precipitation_new",
  wind: "wind_new",
  cloud: "clouds_new",
}

const TEMP_LEGEND = [
  { label: "-40°", color: "#9333ea" },
  { label: "-20°", color: "#3b82f6" },
  { label: "0°", color: "#22d3ee" },
  { label: "10°", color: "#22c55e" },
  { label: "20°", color: "#eab308" },
  { label: "30°", color: "#f97316" },
  { label: "40°", color: "#ef4444" },
]
const PRECIP_LEGEND = [
  { label: "None", color: "#1e3a5f" },
  { label: "Light", color: "#3b82f6" },
  { label: "Mod", color: "#1d4ed8" },
  { label: "Heavy", color: "#1e1b4b" },
]
const WIND_LEGEND = [
  { label: "0", color: "#f0fdf4" },
  { label: "5", color: "#86efac" },
  { label: "10", color: "#22c55e" },
  { label: "20+", color: "#15803d" },
]
const CLOUD_LEGEND = [
  { label: "0%", color: "#1e293b" },
  { label: "25%", color: "#475569" },
  { label: "50%", color: "#94a3b8" },
  { label: "100%", color: "#e2e8f0" },
]

const LEGEND_MAP: Record<string, typeof TEMP_LEGEND> = {
  temp: TEMP_LEGEND,
  precip: PRECIP_LEGEND,
  wind: WIND_LEGEND,
  cloud: CLOUD_LEGEND,
}

// Nearby cities to show as markers (relative to detected location)
const NEARBY_OFFSETS = [
  { name: "North", dlat: 0.8, dlon: 0.0 },
  { name: "Northeast", dlat: 0.6, dlon: 0.7 },
  { name: "East", dlat: 0.0, dlon: 0.9 },
  { name: "South", dlat: -0.8, dlon: 0.0 },
  { name: "West", dlat: 0.0, dlon: -0.9 },
]

export default function MapPage() {
  const mapRef = useRef<HTMLDivElement>(null)
  const leafletRef = useRef<any>(null)
  const tileLayerRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])

  const [activeLayer, setActiveLayer] = useState("temp")
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [mapReady, setMapReady] = useState(false)

  // ── Load location + weather ────────────────
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
        if (!data.error) setWeather(data)
      } catch {
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // ── Init Leaflet map ───────────────────────
  useEffect(() => {
    if (!mapRef.current || mapReady) return

    import("leaflet").then((L) => {
      // Fix default icon paths
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      })

      const lat = weather?.location.lat ?? 6.93
      const lon = weather?.location.lon ?? 79.86

      const map = L.map(mapRef.current!, {
        center: [lat, lon],
        zoom: 9,
        minZoom: 5,
        maxZoom: 16,
        zoomControl: false,
      })

      // Dark base tiles
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        {
          attribution: "© OpenStreetMap © CartoDB",
          subdomains: "abcd",
          maxZoom: 19,
        },
      ).addTo(map)

      // Zoom control — top right
      L.control.zoom({ position: "topright" }).addTo(map)

      // Weather overlay tile
      const owmKey = process.env.NEXT_PUBLIC_OWM_KEY ?? "DEMO"
      const wTile = L.tileLayer(
        `https://tile.openweathermap.org/map/${OWM_LAYER_MAP[activeLayer]}/{z}/{x}/{y}.png?appid=${owmKey}`,
        { opacity: 0.6, maxZoom: 19 },
      ).addTo(map)

      tileLayerRef.current = wTile
      leafletRef.current = { map, L }
      setMapReady(true)
    })
  }, [weather])

  // ── Add city markers when map + weather ready
  useEffect(() => {
    if (!mapReady || !weather || !leafletRef.current) return
    const { map, L } = leafletRef.current

    // Remove old markers
    markersRef.current.forEach((m) => map.removeLayer(m))
    markersRef.current = []

    const { lat, lon } = weather.location
    const { current } = weather

    // Current location marker
    const mainIcon = L.divIcon({
      className: "",
      html: `<div style="
        background: rgba(9,21,37,0.9);
        border: 2px solid #3b82f6;
        border-radius: 12px;
        padding: 4px 8px;
        font-size: 12px;
        font-weight: 700;
        color: #e2e8f0;
        white-space: nowrap;
        box-shadow: 0 0 12px rgba(59,130,246,0.4);
        display: flex; align-items: center; gap: 4px;
      ">
        ${current.conditionIcon} ${current.temp}°C
      </div>`,
      iconAnchor: [40, 16],
    })
    const mainMarker = L.marker([lat, lon], { icon: mainIcon })
      .addTo(map)
      .bindPopup(
        `
        <div style="color:#e2e8f0;background:#0d1f3c;padding:8px;border-radius:8px;min-width:140px">
          <b style="font-size:14px">${weather.location.city}</b><br/>
          <span style="font-size:20px">${current.conditionIcon}</span>
          <span style="font-size:18px;font-weight:bold"> ${current.temp}°C</span><br/>
          <span style="color:#94a3b8;font-size:11px">${current.conditionText}</span><br/>
          <span style="color:#94a3b8;font-size:11px">💧 ${current.humidity}% · 💨 ${current.windSpeed} km/h</span>
        </div>
      `,
        { className: "dark-popup" },
      )
    markersRef.current.push(mainMarker)

    // Nearby city markers — fetch real weather for each
    NEARBY_OFFSETS.forEach(async (offset) => {
      const nLat = lat + offset.dlat
      const nLon = lon + offset.dlon

      try {
        const params = new URLSearchParams({
          lat: String(nLat),
          lon: String(nLon),
          city: offset.name,
          country: "",
          timezone: "auto",
        })
        const res = await fetch(`/api/weather?${params}`)
        const data = await res.json()
        const nTemp = data?.current?.temp ?? "—"
        const nIcon = data?.current?.conditionIcon ?? "🌡️"

        const icon = L.divIcon({
          className: "",
          html: `<div style="
            background: rgba(9,21,37,0.85);
            border: 1px solid rgba(255,255,255,0.15);
            border-radius: 10px;
            padding: 3px 7px;
            font-size: 11px;
            font-weight: 600;
            color: #cbd5e1;
            white-space: nowrap;
            display: flex; align-items: center; gap: 3px;
          ">
            ${nIcon} ${nTemp}°C
          </div>`,
          iconAnchor: [30, 14],
        })
        const m = L.marker([nLat, nLon], { icon }).addTo(map)
        markersRef.current.push(m)
      } catch {
        // Skip marker if fetch fails
      }
    })
  }, [mapReady, weather])

  // ── Switch weather overlay layer ───────────
  useEffect(() => {
    if (!mapReady || !leafletRef.current) return
    const { map, L } = leafletRef.current

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current)
    }

    const owmKey = process.env.NEXT_PUBLIC_OWM_KEY ?? "DEMO"
    const newTile = L.tileLayer(
      `https://tile.openweathermap.org/map/${OWM_LAYER_MAP[activeLayer]}/{z}/{x}/{y}.png?appid=${owmKey}`,
      { opacity: 0.6, maxZoom: 19 },
    ).addTo(map)
    tileLayerRef.current = newTile
  }, [activeLayer, mapReady])

  const legend = LEGEND_MAP[activeLayer]
  const layerInfo = LAYERS.find((l) => l.id === activeLayer)!

  return (
    <div className="flex gap-4 h-[calc(100vh-96px)]">
      {/* ── Map container ─────────────────────── */}
      <div
        className="relative flex-1 rounded-2xl overflow-hidden"
        style={{ border: "1px solid rgba(255,255,255,0.07)" }}
      >
        {/* Leaflet CSS */}
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        />

        <div ref={mapRef} className="w-full h-full" />

        {/* Layer toggles — top left */}
        <div className="absolute top-4 left-4 z-[1000] flex flex-col gap-2">
          {LAYERS.map((l) => (
            <button
              key={l.id}
              onClick={() => setActiveLayer(l.id)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold
                         transition-all duration-200"
              style={{
                background:
                  activeLayer === l.id
                    ? "rgba(9,21,37,0.95)"
                    : "rgba(9,21,37,0.75)",
                border:
                  activeLayer === l.id
                    ? `1px solid ${l.color}66`
                    : "1px solid rgba(255,255,255,0.1)",
                color: activeLayer === l.id ? l.color : "#64748b",
                backdropFilter: "blur(12px)",
                boxShadow:
                  activeLayer === l.id ? `0 0 12px ${l.color}22` : "none",
              }}
            >
              <span>{l.icon}</span>
              <span>{l.label}</span>
            </button>
          ))}
        </div>

        {/* Color legend — bottom left */}
        <div
          className="absolute bottom-4 left-4 z-[1000] px-3 py-2.5 rounded-xl"
          style={{
            background: "rgba(9,21,37,0.85)",
            border: "1px solid rgba(255,255,255,0.1)",
            backdropFilter: "blur(12px)",
          }}
        >
          <p className="text-[10px] text-slate-500 mb-2 uppercase tracking-wider">
            {layerInfo.label}
          </p>
          <div className="flex items-center gap-1">
            {legend.map((l) => (
              <div key={l.label} className="flex flex-col items-center gap-1">
                <div
                  className="w-6 h-2 rounded-sm"
                  style={{ background: l.color }}
                />
                <p className="text-[9px] text-slate-500">{l.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Loading overlay */}
        {loading && (
          <div
            className="absolute inset-0 z-[2000] flex items-center justify-center
                          bg-[#060d1f]/80 backdrop-blur-sm"
          >
            <div className="flex flex-col items-center gap-3">
              <div
                className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500
                              rounded-full animate-spin"
              />
              <p className="text-sm text-slate-400">Loading map…</p>
            </div>
          </div>
        )}
      </div>

      {/* ── Right panel ───────────────────────── */}
      <div
        className="w-72 shrink-0 flex flex-col gap-3 overflow-y-auto"
        style={{ scrollbarWidth: "none" }}
      >
        {/* Search */}
        <div
          className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <span className="text-slate-500 text-sm">🔍</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search location…"
            className="flex-1 bg-transparent text-sm text-slate-300
                       placeholder-slate-600 outline-none"
          />
        </div>

        {/* Current location card */}
        {weather && (
          <div
            className="rounded-2xl p-4"
            style={{
              background: "rgba(59,130,246,0.07)",
              border: "1px solid rgba(59,130,246,0.2)",
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs text-blue-400 font-semibold mb-0.5">
                  📍 Your location
                </p>
                <p
                  className="text-base font-bold text-slate-100"
                  style={{ fontFamily: "var(--font-d)" }}
                >
                  {weather.location.city}
                </p>
                <p className="text-xs text-slate-500">
                  {weather.location.country}
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl">{weather.current.conditionIcon}</p>
                <p
                  className="text-xl font-black text-slate-100"
                  style={{ fontFamily: "var(--font-d)" }}
                >
                  {weather.current.temp}°C
                </p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Humidity", value: `${weather.current.humidity}%` },
                { label: "Wind", value: `${weather.current.windSpeed} km/h` },
                { label: "Feels", value: `${weather.current.feelsLike}°C` },
              ].map((s) => (
                <div
                  key={s.label}
                  className="text-center px-2 py-1.5 rounded-lg"
                  style={{ background: "rgba(255,255,255,0.04)" }}
                >
                  <p className="text-[10px] text-slate-500">{s.label}</p>
                  <p className="text-xs font-bold text-slate-200 mt-0.5">
                    {s.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Active layer info */}
        <div
          className="rounded-2xl p-4"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <p className="text-[11px] text-slate-500 uppercase tracking-widest mb-2">
            Active layer
          </p>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">{layerInfo.icon}</span>
            <p
              className="text-sm font-bold text-slate-100"
              style={{ fontFamily: "var(--font-d)", color: layerInfo.color }}
            >
              {layerInfo.label}
            </p>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            {layerInfo.desc}
          </p>
        </div>

        {/* 7-day overview */}
        {weather && (
          <div
            className="rounded-2xl p-4"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <p className="text-[11px] text-slate-500 uppercase tracking-widest mb-3">
              7-day overview
            </p>
            <div className="flex flex-col gap-1.5">
              {weather.daily.map((d, i) => (
                <div key={i} className="flex items-center justify-between">
                  <p
                    className={`text-xs font-semibold w-10 shrink-0
                                 ${i === 0 ? "text-blue-400" : "text-slate-400"}`}
                  >
                    {d.dayName}
                  </p>
                  <span className="text-base">{d.conditionIcon}</span>
                  <p className="text-xs text-slate-400 flex-1 text-center truncate px-1">
                    {d.conditionText}
                  </p>
                  <div className="flex gap-1.5 shrink-0">
                    <span className="text-xs font-bold text-slate-100">
                      {d.tempMax}°
                    </span>
                    <span className="text-xs text-slate-600">{d.tempMin}°</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
