"use client"

import { useEffect, useRef } from "react"

// ── Preview: Forecast ──────────────────────────
const ForecastPreview = () => {
  const days = [
    { d: "Today", icon: "⛅", t: "34°", active: false },
    { d: "Wed", icon: "🌤️", t: "35°", active: true },
    { d: "Thu", icon: "⛅", t: "34°", active: false },
    { d: "Fri", icon: "☀️", t: "33°", active: false },
    { d: "Sat", icon: "🌦️", t: "32°", active: false },
    { d: "Sun", icon: "⛅", t: "34°", active: false },
    { d: "Mon", icon: "🌧️", t: "31°", active: false },
  ]
  return (
    <div className="mt-5 rounded-xl bg-black/20 border border-white/[0.07] p-3 flex gap-2">
      {days.map((d) => (
        <div
          key={d.d}
          className={`flex-1 text-center px-1 py-2 rounded-lg
            ${
              d.active
                ? "bg-blue-500/15 border border-blue-500/30"
                : "bg-white/[0.03]"
            }`}
        >
          <p className="text-[10px] text-slate-500 mb-1">{d.d}</p>
          <p className="text-base mb-1">{d.icon}</p>
          <p
            className="text-[13px] font-bold text-slate-100"
            style={{ fontFamily: "var(--font-d)" }}
          >
            {d.t}
          </p>
        </div>
      ))}
    </div>
  )
}

// ── Preview: AQI ───────────────────────────────
const AQIPreview = () => (
  <div className="mt-5">
    <div className="flex items-baseline gap-3 mb-3">
      <span
        className="gradient-text font-extrabold leading-none text-white"
        style={{ fontFamily: "var(--font-d)", fontSize: 40, letterSpacing: -2 }}
      >
        42
      </span>
      <span
        className="px-3 py-1 rounded-lg text-xs font-semibold
                       text-green-400 bg-green-500/10 border border-green-500/20"
      >
        Good
      </span>
    </div>
    <div
      className="relative h-1.5 rounded-full mb-3"
      style={{
        background: "linear-gradient(to right, #22c55e, #eab308, #ef4444)",
      }}
    >
      <div
        className="absolute top-1/2 left-[14%] -translate-x-1/2 -translate-y-1/2
                   w-3 h-3 rounded-full bg-white border-2 border-green-400"
        style={{ boxShadow: "0 0 8px rgba(34,197,94,0.5)" }}
      />
    </div>
    <div className="grid grid-cols-2 gap-2 mt-3">
      {[
        ["PM2.5", "12 µg"],
        ["PM10", "28 µg"],
        ["NO2", "18 ppb"],
        ["CO", "0.4 ppm"],
      ].map(([l, v]) => (
        <div
          key={l}
          className="bg-black/20 rounded-xl px-3 py-2 border border-white/[0.07]"
        >
          <p className="text-[10px] text-slate-500">{l}</p>
          <p className="text-sm font-semibold text-slate-100">{v}</p>
        </div>
      ))}
    </div>
  </div>
)

// ── Preview: Map ───────────────────────────────
const MapPreview = () => (
  <div className="mt-5 rounded-xl overflow-hidden border border-white/[0.07] h-32 relative bg-black/30">
    <div
      className="absolute inset-0"
      style={{
        background:
          "radial-gradient(ellipse at 40% 60%, rgba(59,130,246,0.3) 0%, transparent 60%)," +
          "radial-gradient(ellipse at 70% 30%, rgba(14,165,233,0.2) 0%, transparent 50%)",
      }}
    />
    <div className="absolute inset-0 flex items-center justify-center text-xs text-slate-500">
      🗺️ &nbsp; Interactive map in dashboard
    </div>
  </div>
)

// ── Preview: Alerts ────────────────────────────
const AlertsPreview = () => (
  <div className="mt-4 flex flex-col gap-2">
    <div
      className="flex items-start gap-3 p-3.5 rounded-xl
                    bg-yellow-500/[0.08] border border-yellow-500/20"
    >
      <span className="text-xl shrink-0">⛈️</span>
      <p className="text-sm text-slate-300 leading-relaxed">
        <strong className="text-slate-100 font-semibold">
          Thunderstorm Warning
        </strong>
        <br />
        Heavy rain and lightning expected 4 to 8 PM.
      </p>
    </div>
    <div
      className="flex items-start gap-3 p-3.5 rounded-xl
                    bg-blue-500/[0.08] border border-blue-500/20"
    >
      <span className="text-xl shrink-0">💨</span>
      <p className="text-sm text-slate-300 leading-relaxed">
        <strong className="text-slate-100 font-semibold">Wind Advisory</strong>
        <br />
        Strong SW gusts up to 45 km/h tonight.
      </p>
    </div>
  </div>
)

// ── Preview: Compare ───────────────────────────
const ComparePreview = () => {
  const cities = [
    { name: "Colombo", temp: "34°", icon: "⛅", rain: "35%" },
    { name: "London", temp: "12°", icon: "🌧️", rain: "80%" },
    { name: "New York", temp: "18°", icon: "🌤️", rain: "20%" },
  ]
  return (
    <div className="mt-5 flex flex-col gap-2">
      {cities.map((c) => (
        <div
          key={c.name}
          className="flex items-center justify-between px-4 py-3 rounded-xl
                     bg-black/20 border border-white/[0.07]"
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">{c.icon}</span>
            <span className="text-sm font-medium text-slate-200">{c.name}</span>
          </div>
          <div className="flex items-center gap-4">
            <span
              className="text-sm font-bold text-slate-100"
              style={{ fontFamily: "var(--font-d)" }}
            >
              {c.temp}
            </span>
            <span className="text-xs text-blue-400">💧{c.rain}</span>
          </div>
        </div>
      ))}
      <p className="text-[11px] text-slate-500 text-center mt-1">
        + Add city to compare
      </p>
    </div>
  )
}

// ── Preview: Insights ──────────────────────────
const InsightsPreview = () => {
  const insights = [
    {
      icon: "🌧️",
      color: "text-blue-400",
      bg: "bg-blue-500/10  border-blue-500/20",
      text: "Rain expected after 4 PM — carry an umbrella",
    },
    {
      icon: "☀️",
      color: "text-yellow-400",
      bg: "bg-yellow-500/10 border-yellow-500/20",
      text: "UV index peaks at 2 PM — apply sunscreen",
    },
    {
      icon: "🏃",
      color: "text-green-400",
      bg: "bg-green-500/10 border-green-500/20",
      text: "Great morning for outdoor activities before 11 AM",
    },
  ]
  return (
    <div className="mt-5 flex flex-col gap-2">
      {insights.map((ins, i) => (
        <div
          key={i}
          className={`flex items-start gap-3 px-4 py-3 rounded-xl border ${ins.bg}`}
        >
          <span className="text-lg shrink-0">{ins.icon}</span>
          <p className={`text-sm leading-relaxed ${ins.color}`}>{ins.text}</p>
        </div>
      ))}
    </div>
  )
}

// ── Card wrapper ───────────────────────────────
interface CardProps {
  icon: string
  title: string
  desc: string
  tags?: string[]
  children?: React.ReactNode
  cardRef: (el: HTMLDivElement | null) => void
  colSpan?: string
}

const FeatureCard = ({
  icon,
  title,
  desc,
  tags,
  children,
  cardRef,
  colSpan = "",
}: CardProps) => (
  <div
    ref={cardRef}
    className={`
      opacity-0 translate-y-6 transition-all duration-500
      relative overflow-hidden cursor-default
      rounded-3xl p-7
      bg-white/[0.04] border border-white/[0.07]
      hover:border-blue-500/25 hover:-translate-y-1
      hover:shadow-[0_16px_48px_rgba(0,0,0,0.4)]
      ${colSpan}
    `}
  >
    <div
      className="w-12 h-12 rounded-xl flex items-center justify-center
                    text-xl mb-5 bg-blue-500/10 border border-blue-500/20"
    >
      {icon}
    </div>
    <h3
      className="font-bold text-lg text-slate-100 mb-2.5"
      style={{ fontFamily: "var(--font-d)" }}
    >
      {title}
    </h3>
    <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
    {tags && (
      <div className="flex flex-wrap gap-1.5 mt-4">
        {tags.map((t) => (
          <span
            key={t}
            className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold
                       text-blue-300 bg-blue-500/[0.08] border border-blue-500/15"
          >
            {t}
          </span>
        ))}
      </div>
    )}
    {children}
  </div>
)

// ── Main component ─────────────────────────────
const FeaturesGrid = () => {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const setRef = (i: number) => (el: HTMLDivElement | null) => {
    cardRefs.current[i] = el
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add("opacity-100", "translate-y-0")
              entry.target.classList.remove("opacity-0", "translate-y-6")
            }, i * 80)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 },
    )
    cardRefs.current.forEach((el) => {
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  return (
    <section id="features" className="relative z-10 px-6 md:px-12 pb-24">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="flex items-center gap-2.5 mb-4">
          <span className="w-6 h-0.5 rounded-full bg-blue-500" />
          <span className="text-xs font-semibold text-blue-400 uppercase tracking-[2px]">
            Everything you need
          </span>
        </div>
        <h2
          className="font-extrabold text-slate-100 mb-4 leading-tight"
          style={{
            fontFamily: "var(--font-d)",
            fontSize: "clamp(28px, 4vw, 44px)",
            letterSpacing: -1.5,
          }}
        >
          Built for weather obsessives
        </h2>
        <p className="text-slate-400 text-base mb-12 max-w-xl leading-relaxed">
          Every data point you need, visualised beautifully. From hourly rain
          probability to real-time air quality — all in one place.
        </p>

        {/* ── Grid ─────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Row 1: Forecast (×2) + AQI (×1) */}
          <FeatureCard
            cardRef={setRef(0)}
            colSpan="lg:col-span-2"
            icon="📅"
            title="7-Day Forecast"
            desc="Detailed daily predictions with high/low temperatures, precipitation probability, wind speed, and UV index."
            tags={["Open-Meteo", "Hourly resolution", "Rain probability"]}
          >
            <ForecastPreview />
          </FeatureCard>

          <FeatureCard
            cardRef={setRef(1)}
            icon="💨"
            title="Air Quality Index"
            desc="Real-time pollution data — PM2.5, PM10, NO2, CO with color-coded severity and health recommendations."
          >
            <AQIPreview />
          </FeatureCard>

          {/* Row 2: Map (×1) + Alerts (×2) */}
          <FeatureCard
            cardRef={setRef(2)}
            icon="🗺️"
            title="Radar Map"
            desc="Live rain radar, cloud movement, storm tracking and temperature heatmaps on an interactive map."
            tags={["Leaflet.js", "Rain radar", "Storm tracking"]}
          >
            <MapPreview />
          </FeatureCard>

          <FeatureCard
            cardRef={setRef(3)}
            colSpan="lg:col-span-2"
            icon="⚠️"
            title="Weather Alerts"
            desc="Instant notifications for storms, floods, heat advisories, and extreme conditions powered by OpenWeatherMap."
          >
            <AlertsPreview />
          </FeatureCard>

          {/* Row 3: Compare (×1) + Insights (×2) */}
          <FeatureCard
            cardRef={setRef(4)}
            icon="⚖️"
            title="City Comparison"
            desc="Compare weather between multiple cities side by side. Perfect for travel planning."
            tags={["Side-by-side", "Up to 4 cities"]}
          >
            <ComparePreview />
          </FeatureCard>

          <FeatureCard
            cardRef={setRef(5)}
            colSpan="lg:col-span-2"
            icon="⚡"
            title="Smart Insights"
            desc="AI-generated weather summaries and activity suggestions based on real-time conditions."
            tags={["Natural language", "Activity suggestions"]}
          >
            <InsightsPreview />
          </FeatureCard>
        </div>
      </div>
    </section>
  )
}

export default FeaturesGrid
