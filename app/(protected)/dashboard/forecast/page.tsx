"use client"

import { useState } from "react"

// ── Static data ────────────────────────────────
const DAYS = [
  {
    day: "Today",
    date: "Tue, Mar 11",
    icon: "⛅",
    condition: "Partly Cloudy",
    high: 36,
    low: 24,
    rain: 40,
    humidity: 72,
    wind: 18,
    uv: 7,
    pressure: 1012,
    sunrise: "6:04 AM",
    sunset: "6:21 PM",
    hourly: [
      {
        time: "12 AM",
        icon: "🌤️",
        temp: 26,
        feelsLike: 27,
        rain: 5,
        wind: 12,
        humidity: 70,
      },
      {
        time: "2 AM",
        icon: "🌤️",
        temp: 25,
        feelsLike: 26,
        rain: 5,
        wind: 10,
        humidity: 71,
      },
      {
        time: "4 AM",
        icon: "⛅",
        temp: 25,
        feelsLike: 26,
        rain: 8,
        wind: 10,
        humidity: 72,
      },
      {
        time: "6 AM",
        icon: "⛅",
        temp: 26,
        feelsLike: 27,
        rain: 10,
        wind: 12,
        humidity: 73,
      },
      {
        time: "8 AM",
        icon: "⛅",
        temp: 29,
        feelsLike: 31,
        rain: 10,
        wind: 14,
        humidity: 72,
      },
      {
        time: "10 AM",
        icon: "☀️",
        temp: 32,
        feelsLike: 35,
        rain: 5,
        wind: 16,
        humidity: 68,
      },
      {
        time: "12 PM",
        icon: "☀️",
        temp: 35,
        feelsLike: 38,
        rain: 5,
        wind: 18,
        humidity: 65,
      },
      {
        time: "2 PM",
        icon: "☀️",
        temp: 36,
        feelsLike: 39,
        rain: 5,
        wind: 18,
        humidity: 63,
      },
      {
        time: "4 PM",
        icon: "🌦️",
        temp: 34,
        feelsLike: 37,
        rain: 40,
        wind: 20,
        humidity: 70,
      },
      {
        time: "6 PM",
        icon: "🌧️",
        temp: 31,
        feelsLike: 33,
        rain: 80,
        wind: 22,
        humidity: 82,
      },
      {
        time: "8 PM",
        icon: "🌧️",
        temp: 29,
        feelsLike: 31,
        rain: 70,
        wind: 18,
        humidity: 85,
      },
      {
        time: "10 PM",
        icon: "⛅",
        temp: 27,
        feelsLike: 28,
        rain: 20,
        wind: 14,
        humidity: 78,
      },
    ],
  },
  {
    day: "Wed",
    date: "Wed, Mar 12",
    icon: "🌤️",
    condition: "Mostly Sunny",
    high: 35,
    low: 25,
    rain: 15,
    humidity: 65,
    wind: 14,
    uv: 8,
    pressure: 1015,
    sunrise: "6:04 AM",
    sunset: "6:21 PM",
    hourly: [
      {
        time: "12 AM",
        icon: "🌤️",
        temp: 26,
        feelsLike: 27,
        rain: 5,
        wind: 10,
        humidity: 65,
      },
      {
        time: "2 AM",
        icon: "🌤️",
        temp: 25,
        feelsLike: 26,
        rain: 5,
        wind: 8,
        humidity: 64,
      },
      {
        time: "4 AM",
        icon: "🌤️",
        temp: 25,
        feelsLike: 25,
        rain: 5,
        wind: 8,
        humidity: 63,
      },
      {
        time: "6 AM",
        icon: "🌤️",
        temp: 26,
        feelsLike: 26,
        rain: 5,
        wind: 10,
        humidity: 63,
      },
      {
        time: "8 AM",
        icon: "☀️",
        temp: 29,
        feelsLike: 30,
        rain: 5,
        wind: 12,
        humidity: 61,
      },
      {
        time: "10 AM",
        icon: "☀️",
        temp: 32,
        feelsLike: 34,
        rain: 5,
        wind: 14,
        humidity: 60,
      },
      {
        time: "12 PM",
        icon: "☀️",
        temp: 34,
        feelsLike: 36,
        rain: 10,
        wind: 14,
        humidity: 58,
      },
      {
        time: "2 PM",
        icon: "☀️",
        temp: 35,
        feelsLike: 37,
        rain: 10,
        wind: 14,
        humidity: 57,
      },
      {
        time: "4 PM",
        icon: "🌤️",
        temp: 33,
        feelsLike: 35,
        rain: 15,
        wind: 16,
        humidity: 60,
      },
      {
        time: "6 PM",
        icon: "🌤️",
        temp: 31,
        feelsLike: 32,
        rain: 10,
        wind: 14,
        humidity: 63,
      },
      {
        time: "8 PM",
        icon: "🌤️",
        temp: 29,
        feelsLike: 30,
        rain: 5,
        wind: 12,
        humidity: 65,
      },
      {
        time: "10 PM",
        icon: "🌤️",
        temp: 27,
        feelsLike: 28,
        rain: 5,
        wind: 10,
        humidity: 66,
      },
    ],
  },
  {
    day: "Thu",
    date: "Thu, Mar 13",
    icon: "☀️",
    condition: "Sunny",
    high: 33,
    low: 23,
    rain: 5,
    humidity: 58,
    wind: 10,
    uv: 9,
    pressure: 1016,
    sunrise: "6:03 AM",
    sunset: "6:22 PM",
    hourly: [
      {
        time: "12 AM",
        icon: "☀️",
        temp: 25,
        feelsLike: 25,
        rain: 0,
        wind: 8,
        humidity: 58,
      },
      {
        time: "2 AM",
        icon: "☀️",
        temp: 24,
        feelsLike: 24,
        rain: 0,
        wind: 7,
        humidity: 57,
      },
      {
        time: "4 AM",
        icon: "☀️",
        temp: 23,
        feelsLike: 23,
        rain: 0,
        wind: 7,
        humidity: 56,
      },
      {
        time: "6 AM",
        icon: "☀️",
        temp: 24,
        feelsLike: 24,
        rain: 0,
        wind: 8,
        humidity: 56,
      },
      {
        time: "8 AM",
        icon: "☀️",
        temp: 27,
        feelsLike: 28,
        rain: 0,
        wind: 10,
        humidity: 55,
      },
      {
        time: "10 AM",
        icon: "☀️",
        temp: 30,
        feelsLike: 32,
        rain: 5,
        wind: 10,
        humidity: 54,
      },
      {
        time: "12 PM",
        icon: "☀️",
        temp: 32,
        feelsLike: 34,
        rain: 5,
        wind: 10,
        humidity: 53,
      },
      {
        time: "2 PM",
        icon: "☀️",
        temp: 33,
        feelsLike: 35,
        rain: 5,
        wind: 10,
        humidity: 52,
      },
      {
        time: "4 PM",
        icon: "☀️",
        temp: 31,
        feelsLike: 33,
        rain: 5,
        wind: 12,
        humidity: 54,
      },
      {
        time: "6 PM",
        icon: "☀️",
        temp: 28,
        feelsLike: 29,
        rain: 0,
        wind: 10,
        humidity: 56,
      },
      {
        time: "8 PM",
        icon: "☀️",
        temp: 26,
        feelsLike: 27,
        rain: 0,
        wind: 8,
        humidity: 57,
      },
      {
        time: "10 PM",
        icon: "☀️",
        temp: 25,
        feelsLike: 25,
        rain: 0,
        wind: 7,
        humidity: 58,
      },
    ],
  },
  {
    day: "Fri",
    date: "Fri, Mar 14",
    icon: "⛅",
    condition: "Partly Cloudy",
    high: 34,
    low: 24,
    rain: 20,
    humidity: 68,
    wind: 16,
    uv: 7,
    pressure: 1013,
    sunrise: "6:03 AM",
    sunset: "6:22 PM",
    hourly: [
      {
        time: "12 AM",
        icon: "⛅",
        temp: 25,
        feelsLike: 26,
        rain: 5,
        wind: 10,
        humidity: 68,
      },
      {
        time: "2 AM",
        icon: "⛅",
        temp: 25,
        feelsLike: 25,
        rain: 5,
        wind: 10,
        humidity: 68,
      },
      {
        time: "4 AM",
        icon: "⛅",
        temp: 24,
        feelsLike: 24,
        rain: 5,
        wind: 10,
        humidity: 67,
      },
      {
        time: "6 AM",
        icon: "⛅",
        temp: 25,
        feelsLike: 26,
        rain: 10,
        wind: 12,
        humidity: 68,
      },
      {
        time: "8 AM",
        icon: "⛅",
        temp: 28,
        feelsLike: 30,
        rain: 10,
        wind: 14,
        humidity: 67,
      },
      {
        time: "10 AM",
        icon: "⛅",
        temp: 31,
        feelsLike: 33,
        rain: 15,
        wind: 16,
        humidity: 65,
      },
      {
        time: "12 PM",
        icon: "⛅",
        temp: 33,
        feelsLike: 35,
        rain: 15,
        wind: 16,
        humidity: 63,
      },
      {
        time: "2 PM",
        icon: "☀️",
        temp: 34,
        feelsLike: 36,
        rain: 10,
        wind: 16,
        humidity: 61,
      },
      {
        time: "4 PM",
        icon: "🌤️",
        temp: 32,
        feelsLike: 34,
        rain: 20,
        wind: 18,
        humidity: 65,
      },
      {
        time: "6 PM",
        icon: "🌦️",
        temp: 30,
        feelsLike: 32,
        rain: 20,
        wind: 16,
        humidity: 70,
      },
      {
        time: "8 PM",
        icon: "⛅",
        temp: 27,
        feelsLike: 28,
        rain: 10,
        wind: 14,
        humidity: 72,
      },
      {
        time: "10 PM",
        icon: "⛅",
        temp: 26,
        feelsLike: 27,
        rain: 5,
        wind: 12,
        humidity: 70,
      },
    ],
  },
  {
    day: "Sat",
    date: "Sat, Mar 15",
    icon: "🌦️",
    condition: "Light Rain",
    high: 32,
    low: 23,
    rain: 55,
    humidity: 80,
    wind: 22,
    uv: 4,
    pressure: 1008,
    sunrise: "6:03 AM",
    sunset: "6:22 PM",
    hourly: [
      {
        time: "12 AM",
        icon: "🌦️",
        temp: 25,
        feelsLike: 27,
        rain: 30,
        wind: 16,
        humidity: 78,
      },
      {
        time: "2 AM",
        icon: "🌦️",
        temp: 24,
        feelsLike: 26,
        rain: 35,
        wind: 16,
        humidity: 79,
      },
      {
        time: "4 AM",
        icon: "🌧️",
        temp: 24,
        feelsLike: 26,
        rain: 50,
        wind: 18,
        humidity: 81,
      },
      {
        time: "6 AM",
        icon: "🌧️",
        temp: 24,
        feelsLike: 26,
        rain: 55,
        wind: 20,
        humidity: 82,
      },
      {
        time: "8 AM",
        icon: "🌧️",
        temp: 26,
        feelsLike: 28,
        rain: 60,
        wind: 22,
        humidity: 83,
      },
      {
        time: "10 AM",
        icon: "🌦️",
        temp: 28,
        feelsLike: 30,
        rain: 55,
        wind: 22,
        humidity: 81,
      },
      {
        time: "12 PM",
        icon: "🌦️",
        temp: 30,
        feelsLike: 33,
        rain: 50,
        wind: 20,
        humidity: 80,
      },
      {
        time: "2 PM",
        icon: "🌦️",
        temp: 32,
        feelsLike: 35,
        rain: 45,
        wind: 20,
        humidity: 78,
      },
      {
        time: "4 PM",
        icon: "🌧️",
        temp: 31,
        feelsLike: 33,
        rain: 60,
        wind: 22,
        humidity: 82,
      },
      {
        time: "6 PM",
        icon: "🌧️",
        temp: 29,
        feelsLike: 31,
        rain: 65,
        wind: 20,
        humidity: 84,
      },
      {
        time: "8 PM",
        icon: "🌦️",
        temp: 27,
        feelsLike: 29,
        rain: 50,
        wind: 18,
        humidity: 82,
      },
      {
        time: "10 PM",
        icon: "🌦️",
        temp: 25,
        feelsLike: 27,
        rain: 40,
        wind: 16,
        humidity: 80,
      },
    ],
  },
  {
    day: "Sun",
    date: "Sun, Mar 16",
    icon: "🌧️",
    condition: "Rain",
    high: 30,
    low: 22,
    rain: 75,
    humidity: 88,
    wind: 26,
    uv: 2,
    pressure: 1005,
    sunrise: "6:02 AM",
    sunset: "6:23 PM",
    hourly: [
      {
        time: "12 AM",
        icon: "🌧️",
        temp: 24,
        feelsLike: 26,
        rain: 65,
        wind: 22,
        humidity: 86,
      },
      {
        time: "2 AM",
        icon: "🌧️",
        temp: 23,
        feelsLike: 25,
        rain: 70,
        wind: 24,
        humidity: 87,
      },
      {
        time: "4 AM",
        icon: "⛈️",
        temp: 23,
        feelsLike: 25,
        rain: 80,
        wind: 26,
        humidity: 88,
      },
      {
        time: "6 AM",
        icon: "⛈️",
        temp: 23,
        feelsLike: 25,
        rain: 85,
        wind: 28,
        humidity: 89,
      },
      {
        time: "8 AM",
        icon: "🌧️",
        temp: 25,
        feelsLike: 27,
        rain: 80,
        wind: 26,
        humidity: 88,
      },
      {
        time: "10 AM",
        icon: "🌧️",
        temp: 27,
        feelsLike: 29,
        rain: 75,
        wind: 26,
        humidity: 87,
      },
      {
        time: "12 PM",
        icon: "🌧️",
        temp: 29,
        feelsLike: 32,
        rain: 75,
        wind: 24,
        humidity: 86,
      },
      {
        time: "2 PM",
        icon: "🌧️",
        temp: 30,
        feelsLike: 33,
        rain: 70,
        wind: 24,
        humidity: 85,
      },
      {
        time: "4 PM",
        icon: "🌧️",
        temp: 29,
        feelsLike: 32,
        rain: 75,
        wind: 26,
        humidity: 87,
      },
      {
        time: "6 PM",
        icon: "🌧️",
        temp: 27,
        feelsLike: 29,
        rain: 80,
        wind: 24,
        humidity: 88,
      },
      {
        time: "8 PM",
        icon: "🌧️",
        temp: 25,
        feelsLike: 27,
        rain: 70,
        wind: 22,
        humidity: 87,
      },
      {
        time: "10 PM",
        icon: "🌦️",
        temp: 24,
        feelsLike: 26,
        rain: 55,
        wind: 20,
        humidity: 86,
      },
    ],
  },
  {
    day: "Mon",
    date: "Mon, Mar 17",
    icon: "⛅",
    condition: "Partly Cloudy",
    high: 33,
    low: 23,
    rain: 30,
    humidity: 70,
    wind: 15,
    uv: 6,
    pressure: 1011,
    sunrise: "6:02 AM",
    sunset: "6:23 PM",
    hourly: [
      {
        time: "12 AM",
        icon: "⛅",
        temp: 24,
        feelsLike: 25,
        rain: 20,
        wind: 12,
        humidity: 70,
      },
      {
        time: "2 AM",
        icon: "⛅",
        temp: 23,
        feelsLike: 24,
        rain: 20,
        wind: 12,
        humidity: 70,
      },
      {
        time: "4 AM",
        icon: "⛅",
        temp: 23,
        feelsLike: 24,
        rain: 20,
        wind: 12,
        humidity: 69,
      },
      {
        time: "6 AM",
        icon: "⛅",
        temp: 24,
        feelsLike: 25,
        rain: 25,
        wind: 14,
        humidity: 70,
      },
      {
        time: "8 AM",
        icon: "⛅",
        temp: 26,
        feelsLike: 28,
        rain: 25,
        wind: 14,
        humidity: 69,
      },
      {
        time: "10 AM",
        icon: "🌤️",
        temp: 29,
        feelsLike: 31,
        rain: 20,
        wind: 15,
        humidity: 67,
      },
      {
        time: "12 PM",
        icon: "🌤️",
        temp: 31,
        feelsLike: 33,
        rain: 20,
        wind: 15,
        humidity: 65,
      },
      {
        time: "2 PM",
        icon: "🌤️",
        temp: 33,
        feelsLike: 35,
        rain: 25,
        wind: 15,
        humidity: 63,
      },
      {
        time: "4 PM",
        icon: "⛅",
        temp: 31,
        feelsLike: 33,
        rain: 30,
        wind: 16,
        humidity: 67,
      },
      {
        time: "6 PM",
        icon: "🌦️",
        temp: 29,
        feelsLike: 31,
        rain: 35,
        wind: 14,
        humidity: 70,
      },
      {
        time: "8 PM",
        icon: "⛅",
        temp: 27,
        feelsLike: 28,
        rain: 25,
        wind: 12,
        humidity: 71,
      },
      {
        time: "10 PM",
        icon: "⛅",
        temp: 25,
        feelsLike: 26,
        rain: 20,
        wind: 12,
        humidity: 71,
      },
    ],
  },
]

const UV_LABEL = (uv: number) =>
  uv <= 2
    ? { label: "Low", color: "text-green-400" }
    : uv <= 5
      ? { label: "Moderate", color: "text-yellow-400" }
      : uv <= 7
        ? { label: "High", color: "text-orange-400" }
        : uv <= 10
          ? { label: "Very High", color: "text-red-400" }
          : { label: "Extreme", color: "text-purple-400" }

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

export default function ForecastPage() {
  const [activeDay, setActiveDay] = useState(0)
  const day = DAYS[activeDay]
  const uv = UV_LABEL(day.uv)
  const maxRain = Math.max(...day.hourly.map((h) => h.rain))
  const peakHour = day.hourly.find((h) => h.rain === maxRain)

  return (
    <div className="flex flex-col gap-4">
      {/* ── Row 2: Summary bar ────────────────── */}
      <div
        className="rounded-2xl px-5 py-3 flex flex-wrap items-center justify-between gap-3"
        style={{
          background: "rgba(59,130,246,0.06)",
          border: "1px solid rgba(59,130,246,0.15)",
        }}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{day.icon}</span>
          <div>
            <p
              className="text-sm font-semibold text-slate-100"
              style={{ fontFamily: "var(--font-d)" }}
            >
              {day.day} — {day.condition}
            </p>
            <p className="text-xs text-slate-400">{day.date}</p>
          </div>
        </div>
        <div className="flex items-center gap-5 flex-wrap">
          {[
            { label: "High", value: `${day.high}°C` },
            { label: "Low", value: `${day.low}°C` },
            { label: "Rain", value: `${day.rain}%` },
            { label: "Wind", value: `${day.wind} km/h` },
            { label: "Humidity", value: `${day.humidity}%` },
            { label: "Pressure", value: `${day.pressure} hPa` },
            { label: "Sunrise", value: day.sunrise },
            { label: "Sunset", value: day.sunset },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">
                {s.label}
              </p>
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

      {/* ── Row 1: Day selector ───────────────── */}
      <div className="grid grid-cols-7 gap-2">
        {DAYS.map((d, i) => (
          <button
            key={i}
            onClick={() => setActiveDay(i)}
            className={`flex flex-col items-center py-4 px-2 rounded-2xl
                        transition-all duration-200 border
                        ${
                          i === activeDay
                            ? "border-blue-500/40 -translate-y-0.5"
                            : "border-white/[0.07] hover:border-white/15 hover:-translate-y-0.5"
                        }`}
            style={{
              background:
                i === activeDay
                  ? "rgba(59,130,246,0.1)"
                  : "rgba(255,255,255,0.03)",
            }}
          >
            <p
              className={`text-xs font-semibold mb-2
                           ${i === activeDay ? "text-blue-400" : "text-slate-400"}`}
            >
              {d.day}
            </p>
            <p className="text-2xl mb-2">{d.icon}</p>
            <p
              className="text-sm font-bold text-slate-100"
              style={{ fontFamily: "var(--font-d)" }}
            >
              {d.high}°
            </p>
            <p className="text-xs text-slate-500">{d.low}°</p>
            <p
              className={`text-[10px] mt-1.5 ${d.rain >= 50 ? "text-blue-400" : "text-slate-600"}`}
            >
              💧{d.rain}%
            </p>
          </button>
        ))}
      </div>

      {/* ── Row 3: Hourly detail table ────────── */}
      <Card>
        <SectionLabel>Hourly detail</SectionLabel>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                {[
                  "Time",
                  "Condition",
                  "Temp",
                  "Feels Like",
                  "Rain",
                  "Wind",
                  "Humidity",
                ].map((col) => (
                  <th
                    key={col}
                    className="text-left text-[11px] font-semibold text-slate-500
                               uppercase tracking-wider pb-3 pr-4 whitespace-nowrap"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {day.hourly.map((h, i) => (
                <tr
                  key={i}
                  className={`transition-colors duration-150
                              ${h.rain >= 50 ? "bg-blue-500/[0.04]" : "hover:bg-white/[0.02]"}`}
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                >
                  <td className="py-2.5 pr-4 text-xs font-semibold text-slate-300 whitespace-nowrap">
                    {h.time}
                  </td>
                  <td className="py-2.5 pr-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{h.icon}</span>
                    </div>
                  </td>
                  <td
                    className="py-2.5 pr-4 text-xs font-bold text-slate-100 whitespace-nowrap"
                    style={{ fontFamily: "var(--font-d)" }}
                  >
                    {h.temp}°C
                  </td>
                  <td className="py-2.5 pr-4 text-xs text-slate-400 whitespace-nowrap">
                    {h.feelsLike}°C
                  </td>
                  <td className="py-2.5 pr-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${h.rain >= 50 ? "bg-blue-500" : "bg-blue-500/40"}`}
                          style={{ width: `${h.rain}%` }}
                        />
                      </div>
                      <span
                        className={`text-xs ${h.rain >= 50 ? "text-blue-400" : "text-slate-500"}`}
                      >
                        {h.rain}%
                      </span>
                    </div>
                  </td>
                  <td className="py-2.5 pr-4 text-xs text-slate-400 whitespace-nowrap">
                    {h.wind} km/h
                  </td>
                  <td className="py-2.5 text-xs text-slate-400 whitespace-nowrap">
                    {h.humidity}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ── Row 5: UV + Rain chart ────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* UV Index */}
        <Card>
          <SectionLabel>UV Index</SectionLabel>
          <div className="flex items-baseline gap-3 mb-3">
            <span
              className="font-extrabold text-slate-100 leading-none"
              style={{
                fontFamily: "var(--font-d)",
                fontSize: 44,
                letterSpacing: -2,
              }}
            >
              {day.uv}
            </span>
            <span className={`text-sm font-semibold ${uv.color}`}>
              {uv.label}
            </span>
          </div>
          <div
            className="relative h-2 rounded-full mb-2 overflow-hidden"
            style={{
              background:
                "linear-gradient(to right, #22c55e, #eab308, #f97316, #ef4444, #9333ea)",
            }}
          >
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5
                         rounded-full bg-white border-2 border-slate-800"
              style={{
                left: `${(day.uv / 11) * 100}%`,
                transform: "translate(-50%, -50%)",
              }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-600 mb-4">
            <span>Low</span>
            <span>Moderate</span>
            <span>High</span>
            <span>V.High</span>
            <span>Extreme</span>
          </div>
          <div
            className={`px-4 py-3 rounded-xl text-xs leading-relaxed
                        ${
                          day.uv >= 6
                            ? "bg-orange-500/10 border border-orange-500/20 text-orange-300"
                            : "bg-green-500/10 border border-green-500/20 text-green-300"
                        }`}
          >
            {day.uv >= 8
              ? "Very high UV — sunscreen and protective clothing recommended."
              : day.uv >= 6
                ? "High UV — apply SPF 30+ sunscreen when going outdoors."
                : day.uv >= 3
                  ? "Moderate UV — sunscreen recommended for extended time outside."
                  : "Low UV — minimal protection needed today."}
          </div>
        </Card>

        {/* Rain probability chart */}
        <Card>
          <SectionLabel>Rain probability by hour</SectionLabel>
          <div className="flex items-end gap-1 h-24 mb-2">
            {day.hourly.map((h, i) => (
              <div
                key={i}
                className="flex-1 flex flex-col items-center justify-end h-full"
              >
                <div
                  className={`w-full rounded-t-sm transition-all duration-300
                              ${h.rain >= 50 ? "bg-blue-500" : "bg-blue-500/30"}`}
                  style={{ height: `${h.rain}%`, minHeight: 2 }}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between mb-3">
            {day.hourly
              .filter((_, i) => i % 3 === 0)
              .map((h) => (
                <p key={h.time} className="text-[10px] text-slate-600">
                  {h.time}
                </p>
              ))}
          </div>
          <div
            className="flex items-center justify-between pt-3"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
          >
            <p className="text-xs text-slate-400">Peak rain chance</p>
            <p
              className="text-sm font-bold text-blue-400"
              style={{ fontFamily: "var(--font-d)" }}
            >
              {maxRain}% at {peakHour?.time}
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
