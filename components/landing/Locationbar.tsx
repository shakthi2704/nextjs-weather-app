"use client"

import { useEffect, useState } from "react"

const getWeatherIcon = (code: number, isDay = true): string => {
  if (code === 0) return isDay ? "☀️" : "🌙"
  if (code <= 2) return isDay ? "🌤️" : "🌙"
  if (code === 3) return "☁️"
  if (code <= 48) return "🌫️"
  if (code <= 55) return "🌦️"
  if (code <= 65) return "🌧️"
  if (code <= 77) return "❄️"
  if (code <= 82) return "🌧️"
  return "⛈️"
}

const LocationBar = () => {
  const [city, setCity] = useState("Detecting location...")
  const [weather, setWeather] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const detect = async () => {
      try {
        const ipRes = await fetch(
          "http://ip-api.com/json?fields=status,city,country,lat,lon",
        )
        const ipData = await ipRes.json()
        if (ipData.status !== "success") throw new Error("IP failed")

        setCity(`${ipData.city}, ${ipData.country}`)

        const wRes = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${ipData.lat}&longitude=${ipData.lon}` +
            `&current=temperature_2m,weather_code,is_day&timezone=auto`,
        )
        const wData = await wRes.json()
        const temp = Math.round(wData.current.temperature_2m)
        const icon = getWeatherIcon(
          wData.current.weather_code,
          wData.current.is_day === 1,
        )

        setWeather(`${icon} ${temp}°C`)
      } catch {
        setCity("Negombo, Sri Lanka")
        setWeather("⛅ 34°C")
      } finally {
        setLoading(false)
      }
    }
    detect()
  }, [])

  return (
    <div className="relative z-10 flex justify-center px-6 mb-10">
      <div
        className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-lg
                   bg-white/5 border border-white/10 cursor-pointer
                   hover:bg-white/8 hover:border-blue-500/30
                   transition-all duration-200"
      >
        <span className="text-base">📍</span>

        <span className="text-sm font-medium text-slate-100 whitespace-nowrap">
          {loading ? "Detecting location..." : city}
        </span>

        {!loading && weather && (
          <>
            <span className="text-slate-600">·</span>
            <span className="text-sm text-slate-400 whitespace-nowrap">
              {weather}
            </span>
          </>
        )}

        <span className="text-slate-600">·</span>

        <span
          className="text-xs font-semibold text-blue-400 px-2 py-0.5 rounded-md
                         bg-blue-500/10 border border-blue-500/20 whitespace-nowrap"
        >
          Change
        </span>
      </div>
    </div>
  )
}

export default LocationBar
