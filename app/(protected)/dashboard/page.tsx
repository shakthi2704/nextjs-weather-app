import Link from "next/link"

// ── Static demo data ───────────────────────────
const CURRENT = {
  city: "Negombo",
  country: "Sri Lanka",
  temp: 34,
  feelsLike: 38,
  high: 36,
  low: 24,
  condition: "Partly Cloudy",
  icon: "⛅",
  humidity: 72,
  wind: 18,
  uv: 7,
  pressure: 1012,
  sunrise: "6:04 AM",
  sunset: "6:21 PM",
  visibility: 10,
  dewPoint: 26,
}

const HOURLY = [
  { time: "Now", icon: "⛅", temp: 34, rain: 10 },
  { time: "1 PM", icon: "⛅", temp: 35, rain: 10 },
  { time: "2 PM", icon: "☀️", temp: 36, rain: 5 },
  { time: "3 PM", icon: "☀️", temp: 36, rain: 5 },
  { time: "4 PM", icon: "🌦️", temp: 34, rain: 40 },
  { time: "5 PM", icon: "🌧️", temp: 32, rain: 70 },
  { time: "6 PM", icon: "🌧️", temp: 31, rain: 80 },
  { time: "7 PM", icon: "⛈️", temp: 29, rain: 85 },
  { time: "8 PM", icon: "🌧️", temp: 28, rain: 60 },
  { time: "9 PM", icon: "🌦️", temp: 27, rain: 35 },
  { time: "10 PM", icon: "⛅", temp: 26, rain: 20 },
  { time: "11 PM", icon: "🌤️", temp: 25, rain: 10 },
]

const DAILY = [
  {
    day: "Today",
    icon: "⛅",
    high: 36,
    low: 24,
    rain: 40,
    condition: "Partly Cloudy",
  },
  {
    day: "Wed",
    icon: "🌤️",
    high: 35,
    low: 25,
    rain: 15,
    condition: "Mostly Sunny",
  },
  { day: "Thu", icon: "☀️", high: 33, low: 23, rain: 5, condition: "Sunny" },
  {
    day: "Fri",
    icon: "⛅",
    high: 34,
    low: 24,
    rain: 20,
    condition: "Partly Cloudy",
  },
  {
    day: "Sat",
    icon: "🌦️",
    high: 32,
    low: 23,
    rain: 55,
    condition: "Light Rain",
  },
  { day: "Sun", icon: "🌧️", high: 30, low: 22, rain: 75, condition: "Rain" },
  {
    day: "Mon",
    icon: "⛅",
    high: 33,
    low: 23,
    rain: 30,
    condition: "Partly Cloudy",
  },
]

const AQI_ITEMS = [
  { label: "PM2.5", value: "12 µg" },
  { label: "PM10", value: "28 µg" },
  { label: "NO₂", value: "18 ppb" },
  { label: "CO", value: "0.4 ppm" },
]

const INSIGHTS = [
  {
    icon: "🌧️",
    color: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/20",
    text: "Rain expected after 4 PM — carry an umbrella",
  },
  {
    icon: "☀️",
    color: "text-yellow-400",
    bg: "bg-yellow-500/10 border-yellow-500/20",
    text: "UV index peaks at 2 PM — apply sunscreen before going out",
  },
  {
    icon: "🏃",
    color: "text-green-400",
    bg: "bg-green-500/10 border-green-500/20",
    text: "Great morning for outdoor activities before 11 AM",
  },
  {
    icon: "💧",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10 border-cyan-500/20",
    text: "High humidity today — stay hydrated throughout the day",
  },
]

const PRECIP = [
  { day: "Today", mm: 4.2 },
  { day: "Wed", mm: 1.0 },
  { day: "Thu", mm: 0.2 },
  { day: "Fri", mm: 1.8 },
  { day: "Sat", mm: 8.5 },
  { day: "Sun", mm: 12.3 },
  { day: "Mon", mm: 3.1 },
]

// ── Weather condition → hero gradient ─────────
const WEATHER_GRADIENTS: Record<string, string> = {
  Sunny:
    "linear-gradient(135deg, rgba(251,191,36,0.3) 0%, rgba(245,158,11,0.15) 40%, rgba(9,21,37,0.95) 100%)",
  "Partly Cloudy":
    "linear-gradient(135deg, rgba(29,78,216,0.3) 0%, rgba(59,130,246,0.1) 40%, rgba(9,21,37,0.95) 100%)",
  "Mostly Sunny":
    "linear-gradient(135deg, rgba(251,191,36,0.2) 0%, rgba(59,130,246,0.1) 40%, rgba(9,21,37,0.95) 100%)",
  "Light Rain":
    "linear-gradient(135deg, rgba(14,165,233,0.3) 0%, rgba(15,23,42,0.9) 50%, rgba(9,21,37,0.95) 100%)",
  Rain: "linear-gradient(135deg, rgba(30,64,175,0.4) 0%, rgba(15,23,42,0.95) 50%, rgba(9,21,37,0.98) 100%)",
  Thunderstorm:
    "linear-gradient(135deg, rgba(67,20,120,0.4) 0%, rgba(15,23,42,0.98) 50%, rgba(9,21,37,0.98) 100%)",
  Cloudy:
    "linear-gradient(135deg, rgba(71,85,105,0.4) 0%, rgba(30,41,59,0.9)  50%, rgba(9,21,37,0.95) 100%)",
  Foggy:
    "linear-gradient(135deg, rgba(100,116,139,0.3) 0%, rgba(30,41,59,0.9) 50%, rgba(9,21,37,0.95) 100%)",
}

const getHeroGradient = (condition: string) =>
  WEATHER_GRADIENTS[condition] ?? WEATHER_GRADIENTS["Partly Cloudy"]

// ── Moon phase data ────────────────────────────
const MOON = {
  phase: "Waxing Crescent",
  illumination: 28,
  nextFull: "in 8 days",
  emoji: "🌒",
  age: "6.2 days",
  rise: "9:14 AM",
  set: "10:32 PM",
}

// ── Helpers ────────────────────────────────────
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

// ── Page ───────────────────────────────────────
export default function DashboardPage() {
  const maxPrecip = Math.max(...PRECIP.map((p) => p.mm))

  return (
    <div className="flex flex-col gap-4">
      {/* ── Row 1: Hero — full width ──────────── */}
      <div
        className="rounded-2xl p-6 relative overflow-hidden"
        style={{
          background: getHeroGradient(CURRENT.condition),
          border: "1px solid rgba(59,130,246,0.2)",
        }}
      >
        {/* Ambient glow orb */}
        <div
          className="absolute -top-20 right-10 w-80 h-80 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse, rgba(59,130,246,0.12) 0%, transparent 70%)",
          }}
        />

        {/* Decorative weather circle */}
        <div
          className="absolute right-6 top-1/2 -translate-y-1/2 text-[120px] opacity-10
                     pointer-events-none select-none leading-none hidden xl:block"
        >
          {CURRENT.icon}
        </div>

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
          {/* Left — main temp */}
          <div>
            <div className="flex items-center gap-2 text-slate-400 text-xs mb-4">
              <span>📍</span>
              <span>
                {CURRENT.city}, {CURRENT.country}
              </span>
              <Link
                href="/dashboard/favorites"
                className="ml-2 text-xs text-blue-400 hover:text-blue-300 transition-colors"
              >
                + Save
              </Link>
            </div>
            <div className="flex items-end gap-5">
              <span
                className="font-extrabold text-slate-100 leading-none"
                style={{
                  fontFamily: "var(--font-d)",
                  fontSize: 88,
                  letterSpacing: -5,
                }}
              >
                {CURRENT.temp}°
              </span>
              <div className="pb-3">
                <p className="text-5xl mb-2">{CURRENT.icon}</p>
                <div className="flex gap-1.5">
                  <span
                    className="px-2 py-0.5 rounded-lg text-xs font-semibold
                                   bg-red-500/10 text-red-400 border border-red-500/20"
                  >
                    ↑ {CURRENT.high}°
                  </span>
                  <span
                    className="px-2 py-0.5 rounded-lg text-xs font-semibold
                                   bg-blue-500/10 text-blue-400 border border-blue-500/20"
                  >
                    ↓ {CURRENT.low}°
                  </span>
                </div>
              </div>
            </div>
            <p
              className="text-xl font-semibold text-slate-200 mt-1"
              style={{ fontFamily: "var(--font-d)" }}
            >
              {CURRENT.condition}
            </p>
            <p className="text-sm text-slate-400 mt-1">
              Feels like {CURRENT.feelsLike}°C · Humidity {CURRENT.humidity}%
            </p>
          </div>

          {/* Right — stat pills */}
          <div className="flex flex-wrap gap-2.5">
            {[
              { icon: "💨", label: "Wind", value: `${CURRENT.wind} km/h` },
              { icon: "☀️", label: "UV Index", value: `${CURRENT.uv} / 11` },
              {
                icon: "👁️",
                label: "Visibility",
                value: `${CURRENT.visibility} km`,
              },
              {
                icon: "💧",
                label: "Dew Point",
                value: `${CURRENT.dewPoint}°C`,
              },
              { icon: "🌅", label: "Sunrise", value: CURRENT.sunrise },
              { icon: "🌇", label: "Sunset", value: CURRENT.sunset },
            ].map((s) => (
              <div
                key={s.label}
                className="flex flex-col items-center px-4 py-3 rounded-2xl text-center min-w-[76px]"
                style={{
                  background: "rgba(0,0,0,0.25)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <span className="text-xl mb-1">{s.icon}</span>
                <p
                  className="text-xs font-bold text-slate-100"
                  style={{ fontFamily: "var(--font-d)" }}
                >
                  {s.value}
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Card>
        <SectionLabel>Hourly forecast</SectionLabel>
        <div className="grid grid-cols-6 md:grid-cols-12 gap-2">
          {HOURLY.map((h, i) => (
            <div
              key={i}
              className={`flex flex-col items-center gap-1.5 py-3 rounded-xl
                          transition-all duration-200
                          ${
                            i === 0
                              ? "bg-blue-500/15 border border-blue-500/25"
                              : "bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05]"
                          }`}
            >
              <p
                className={`text-[11px] font-medium ${i === 0 ? "text-blue-400" : "text-slate-500"}`}
              >
                {h.time}
              </p>
              <p className="text-xl">{h.icon}</p>
              <p
                className="text-sm font-bold text-slate-100"
                style={{ fontFamily: "var(--font-d)" }}
              >
                {h.temp}°
              </p>
              <p
                className={`text-[11px] ${h.rain >= 50 ? "text-blue-400" : "text-slate-600"}`}
              >
                💧{h.rain}%
              </p>
            </div>
          ))}
        </div>
      </Card>
      s{/* ── Row 2: 3 equal cards ──────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1 — Conditions */}
        <Card>
          <SectionLabel>Current conditions</SectionLabel>
          <div className="grid grid-cols-2 gap-2">
            {[
              {
                icon: "💨",
                label: "Wind",
                value: `${CURRENT.wind} km/h`,
                sub: "SW direction",
              },
              {
                icon: "💧",
                label: "Humidity",
                value: `${CURRENT.humidity}%`,
                sub: "Feels muggy",
              },
              {
                icon: "☀️",
                label: "UV Index",
                value: `${CURRENT.uv} / 11`,
                sub: "High — protect",
              },
              {
                icon: "🔵",
                label: "Pressure",
                value: `${CURRENT.pressure} hPa`,
                sub: "Stable",
              },
            ].map((s) => (
              <div
                key={s.label}
                className="flex items-start gap-2 px-3 py-3 rounded-xl"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <span className="text-base shrink-0">{s.icon}</span>
                <div className="min-w-0">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider">
                    {s.label}
                  </p>
                  <p
                    className="text-sm font-bold text-slate-100 mt-0.5 truncate"
                    style={{ fontFamily: "var(--font-d)" }}
                  >
                    {s.value}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5 truncate">
                    {s.sub}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Card 2 — AQI */}
        <Card>
          <div className="flex items-center justify-between">
            <SectionLabel>Air quality</SectionLabel>
            <Link
              href="/dashboard/air-quality"
              className="text-xs text-blue-400 hover:text-blue-300 transition-colors -mt-3"
            >
              Full report →
            </Link>
          </div>
          <div className="flex items-baseline gap-3 mb-3">
            <span
              className="gradient-text font-extrabold leading-none"
              style={{
                fontFamily: "var(--font-d)",
                fontSize: 40,
                letterSpacing: -2,
              }}
            >
              42
            </span>
            <span
              className="px-2.5 py-1 rounded-lg text-xs font-semibold
                             text-green-400 bg-green-500/10 border border-green-500/20"
            >
              Good
            </span>
          </div>
          <div
            className="relative h-1.5 rounded-full mb-4"
            style={{
              background:
                "linear-gradient(to right, #22c55e, #eab308, #ef4444)",
            }}
          >
            <div
              className="absolute top-1/2 left-[14%] -translate-x-1/2 -translate-y-1/2
                         w-3 h-3 rounded-full bg-white border-2 border-green-400"
              style={{ boxShadow: "0 0 8px rgba(34,197,94,0.6)" }}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            {AQI_ITEMS.map((a) => (
              <div
                key={a.label}
                className="px-3 py-2 rounded-xl"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <p className="text-[10px] text-slate-500">{a.label}</p>
                <p className="text-sm font-semibold text-slate-100 mt-0.5">
                  {a.value}
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* Card 3 — 7-day */}
        <Card>
          <div className="flex items-center justify-between">
            <SectionLabel>7-day forecast</SectionLabel>
            <Link
              href="/dashboard/forecast"
              className="text-xs text-blue-400 hover:text-blue-300 transition-colors -mt-3"
            >
              Full →
            </Link>
          </div>
          <div className="flex flex-col gap-1">
            {DAILY.map((d, i) => (
              <div
                key={i}
                className={`flex items-center gap-2 px-2 py-1.5 rounded-xl transition-colors
                            ${i === 0 ? "bg-blue-500/[0.07]" : "hover:bg-white/[0.03]"}`}
              >
                <p
                  className={`text-xs font-semibold w-9 shrink-0
                               ${i === 0 ? "text-blue-400" : "text-slate-300"}`}
                >
                  {d.day}
                </p>
                <span className="text-base shrink-0">{d.icon}</span>
                <div className="flex-1 h-1 rounded-full bg-white/10 overflow-hidden mx-1">
                  <div
                    className="h-full rounded-full bg-blue-500/50"
                    style={{ width: `${d.rain}%` }}
                  />
                </div>
                <p
                  className={`text-[11px] w-7 text-right shrink-0
                               ${d.rain >= 50 ? "text-blue-400" : "text-slate-600"}`}
                >
                  {d.rain}%
                </p>
                <div className="flex gap-1.5 shrink-0 w-12 justify-end">
                  <span
                    className="text-xs font-bold text-slate-100"
                    style={{ fontFamily: "var(--font-d)" }}
                  >
                    {d.high}°
                  </span>
                  <span className="text-xs text-slate-500">{d.low}°</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
      {/* ── Row 3: Hourly — full width, stretch ── */}
      {/* ── Row 4: Smart Insights + Precip + Moon ─ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Smart Insights */}
        <Card>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-base">⚡</span>
            <SectionLabel>Smart insights</SectionLabel>
          </div>
          <div className="flex flex-col gap-2">
            {INSIGHTS.map((ins, i) => (
              <div
                key={i}
                className={`flex items-start gap-3 px-3.5 py-3 rounded-xl border ${ins.bg}`}
              >
                <span className="text-lg shrink-0">{ins.icon}</span>
                <p className={`text-xs leading-relaxed ${ins.color}`}>
                  {ins.text}
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* Precipitation chart */}
        <Card>
          <SectionLabel>Precipitation this week</SectionLabel>
          <div className="flex items-end justify-between gap-1.5 h-28 mb-2">
            {PRECIP.map((p, i) => (
              <div
                key={i}
                className="flex-1 flex flex-col items-center justify-end gap-1 h-full"
              >
                <p className="text-[10px] text-slate-500">{p.mm}</p>
                <div
                  className="w-full rounded-t-lg overflow-hidden flex items-end"
                  style={{ height: "80%" }}
                >
                  <div
                    className={`w-full rounded-t-lg transition-all duration-500
                                ${i === 0 ? "bg-blue-500" : "bg-blue-500/40"}`}
                    style={{
                      height: `${(p.mm / maxPrecip) * 100}%`,
                      minHeight: 2,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between">
            {PRECIP.map((p) => (
              <p
                key={p.day}
                className="flex-1 text-center text-[10px] text-slate-500"
              >
                {p.day}
              </p>
            ))}
          </div>
          <div
            className="flex items-center justify-between mt-3 pt-3"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
          >
            <p className="text-xs text-slate-400">Total this week</p>
            <p
              className="text-sm font-bold text-blue-400"
              style={{ fontFamily: "var(--font-d)" }}
            >
              {PRECIP.reduce((a, b) => a + b.mm, 0).toFixed(1)} mm
            </p>
          </div>
        </Card>

        {/* Moon phase */}
        <Card>
          <SectionLabel>Moon phase</SectionLabel>

          {/* Moon visual */}
          <div className="flex items-center gap-5 mb-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-5xl
                         shrink-0"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 0 24px rgba(148,163,184,0.08)",
              }}
            >
              {MOON.emoji}
            </div>
            <div>
              <p
                className="text-base font-bold text-slate-100"
                style={{ fontFamily: "var(--font-d)" }}
              >
                {MOON.phase}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                {MOON.illumination}% illuminated
              </p>
              <p className="text-xs text-blue-400 mt-1">
                Full moon {MOON.nextFull}
              </p>
            </div>
          </div>

          {/* Illumination bar */}
          <div className="mb-4">
            <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${MOON.illumination}%`,
                  background:
                    "linear-gradient(to right, rgba(148,163,184,0.4), rgba(241,245,249,0.9))",
                }}
              />
            </div>
          </div>

          {/* Details */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Age", value: MOON.age },
              { label: "Moonrise", value: MOON.rise },
              { label: "Moonset", value: MOON.set },
            ].map((m) => (
              <div
                key={m.label}
                className="text-center px-2 py-2.5 rounded-xl"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <p className="text-[10px] text-slate-500">{m.label}</p>
                <p className="text-xs font-semibold text-slate-200 mt-0.5">
                  {m.value}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
