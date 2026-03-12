"use client"

import { useState } from "react"

// ── Types ──────────────────────────────────────
type Section = "location" | "appearance" | "notifications" | "account"

// ── Nav sections ───────────────────────────────
const SECTIONS: { id: Section; label: string; icon: string; desc: string }[] = [
  {
    id: "location",
    label: "Default Location",
    icon: "📍",
    desc: "Home city and location detection",
  },
  {
    id: "appearance",
    label: "Theme & Appearance",
    icon: "🎨",
    desc: "Display, units, and language",
  },
  {
    id: "notifications",
    label: "Notifications",
    icon: "🔔",
    desc: "Alerts, warnings, and reminders",
  },
  {
    id: "account",
    label: "Account & Profile",
    icon: "👤",
    desc: "Personal info and security",
  },
]

const SAVED_LOCATIONS = [
  { id: 1, name: "Negombo", country: "Sri Lanka", icon: "⛅", isDefault: true },
  {
    id: 2,
    name: "Colombo",
    country: "Sri Lanka",
    icon: "🌤️",
    isDefault: false,
  },
  { id: 3, name: "Kandy", country: "Sri Lanka", icon: "🌦️", isDefault: false },
]

// ── Toggle component ───────────────────────────
const Toggle = ({ on, onChange }: { on: boolean; onChange: () => void }) => (
  <button
    onClick={onChange}
    className={`relative w-10 h-5 rounded-full transition-all duration-300 shrink-0
                ${on ? "bg-blue-500" : "bg-white/10"}`}
  >
    <div
      className={`absolute top-0.5 w-4 h-4 rounded-full bg-white
                  shadow transition-all duration-300
                  ${on ? "left-5" : "left-0.5"}`}
    />
  </button>
)

// ── Select component ───────────────────────────
const Select = ({
  value,
  options,
  onChange,
}: {
  value: string
  options: { label: string; value: string }[]
  onChange: (v: string) => void
}) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="text-xs text-slate-200 rounded-xl px-3 py-2 outline-none cursor-pointer"
    style={{
      background: "rgba(255,255,255,0.06)",
      border: "1px solid rgba(255,255,255,0.1)",
    }}
  >
    {options.map((o) => (
      <option key={o.value} value={o.value} style={{ background: "#0a1628" }}>
        {o.label}
      </option>
    ))}
  </select>
)

// ── Row wrapper ────────────────────────────────
const SettingRow = ({
  label,
  desc,
  children,
}: {
  label: string
  desc?: string
  children: React.ReactNode
}) => (
  <div
    className="flex items-center justify-between gap-4 py-4"
    style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
  >
    <div>
      <p className="text-sm text-slate-200 font-medium">{label}</p>
      {desc && <p className="text-xs text-slate-500 mt-0.5">{desc}</p>}
    </div>
    <div className="shrink-0">{children}</div>
  </div>
)

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

const SectionTitle = ({ icon, label }: { icon: string; label: string }) => (
  <div className="flex items-center gap-2 mb-5">
    <span className="text-xl">{icon}</span>
    <h2
      className="text-base font-bold text-slate-100"
      style={{ fontFamily: "var(--font-d)" }}
    >
      {label}
    </h2>
  </div>
)

// ── Page ───────────────────────────────────────
export default function SettingsPage() {
  const [active, setActive] = useState<Section>("location")

  // Location state
  const [locations, setLocations] = useState(SAVED_LOCATIONS)
  const [autoDetect, setAutoDetect] = useState(true)
  const [locSearch, setLocSearch] = useState("")

  // Appearance state
  const [tempUnit, setTempUnit] = useState("celsius")
  const [windUnit, setWindUnit] = useState("kmh")
  const [timeFormat, setTimeFormat] = useState("12h")
  const [language, setLanguage] = useState("en")
  const [dateFormat, setDateFormat] = useState("dmy")

  // Notification state
  const [notifs, setNotifs] = useState({
    severeWeather: true,
    dailySummary: true,
    rainAlert: true,
    uvAlert: false,
    windAlert: false,
    aqiAlert: true,
    weeklyForecast: false,
    pushEnabled: true,
    emailEnabled: false,
  })
  const [alertThreshold, setAlertThreshold] = useState("moderate")
  const [summaryTime, setSummaryTime] = useState("07:00")

  // Account state
  const [profile, setProfile] = useState({
    name: "John Smith",
    email: "john@example.com",
    phone: "",
  })
  const [editMode, setEditMode] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [twoFA, setTwoFA] = useState(false)
  const [sessions] = useState([
    {
      device: "Chrome — MacBook Pro",
      location: "Negombo, LK",
      time: "Active now",
      current: true,
    },
    {
      device: "WeatherWise iOS App",
      location: "Colombo, LK",
      time: "2 hours ago",
      current: false,
    },
    {
      device: "Firefox — Windows PC",
      location: "Kandy, LK",
      time: "3 days ago",
      current: false,
    },
  ])

  const toggleNotif = (key: keyof typeof notifs) =>
    setNotifs((prev) => ({ ...prev, [key]: !prev[key] }))

  const setDefault = (id: number) =>
    setLocations((prev) => prev.map((l) => ({ ...l, isDefault: l.id === id })))

  const removeLocation = (id: number) =>
    setLocations((prev) => prev.filter((l) => l.id !== id))

  return (
    <div className="flex gap-4">
      {/* ── Left nav ──────────────────────────── */}
      <div className="w-64 shrink-0 flex flex-col gap-1.5">
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            onClick={() => setActive(s.id)}
            className={`flex items-start gap-3 px-4 py-3 rounded-2xl text-left
                        transition-all duration-200 border
                        ${
                          active === s.id
                            ? "bg-blue-500/10 border-blue-500/25"
                            : "border-transparent hover:bg-white/[0.03] hover:border-white/[0.07]"
                        }`}
          >
            <span className="text-lg shrink-0 mt-0.5">{s.icon}</span>
            <div>
              <p
                className={`text-sm font-semibold ${active === s.id ? "text-blue-400" : "text-slate-300"}`}
              >
                {s.label}
              </p>
              <p className="text-[10px] text-slate-500 mt-0.5">{s.desc}</p>
            </div>
          </button>
        ))}
      </div>

      {/* ── Right content ─────────────────────── */}
      <div className="flex-1 min-w-0 flex flex-col gap-4">
        {/* ── DEFAULT LOCATION ──────────────────── */}
        {active === "location" && (
          <>
            <Card>
              <SectionTitle icon="📍" label="Default Location" />

              <SettingRow
                label="Auto-detect location"
                desc="Use your device's GPS to detect location automatically"
              >
                <Toggle
                  on={autoDetect}
                  onChange={() => setAutoDetect(!autoDetect)}
                />
              </SettingRow>

              <div className="pt-4">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-3">
                  Saved locations
                </p>
                <div className="flex flex-col gap-2 mb-4">
                  {locations.map((loc) => (
                    <div
                      key={loc.id}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                                  ${loc.isDefault ? "bg-blue-500/[0.08] border border-blue-500/25" : "bg-white/[0.03] border border-white/[0.06]"}`}
                    >
                      <span className="text-xl">{loc.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-100">
                          {loc.name}
                        </p>
                        <p className="text-xs text-slate-500">{loc.country}</p>
                      </div>
                      {loc.isDefault ? (
                        <span
                          className="text-[10px] font-bold text-blue-400 px-2 py-0.5 rounded-lg
                                         bg-blue-500/10 border border-blue-500/20"
                        >
                          Default
                        </span>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setDefault(loc.id)}
                            className="text-[10px] text-slate-500 hover:text-blue-400 transition-colors px-2 py-1
                                       rounded-lg hover:bg-blue-500/10"
                          >
                            Set default
                          </button>
                          <button
                            onClick={() => removeLocation(loc.id)}
                            className="text-[10px] text-slate-600 hover:text-red-400 transition-colors
                                       w-6 h-6 flex items-center justify-center rounded-lg hover:bg-red-500/10"
                          >
                            ✕
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Add location */}
                <div
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <span className="text-slate-500">🔍</span>
                  <input
                    type="text"
                    value={locSearch}
                    onChange={(e) => setLocSearch(e.target.value)}
                    placeholder="Add a new location…"
                    className="flex-1 bg-transparent text-xs text-slate-300 placeholder-slate-600 outline-none"
                  />
                </div>
              </div>
            </Card>
          </>
        )}

        {/* ── APPEARANCE ────────────────────────── */}
        {active === "appearance" && (
          <Card>
            <SectionTitle icon="🎨" label="Theme & Appearance" />

            <SettingRow
              label="Temperature unit"
              desc="Choose how temperatures are displayed"
            >
              <Select
                value={tempUnit}
                onChange={setTempUnit}
                options={[
                  { label: "Celsius (°C)", value: "celsius" },
                  { label: "Fahrenheit (°F)", value: "fahrenheit" },
                ]}
              />
            </SettingRow>

            <SettingRow
              label="Wind speed unit"
              desc="Unit for wind speed readings"
            >
              <Select
                value={windUnit}
                onChange={setWindUnit}
                options={[
                  { label: "km/h", value: "kmh" },
                  { label: "mph", value: "mph" },
                  { label: "m/s", value: "ms" },
                  { label: "knots", value: "knots" },
                ]}
              />
            </SettingRow>

            <SettingRow label="Time format" desc="12-hour or 24-hour clock">
              <Select
                value={timeFormat}
                onChange={setTimeFormat}
                options={[
                  { label: "12-hour (AM/PM)", value: "12h" },
                  { label: "24-hour", value: "24h" },
                ]}
              />
            </SettingRow>

            <SettingRow
              label="Date format"
              desc="How dates appear across the app"
            >
              <Select
                value={dateFormat}
                onChange={setDateFormat}
                options={[
                  { label: "DD/MM/YYYY", value: "dmy" },
                  { label: "MM/DD/YYYY", value: "mdy" },
                  { label: "YYYY-MM-DD", value: "ymd" },
                ]}
              />
            </SettingRow>

            <SettingRow label="Language" desc="App display language">
              <Select
                value={language}
                onChange={setLanguage}
                options={[
                  { label: "English", value: "en" },
                  { label: "Sinhala", value: "si" },
                  { label: "Tamil", value: "ta" },
                  { label: "Japanese", value: "ja" },
                  { label: "French", value: "fr" },
                ]}
              />
            </SettingRow>

            <div
              className="pt-2"
              style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
            >
              <p className="text-xs text-slate-500 uppercase tracking-wider mt-4 mb-3">
                Theme
              </p>
              <div className="flex gap-2">
                {[
                  { label: "Dark", value: "dark", icon: "🌙", active: true },
                  { label: "Light", value: "light", icon: "☀️", active: false },
                  {
                    label: "System",
                    value: "system",
                    icon: "💻",
                    active: false,
                  },
                ].map((t) => (
                  <div
                    key={t.value}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs
                                font-semibold cursor-pointer border transition-all
                                ${
                                  t.active
                                    ? "bg-blue-500/10 border-blue-500/30 text-blue-400"
                                    : "bg-white/[0.03] border-white/[0.07] text-slate-400 hover:border-white/15"
                                }`}
                  >
                    <span>{t.icon}</span>
                    <span>{t.label}</span>
                    {t.active && (
                      <span className="text-[9px] ml-1 opacity-70">✓</span>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-slate-600 mt-2">
                Light theme coming soon.
              </p>
            </div>
          </Card>
        )}

        {/* ── NOTIFICATIONS ─────────────────────── */}
        {active === "notifications" && (
          <>
            <Card>
              <SectionTitle icon="🔔" label="Notifications & Alerts" />

              <SettingRow
                label="Push notifications"
                desc="Receive alerts on this device"
              >
                <Toggle
                  on={notifs.pushEnabled}
                  onChange={() => toggleNotif("pushEnabled")}
                />
              </SettingRow>
              <SettingRow
                label="Email notifications"
                desc="Receive alerts by email"
              >
                <Toggle
                  on={notifs.emailEnabled}
                  onChange={() => toggleNotif("emailEnabled")}
                />
              </SettingRow>
            </Card>

            <Card>
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-4">
                Weather alerts
              </p>
              <SettingRow
                label="Severe weather warnings"
                desc="Storms, floods, and extreme conditions"
              >
                <Toggle
                  on={notifs.severeWeather}
                  onChange={() => toggleNotif("severeWeather")}
                />
              </SettingRow>
              <SettingRow
                label="Rain alerts"
                desc="Notify when rain is expected in your area"
              >
                <Toggle
                  on={notifs.rainAlert}
                  onChange={() => toggleNotif("rainAlert")}
                />
              </SettingRow>
              <SettingRow
                label="High UV index"
                desc="Alert when UV index reaches dangerous levels"
              >
                <Toggle
                  on={notifs.uvAlert}
                  onChange={() => toggleNotif("uvAlert")}
                />
              </SettingRow>
              <SettingRow
                label="Strong wind alerts"
                desc="Notify when wind speeds exceed threshold"
              >
                <Toggle
                  on={notifs.windAlert}
                  onChange={() => toggleNotif("windAlert")}
                />
              </SettingRow>
              <SettingRow
                label="Air quality alerts"
                desc="Notify when AQI exceeds safe levels"
              >
                <Toggle
                  on={notifs.aqiAlert}
                  onChange={() => toggleNotif("aqiAlert")}
                />
              </SettingRow>

              <div
                className="pt-4 mt-2"
                style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
              >
                <SettingRow
                  label="Alert threshold"
                  desc="Minimum severity to trigger an alert"
                >
                  <Select
                    value={alertThreshold}
                    onChange={setAlertThreshold}
                    options={[
                      { label: "All alerts", value: "all" },
                      { label: "Moderate & above", value: "moderate" },
                      { label: "Severe only", value: "severe" },
                    ]}
                  />
                </SettingRow>
              </div>
            </Card>

            <Card>
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-4">
                Scheduled updates
              </p>
              <SettingRow
                label="Daily weather summary"
                desc="Morning briefing for your default location"
              >
                <Toggle
                  on={notifs.dailySummary}
                  onChange={() => toggleNotif("dailySummary")}
                />
              </SettingRow>
              {notifs.dailySummary && (
                <div className="flex items-center justify-between py-3 pl-2">
                  <p className="text-xs text-slate-400">Summary time</p>
                  <input
                    type="time"
                    value={summaryTime}
                    onChange={(e) => setSummaryTime(e.target.value)}
                    className="text-xs text-slate-200 rounded-xl px-3 py-2 outline-none"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                  />
                </div>
              )}
              <SettingRow
                label="Weekly forecast"
                desc="Every Sunday — 7-day outlook for the week ahead"
              >
                <Toggle
                  on={notifs.weeklyForecast}
                  onChange={() => toggleNotif("weeklyForecast")}
                />
              </SettingRow>
            </Card>
          </>
        )}

        {/* ── ACCOUNT ───────────────────────────── */}
        {active === "account" && (
          <>
            {/* Profile */}
            <Card>
              <div className="flex items-center justify-between mb-5">
                <SectionTitle icon="👤" label="Account & Profile" />
                <button
                  onClick={() => setEditMode(!editMode)}
                  className={`text-xs px-3 py-1.5 rounded-xl font-semibold border transition-all
                              ${
                                editMode
                                  ? "bg-blue-500/20 border-blue-500/40 text-blue-400"
                                  : "bg-white/[0.04] border-white/[0.1] text-slate-400 hover:text-slate-200"
                              }`}
                >
                  {editMode ? "Save changes" : "Edit profile"}
                </button>
              </div>

              {/* Avatar */}
              <div className="flex items-center gap-4 mb-6">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold
                             text-blue-400 shrink-0"
                  style={{
                    background: "rgba(59,130,246,0.15)",
                    border: "2px solid rgba(59,130,246,0.3)",
                  }}
                >
                  {profile.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-100">
                    {profile.name}
                  </p>
                  <p className="text-xs text-slate-500">{profile.email}</p>
                  <span
                    className="text-[10px] font-semibold text-blue-400 bg-blue-500/10
                                   border border-blue-500/20 px-2 py-0.5 rounded-lg mt-1 inline-block"
                  >
                    Pro Plan
                  </span>
                </div>
              </div>

              {[
                {
                  label: "Full name",
                  key: "name",
                  type: "text",
                  placeholder: "Your name",
                },
                {
                  label: "Email address",
                  key: "email",
                  type: "email",
                  placeholder: "your@email.com",
                },
                {
                  label: "Phone number",
                  key: "phone",
                  type: "tel",
                  placeholder: "+1 (555) 000-0000",
                },
              ].map((f) => (
                <div key={f.key} className="mb-3">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1.5">
                    {f.label}
                  </p>
                  <input
                    type={f.type}
                    disabled={!editMode}
                    value={(profile as any)[f.key]}
                    onChange={(e) =>
                      setProfile((prev) => ({
                        ...prev,
                        [f.key]: e.target.value,
                      }))
                    }
                    placeholder={f.placeholder}
                    className={`w-full text-sm rounded-xl px-4 py-2.5 outline-none transition-all
                                ${
                                  editMode
                                    ? "text-slate-100 border-blue-500/30"
                                    : "text-slate-300 border-white/[0.08]"
                                }`}
                    style={{
                      background: editMode
                        ? "rgba(59,130,246,0.06)"
                        : "rgba(255,255,255,0.03)",
                      border: `1px solid ${editMode ? "rgba(59,130,246,0.3)" : "rgba(255,255,255,0.08)"}`,
                    }}
                  />
                </div>
              ))}
            </Card>

            {/* Security */}
            <Card>
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-4">
                Security
              </p>

              <SettingRow
                label="Two-factor authentication"
                desc="Add an extra layer of security to your account"
              >
                <Toggle on={twoFA} onChange={() => setTwoFA(!twoFA)} />
              </SettingRow>

              <div
                className="py-4"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-200 font-medium">
                      Password
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Last changed 3 months ago
                    </p>
                  </div>
                  <button
                    onClick={() => setShowPass(!showPass)}
                    className="text-xs text-blue-400 hover:text-blue-300 transition-colors px-3 py-1.5
                               rounded-xl bg-blue-500/10 border border-blue-500/20"
                  >
                    Change password
                  </button>
                </div>
                {showPass && (
                  <div className="mt-3 flex flex-col gap-2">
                    {[
                      "Current password",
                      "New password",
                      "Confirm new password",
                    ].map((lbl) => (
                      <input
                        key={lbl}
                        type="password"
                        placeholder={lbl}
                        className="w-full text-sm rounded-xl px-4 py-2.5 outline-none text-slate-300
                                   placeholder-slate-600"
                        style={{
                          background: "rgba(255,255,255,0.04)",
                          border: "1px solid rgba(255,255,255,0.08)",
                        }}
                      />
                    ))}
                    <button
                      className="self-end text-xs px-4 py-2 rounded-xl font-semibold
                                 bg-blue-500 hover:bg-blue-600 text-white transition-colors mt-1"
                    >
                      Update password
                    </button>
                  </div>
                )}
              </div>
            </Card>

            {/* Active sessions */}
            <Card>
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-4">
                Active sessions
              </p>
              <div className="flex flex-col gap-2">
                {sessions.map((s, i) => (
                  <div
                    key={i}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl
                                ${s.current ? "bg-green-500/[0.06] border border-green-500/15" : "bg-white/[0.03] border border-white/[0.06]"}`}
                  >
                    <div>
                      <p className="text-xs font-semibold text-slate-200">
                        {s.device}
                      </p>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        {s.location} · {s.time}
                      </p>
                    </div>
                    {s.current ? (
                      <span className="text-[10px] text-green-400 font-semibold">
                        Current
                      </span>
                    ) : (
                      <button className="text-[10px] text-slate-600 hover:text-red-400 transition-colors">
                        Revoke
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </Card>

            {/* Danger zone */}
            <Card>
              <p className="text-xs text-red-500/70 uppercase tracking-wider mb-4">
                Danger zone
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-200 font-medium">
                    Delete account
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Permanently delete your account and all data. This cannot be
                    undone.
                  </p>
                </div>
                <button
                  className="text-xs px-4 py-2 rounded-xl font-semibold border transition-all
                             text-red-400 border-red-500/30 bg-red-500/5 hover:bg-red-500/15"
                >
                  Delete account
                </button>
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}
