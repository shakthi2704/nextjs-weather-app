"use client"

import { useState, useEffect, useRef } from "react"

// ── Layer config ───────────────────────────────
const LAYERS = [
  {
    id: "temp",
    label: "Temperature",
    icon: "🌡️",
    color: "text-orange-400",
    activeBg: "bg-orange-500/15 border-orange-500/30",
    tileUrl:
      "https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=DEMO",
    legendStops: [
      { color: "#9333ea", label: "-40°" },
      { color: "#3b82f6", label: "0°" },
      { color: "#22c55e", label: "20°" },
      { color: "#f97316", label: "30°" },
      { color: "#ef4444", label: "40°+" },
    ],
  },
  {
    id: "rain",
    label: "Precipitation",
    icon: "🌧️",
    color: "text-blue-400",
    activeBg: "bg-blue-500/15 border-blue-500/30",
    tileUrl:
      "https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=DEMO",
    legendStops: [
      { color: "rgba(255,255,255,0.1)", label: "None" },
      { color: "#93c5fd", label: "Light" },
      { color: "#3b82f6", label: "Mod." },
      { color: "#1d4ed8", label: "Heavy" },
      { color: "#1e3a8a", label: "Storm" },
    ],
  },
  {
    id: "wind",
    label: "Wind Speed",
    icon: "💨",
    color: "text-cyan-400",
    activeBg: "bg-cyan-500/15 border-cyan-500/30",
    tileUrl:
      "https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=DEMO",
    legendStops: [
      { color: "#e2e8f0", label: "Calm" },
      { color: "#7dd3fc", label: "Light" },
      { color: "#0ea5e9", label: "Breezy" },
      { color: "#f97316", label: "Strong" },
      { color: "#ef4444", label: "Storm" },
    ],
  },
  {
    id: "cloud",
    label: "Cloud Cover",
    icon: "☁️",
    color: "text-slate-400",
    activeBg: "bg-slate-500/15 border-slate-500/30",
    tileUrl:
      "https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=DEMO",
    legendStops: [
      { color: "rgba(255,255,255,0.05)", label: "Clear" },
      { color: "rgba(148,163,184,0.3)", label: "Partial" },
      { color: "rgba(148,163,184,0.6)", label: "Mostly" },
      { color: "rgba(100,116,139,0.85)", label: "Overcast" },
    ],
  },
]

// ── Nearby locations ───────────────────────────
const LOCATIONS = [
  {
    name: "Negombo",
    country: "LK",
    temp: 34,
    condition: "⛅",
    rain: 40,
    lat: 7.2,
    lng: 79.8,
  },
  {
    name: "Colombo",
    country: "LK",
    temp: 33,
    condition: "🌤️",
    rain: 20,
    lat: 6.9,
    lng: 79.86,
  },
  {
    name: "Kandy",
    country: "LK",
    temp: 28,
    condition: "🌦️",
    rain: 55,
    lat: 7.29,
    lng: 80.63,
  },
  {
    name: "Galle",
    country: "LK",
    temp: 31,
    condition: "⛅",
    rain: 30,
    lat: 6.03,
    lng: 80.21,
  },
  {
    name: "Jaffna",
    country: "LK",
    temp: 36,
    condition: "☀️",
    rain: 5,
    lat: 9.66,
    lng: 80.01,
  },
]

// ── Card shell ─────────────────────────────────
const Card = ({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) => (
  <div
    className={`rounded-2xl p-4 ${className}`}
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

// ── Map component (client only) ────────────────
function LeafletMap({ activeLayer }: { activeLayer: string }) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapObj = useRef<any>(null)
  const layerRef = useRef<any>(null)

  useEffect(() => {
    if (!mapRef.current || mapObj.current) return

    // Dynamically import Leaflet to avoid SSR issues
    import("leaflet").then((L) => {
      // Fix default marker icons
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      })

      const map = L.map(mapRef.current!, {
        center: [7.2, 79.8],
        zoom: 8,
        minZoom: 2,
        maxZoom: 5,
        zoomControl: false,
      })

      // Dark base tile
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        {
          attribution: "©OpenStreetMap ©CARTO",
          subdomains: "abcd",
          maxZoom: 19,
        },
      ).addTo(map)

      // Custom zoom control position
      L.control.zoom({ position: "bottomright" }).addTo(map)

      // Location markers
      LOCATIONS.forEach((loc) => {
        const icon = L.divIcon({
          className: "",
          html: `
            <div style="
              background: rgba(9,21,37,0.9);
              border: 1px solid rgba(59,130,246,0.4);
              border-radius: 10px;
              padding: 4px 8px;
              font-size: 11px;
              font-weight: 700;
              color: #e2e8f0;
              white-space: nowrap;
              display: flex;
              align-items: center;
              gap: 4px;
              box-shadow: 0 2px 12px rgba(0,0,0,0.4);
              backdrop-filter: blur(8px);
            ">
              <span>${loc.condition}</span>
              <span>${loc.temp}°</span>
            </div>
          `,
          iconAnchor: [30, 12],
        })
        L.marker([loc.lat, loc.lng], { icon })
          .addTo(map)
          .bindPopup(`<b>${loc.name}</b><br>${loc.temp}°C · Rain ${loc.rain}%`)
      })

      mapObj.current = map
    })

    return () => {
      if (mapObj.current) {
        mapObj.current.remove()
        mapObj.current = null
      }
    }
  }, [])

  // Swap weather overlay when activeLayer changes
  useEffect(() => {
    if (!mapObj.current) return
    import("leaflet").then((L) => {
      if (layerRef.current) {
        mapObj.current.removeLayer(layerRef.current)
        layerRef.current = null
      }
      const layer = LAYERS.find((l) => l.id === activeLayer)
      if (layer) {
        layerRef.current = L.tileLayer(layer.tileUrl, { opacity: 0.6 })
        layerRef.current.addTo(mapObj.current)
      }
    })
  }, [activeLayer])

  return (
    <>
      {/* Leaflet CSS */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css"
      />
      <div ref={mapRef} className="w-full h-full" />
    </>
  )
}

// ── Page ───────────────────────────────────────
export default function MapPage() {
  const [activeLayer, setActiveLayer] = useState("rain")
  const currentLayer = LAYERS.find((l) => l.id === activeLayer)!

  return (
    // Stretch to fill the layout shell — negative margin to escape padding
    <div
      className="flex gap-0 rounded-2xl overflow-hidden"
      style={{
        height: "calc(100vh - 96px)",
        border: "1px solid rgba(255,255,255,0.07)",
        background: "rgba(255,255,255,0.02)",
      }}
    >
      {/* ── Map area ──────────────────────────── */}
      <div className="relative flex-1 min-w-0">
        <LeafletMap activeLayer={activeLayer} />

        {/* Layer toggle — floats top-left */}
        <div className="absolute top-4 left-4 z-1000 flex gap-2 flex-wrap">
          {LAYERS.map((l) => (
            <button
              key={l.id}
              onClick={() => setActiveLayer(l.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs
                          font-semibold border transition-all duration-200
                          ${
                            activeLayer === l.id
                              ? l.activeBg
                              : "bg-[rgba(9,21,37,0.85)] border-white/10 text-slate-400 hover:border-white/20"
                          }`}
              style={{ backdropFilter: "blur(12px)" }}
            >
              <span>{l.icon}</span>
              <span className={activeLayer === l.id ? l.color : ""}>
                {l.label}
              </span>
            </button>
          ))}
        </div>

        {/* Legend — floats bottom-left */}
        <div
          className="absolute bottom-8 left-4 z-1000 px-3 py-2.5 rounded-xl"
          style={{
            background: "rgba(9,21,37,0.88)",
            border: "1px solid rgba(255,255,255,0.1)",
            backdropFilter: "blur(12px)",
          }}
        >
          <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-2">
            {currentLayer.label}
          </p>
          <div className="flex items-center gap-1">
            {currentLayer.legendStops.map((s, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div
                  className="w-7 h-2 rounded-sm"
                  style={{
                    background: s.color,
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                />
                <p className="text-[9px] text-slate-500 whitespace-nowrap">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right info panel ──────────────────── */}
      <div
        className="w-72 shrink-0 flex flex-col gap-3 p-4 overflow-y-auto scrollbar-hide"
        style={{ borderLeft: "1px solid rgba(255,255,255,0.07)" }}
      >
        {/* Current location */}
        <div
          className="rounded-2xl p-4"
          style={{
            background:
              "linear-gradient(135deg, rgba(29,78,216,0.2) 0%, rgba(9,21,37,0.9) 100%)",
            border: "1px solid rgba(59,130,246,0.2)",
          }}
        >
          <div className="flex items-center gap-2 text-slate-400 text-xs mb-3">
            <span>📍</span>
            <span>Your location</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-4xl">⛅</span>
            <div>
              <p
                className="text-2xl font-extrabold text-slate-100 leading-none"
                style={{ fontFamily: "var(--font-d)", letterSpacing: -1 }}
              >
                34°C
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                Negombo, Sri Lanka
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-3">
            {[
              { label: "Rain", value: "40%" },
              { label: "Wind", value: "18 km/h" },
              { label: "Humidity", value: "72%" },
              { label: "UV", value: "7 / 11" },
            ].map((s) => (
              <div
                key={s.label}
                className="px-2.5 py-2 rounded-xl"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <p className="text-[10px] text-slate-500">{s.label}</p>
                <p
                  className="text-xs font-bold text-slate-100"
                  style={{ fontFamily: "var(--font-d)" }}
                >
                  {s.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Nearby locations */}
        <div>
          <SectionLabel>Nearby cities</SectionLabel>
          <div className="flex flex-col gap-2">
            {LOCATIONS.map((loc, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl
                           hover:bg-white/4 transition-colors cursor-pointer"
                style={{ border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <span className="text-xl shrink-0">{loc.condition}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-200 truncate">
                    {loc.name}
                  </p>
                  <p className="text-[10px] text-slate-500">Rain {loc.rain}%</p>
                </div>
                <p
                  className="text-sm font-bold text-slate-100 shrink-0"
                  style={{ fontFamily: "var(--font-d)" }}
                >
                  {loc.temp}°
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Active layer info */}
        <div>
          <SectionLabel>Active layer</SectionLabel>
          <div
            className="px-4 py-3 rounded-xl"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{currentLayer.icon}</span>
              <p className={`text-sm font-semibold ${currentLayer.color}`}>
                {currentLayer.label}
              </p>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {activeLayer === "temp" &&
                "Surface temperature overlay showing heat distribution across the region."}
              {activeLayer === "rain" &&
                "Precipitation intensity overlay showing current and forecast rainfall."}
              {activeLayer === "wind" &&
                "Wind speed overlay. Darker areas indicate stronger wind conditions."}
              {activeLayer === "cloud" &&
                "Cloud coverage overlay showing clear vs overcast areas in real time."}
            </p>
          </div>
        </div>

        {/* Search bar placeholder */}
        <div>
          <SectionLabel>Search location</SectionLabel>
          <div
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <span className="text-slate-500 text-sm">🔍</span>
            <input
              type="text"
              placeholder="Search city or location…"
              className="flex-1 bg-transparent text-xs text-slate-300 placeholder-slate-600
                         outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
