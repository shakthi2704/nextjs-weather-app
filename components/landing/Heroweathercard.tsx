"use client"

import { useState, useEffect } from "react"

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

// ── Helpers ────────────────────────────────────
const toF = (c: number) => Math.round((c * 9) / 5 + 32)

const WMO_ICON: Record<number, string> = {
  0: "☀️",
  1: "🌤️",
  2: "⛅",
  3: "☁️",
  45: "🌫️",
  48: "🌫️",
  51: "🌦️",
  53: "🌦️",
  55: "🌧️",
  61: "🌧️",
  63: "🌧️",
  65: "🌧️",
  71: "🌨️",
  73: "🌨️",
  75: "❄️",
  80: "🌦️",
  81: "🌧️",
  82: "⛈️",
  95: "⛈️",
  96: "⛈️",
  99: "⛈️",
}
const WMO_TEXT: Record<number, string> = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Foggy",
  48: "Icy fog",
  51: "Light drizzle",
  53: "Drizzle",
  55: "Heavy drizzle",
  61: "Slight rain",
  63: "Moderate rain",
  65: "Heavy rain",
  71: "Light snow",
  73: "Snow",
  75: "Heavy snow",
  80: "Showers",
  81: "Heavy showers",
  82: "Violent showers",
  95: "Thunderstorm",
  96: "Thunderstorm w/ hail",
  99: "Severe thunderstorm",
}
const icon = (code: number) => WMO_ICON[code] ?? "⛅"
const text = (code: number) => WMO_TEXT[code] ?? "Partly cloudy"

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

const HeroWeatherCard = () => {
  const [unit, setUnit] = useState<"C" | "F">("C")
  const [weather, setWeather] = useState<any>(null)
  const [city, setCity] = useState("Loading…")
  const isC = unit === "C"

  const fmt = (c: number) => (isC ? `${c}°` : `${toF(c)}°`)

  useEffect(() => {
    async function load() {
      try {
        // 1. Get location via IP
        const locRes = await fetch(
          "https://ip-api.com/json?fields=status,city,country,lat,lon,timezone",
        )
        const loc = await locRes.json()
        if (loc.status !== "success") throw new Error("location failed")
        setCity(`${loc.city}, ${loc.country}`)

        // 2. Fetch weather from Open-Meteo
        const params = new URLSearchParams({
          latitude: String(loc.lat),
          longitude: String(loc.lon),
          current:
            "temperature_2m,apparent_temperature,weather_code,relative_humidity_2m,wind_speed_10m,wind_direction_10m,uv_index,visibility,precipitation",
          hourly:
            "temperature_2m,weather_code,precipitation_probability,is_day",
          daily:
            "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max",
          timezone: loc.timezone ?? "auto",
          forecast_days: "6",
        })
        const wRes = await fetch(
          `https://api.open-meteo.com/v1/forecast?${params}`,
        )
        const data = await wRes.json()
        if (data.error) throw new Error(data.reason)
        setWeather({ data, loc })
      } catch {
        // Fallback to static data on error
        setCity("Colombo, Sri Lanka")
      }
    }
    load()
  }, [])

  // ── Build display data ─────────────────────
  const current = weather?.data?.current
  const hourly = weather?.data?.hourly
  const daily = weather?.data?.daily
  const now = new Date()

  const STATS = current
    ? [
        {
          label: "Humidity",
          value: `${current.relative_humidity_2m}%`,
          icon: "💧",
        },
        {
          label: "Wind",
          value: `${Math.round(current.wind_speed_10m)} km/h`,
          icon: "💨",
        },
        {
          label: "UV Index",
          value: `${current.uv_index} · ${current.uv_index >= 8 ? "Very High" : current.uv_index >= 6 ? "High" : current.uv_index >= 3 ? "Moderate" : "Low"}`,
          icon: "☀️",
        },
        {
          label: "Visibility",
          value: `${Math.round((current.visibility ?? 10000) / 1000)} km`,
          icon: "👁️",
        },
      ]
    : [
        { label: "Humidity", value: "72%", icon: "💧" },
        { label: "Wind", value: "14 km/h SW", icon: "💨" },
        { label: "UV Index", value: "8 · High", icon: "☀️" },
        { label: "Visibility", value: "10 km", icon: "👁️" },
      ]

  // Build hourly strip — next 8 time slots in 3h increments
  const HOURLY: HourData[] = hourly
    ? (() => {
        const currentHour = now.getHours()
        const slots = []
        for (let i = 0; i < 8; i++) {
          const hi = hourly.time.findIndex((_: string, idx: number) => {
            const h = new Date(hourly.time[idx]).getHours()
            return h >= (currentHour + i * 3) % 24 && idx >= i * 3
          })
          const idx = Math.min(hi < 0 ? i * 3 : hi, hourly.time.length - 1)
          const h = new Date(hourly.time[idx]).getHours()
          const label =
            h === 0
              ? "12 AM"
              : h === 12
                ? "12 PM"
                : h > 12
                  ? `${h - 12} PM`
                  : `${h} AM`
          slots.push({
            time: i === 0 ? "Now" : label,
            icon: icon(hourly.weather_code[idx]),
            tempC: Math.round(hourly.temperature_2m[idx]),
            tempF: toF(Math.round(hourly.temperature_2m[idx])),
            rain: hourly.precipitation_probability[idx] ?? 0,
            isNow: i === 0,
          })
        }
        return slots
      })()
    : [
        {
          time: "Now",
          icon: "⛅",
          tempC: 34,
          tempF: 93,
          rain: 35,
          isNow: true,
        },
        {
          time: "5 PM",
          icon: "🌦️",
          tempC: 32,
          tempF: 90,
          rain: 45,
          isNow: false,
        },
        {
          time: "8 PM",
          icon: "🌧️",
          tempC: 28,
          tempF: 82,
          rain: 60,
          isNow: false,
        },
        {
          time: "11 PM",
          icon: "🌧️",
          tempC: 26,
          tempF: 79,
          rain: 40,
          isNow: false,
        },
        {
          time: "2 AM",
          icon: "🌙",
          tempC: 24,
          tempF: 75,
          rain: 10,
          isNow: false,
        },
        {
          time: "5 AM",
          icon: "🌙",
          tempC: 24,
          tempF: 75,
          rain: 8,
          isNow: false,
        },
        {
          time: "8 AM",
          icon: "⛅",
          tempC: 27,
          tempF: 81,
          rain: 12,
          isNow: false,
        },
        {
          time: "11 AM",
          icon: "🌤️",
          tempC: 32,
          tempF: 90,
          rain: 20,
          isNow: false,
        },
      ]

  // Build daily forecast
  const DAILY: DayData[] = daily
    ? daily.time.slice(0, 5).map((date: string, i: number) => ({
        day: i === 0 ? "Today" : DAY_NAMES[new Date(date).getDay()],
        icon: icon(daily.weather_code[i]),
        highC: Math.round(daily.temperature_2m_max[i]),
        highF: toF(Math.round(daily.temperature_2m_max[i])),
        lowC: Math.round(daily.temperature_2m_min[i]),
        lowF: toF(Math.round(daily.temperature_2m_min[i])),
        rain: daily.precipitation_probability_max[i] ?? 0,
      }))
    : [
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
        {
          day: "Fri",
          icon: "☀️",
          highC: 33,
          highF: 91,
          lowC: 24,
          lowF: 75,
          rain: 5,
        },
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

  const tempC = current ? Math.round(current.temperature_2m) : 34
  const feelsLikeC = current ? Math.round(current.apparent_temperature) : 38
  const highC = daily ? Math.round(daily.temperature_2m_max[0]) : 36
  const lowC = daily ? Math.round(daily.temperature_2m_min[0]) : 24
  const condCode = current?.weather_code ?? 2
  const dateStr = now.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  })

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
          {/* Left — current */}
          <div className="p-7 border-b md:border-b-0 md:border-r border-white/5">
            <div className="flex items-center gap-1.5 text-slate-400 text-sm mb-5">
              <span>📍</span>
              <span>{city}</span>
              <span className="text-slate-600 mx-1">·</span>
              <span>{dateStr}</span>
            </div>

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
                {fmt(tempC)}
              </span>

              <div className="pb-3 flex flex-col gap-2">
                <div className="flex items-center gap-0.5 bg-white/5 rounded-lg p-0.5">
                  {(["C", "F"] as const).map((u) => (
                    <button
                      key={u}
                      onClick={() => setUnit(u)}
                      className={`px-2.5 py-1 rounded-md text-xs font-bold
                                  transition-all duration-200 cursor-pointer
                                  ${unit === u ? "bg-blue-500 text-white" : "text-slate-400 hover:text-slate-200"}`}
                    >
                      °{u}
                    </button>
                  ))}
                </div>
                <div className="flex gap-1.5">
                  <span
                    className="px-2 py-0.5 rounded-lg text-xs font-semibold
                                   bg-red-500/10 text-red-400 border border-red-500/20"
                  >
                    ↑ {fmt(highC)}
                  </span>
                  <span
                    className="px-2 py-0.5 rounded-lg text-xs font-semibold
                                   bg-blue-500/10 text-blue-400 border border-blue-500/20"
                  >
                    ↓ {fmt(lowC)}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Feels like {fmt(feelsLikeC)}
                </p>
              </div>
            </div>

            <p
              className="font-semibold text-lg text-slate-200 mb-1"
              style={{ fontFamily: "var(--font-d)" }}
            >
              {icon(condCode)} {text(condCode)}
            </p>

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
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-4">
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
                    className={`text-sm font-medium w-12 ${i === 0 ? "text-blue-400" : "text-slate-300"}`}
                  >
                    {d.day}
                  </span>
                  <span className="text-xl">{d.icon}</span>
                  <div className="flex items-center gap-2 text-sm">
                    <span
                      className="font-bold text-slate-100"
                      style={{ fontFamily: "var(--font-d)" }}
                    >
                      {isC ? `${d.highC}°` : `${d.highF}°`}
                    </span>
                    <span className="text-slate-500">
                      {isC ? `${d.lowC}°` : `${d.lowF}°`}
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
                          ${h.isNow ? "bg-blue-500/15 border-blue-500/30" : "hover:bg-white/5"}`}
            >
              <p className="text-[11px] text-slate-500 mb-2">{h.time}</p>
              <p className="text-xl mb-2">{h.icon}</p>
              <p
                className="text-sm font-bold text-slate-100 mb-1"
                style={{ fontFamily: "var(--font-d)" }}
              >
                {isC ? `${h.tempC}°` : `${h.tempF}°`}
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
