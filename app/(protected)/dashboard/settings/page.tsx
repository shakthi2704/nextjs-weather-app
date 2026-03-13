// src/app/(protected)/dashboard/settings/page.tsx
"use client"

import { useState, useEffect, useRef } from "react"
import { useToast } from "@/context/ToastContext"
import { useTheme } from "@/context/ThemeContext"

// ── Types ──────────────────────────────────────
interface UserSettings {
  tempUnit: string
  windUnit: string
  theme: string
  language: string
  defaultCity: string | null
  defaultLat: number | null
  defaultLon: number | null
  notifications: boolean
}

interface UserData {
  id: string
  name: string | null
  email: string
  image: string | null
  settings: UserSettings | null
}

interface CityResult {
  name: string
  country: string
  lat: number
  lon: number
}

// ── Options ────────────────────────────────────
const TEMP_UNITS = [
  { value: "C", label: "Celsius (°C)" },
  { value: "F", label: "Fahrenheit (°F)" },
]
const WIND_UNITS = [
  { value: "kmh", label: "km/h" },
  { value: "mph", label: "mph" },
  { value: "ms", label: "m/s" },
]
const THEMES = [
  { value: "dark", label: "🌙 Dark" },
  { value: "light", label: "☀️ Light" },
  { value: "system", label: "💻 System" },
]
const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "es", label: "Español" },
  { value: "fr", label: "Français" },
  { value: "de", label: "Deutsch" },
  { value: "ja", label: "日本語" },
  { value: "zh", label: "中文" },
]

const NAV_ITEMS = [
  { id: "location", icon: "📍", label: "Default Location" },
  { id: "appearance", icon: "🎨", label: "Appearance" },
  { id: "notifications", icon: "🔔", label: "Notifications" },
  { id: "account", icon: "👤", label: "Account" },
]

// ── Sub-components ─────────────────────────────
const Skeleton = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse rounded-xl bg-white/5 ${className}`} />
)

const Select = ({
  value,
  onChange,
  options,
}: {
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
}) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="px-3 py-2 rounded-xl text-sm text-slate-200 outline-none cursor-pointer transition-all"
    style={{
      background: "rgba(255,255,255,0.06)",
      border: "1px solid rgba(255,255,255,0.1)",
    }}
  >
    {options.map((o) => (
      <option key={o.value} value={o.value} style={{ background: "#0d1f3c" }}>
        {o.label}
      </option>
    ))}
  </select>
)

const Toggle = ({
  value,
  onChange,
}: {
  value: boolean
  onChange: (v: boolean) => void
}) => (
  <button
    onClick={() => onChange(!value)}
    className="relative w-11 h-6 rounded-full transition-all duration-300 shrink-0"
    style={{ background: value ? "#3b82f6" : "rgba(255,255,255,0.1)" }}
  >
    <span
      className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all duration-300 shadow-sm"
      style={{ left: value ? "calc(100% - 22px)" : "2px" }}
    />
  </button>
)

const SettingRow = ({
  label,
  description,
  children,
}: {
  label: string
  description?: string
  children: React.ReactNode
}) => (
  <div
    className="flex items-center justify-between gap-4 py-4"
    style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
  >
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-slate-200">{label}</p>
      {description && (
        <p className="text-xs text-slate-500 mt-0.5">{description}</p>
      )}
    </div>
    <div className="shrink-0">{children}</div>
  </div>
)

export default function SettingsPage() {
  const [activeNav, setActiveNav] = useState("location")
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const toast = useToast()
  const [saved, setSaved] = useState(false)
  const [editingName, setEditingName] = useState(false)
  const [editingPass, setEditingPass] = useState(false)

  // Form state
  const [name, setName] = useState("")
  const [tempUnit, setTempUnit] = useState("C")
  const [windUnit, setWindUnit] = useState("kmh")
  const { theme, setTheme } = useTheme()
  const [language, setLanguage] = useState("en")
  const [notifications, setNotifications] = useState(true)

  // Default city search
  const [defaultCity, setDefaultCity] = useState("")
  const [cityQuery, setCityQuery] = useState("")
  const [cityResults, setCityResults] = useState<CityResult[]>([])
  const [citySearching, setCitySearching] = useState(false)
  const [showCityDropdown, setShowCityDropdown] = useState(false)
  const cityRef = useRef<HTMLDivElement>(null)

  // Password fields
  const [currentPass, setCurrentPass] = useState("")
  const [newPass, setNewPass] = useState("")
  const [confirmPass, setConfirmPass] = useState("")
  const [passError, setPassError] = useState("")
  const [savingPass, setSavingPass] = useState(false)

  // Delete account
  const [showDelete, setShowDelete] = useState(false)
  const [deletePass, setDeletePass] = useState("")
  const [deleting, setDeleting] = useState(false)

  // ── Close dropdown on outside click ───────
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (cityRef.current && !cityRef.current.contains(e.target as Node)) {
        setShowCityDropdown(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  // ── City search with debounce ──────────────
  useEffect(() => {
    if (cityQuery.length < 2) {
      setCityResults([])
      return
    }

    const timer = setTimeout(async () => {
      setCitySearching(true)
      try {
        const res = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityQuery)}&count=8&language=en&format=json`,
        )
        const data = await res.json()
        setCityResults(
          (data.results ?? []).map((r: any) => ({
            name: r.name,
            country: r.country ?? "",
            lat: r.latitude,
            lon: r.longitude,
          })),
        )
      } catch {
        setCityResults([])
      } finally {
        setCitySearching(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [cityQuery])

  // ── Load settings from DB ──────────────────
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/settings")
        const data = await res.json()
        setUserData(data)
        setName(data.name ?? "")
        if (data.settings) {
          setTempUnit(data.settings.tempUnit ?? "C")
          setWindUnit(data.settings.windUnit ?? "kmh")
          setTheme((data.settings.theme ?? "dark") as any)
          setLanguage(data.settings.language ?? "en")
          setNotifications(data.settings.notifications ?? true)
          setDefaultCity(data.settings.defaultCity ?? "")
          setCityQuery(data.settings.defaultCity ?? "")
        }
      } catch {
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // ── Save settings to DB ────────────────────
  const save = async (patch: Record<string, any>) => {
    setSaving(true)
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      })
      if (res.ok) {
        setSaved(true)
        toast("Settings saved!", "success")
        setTimeout(() => setSaved(false), 2500)
      } else {
        toast("Failed to save settings", "error")
      }
    } catch {
      toast("Something went wrong", "error")
    } finally {
      setSaving(false)
    }
  }

  // ── Select city from dropdown ──────────────
  const selectCity = async (city: CityResult) => {
    setDefaultCity(city.name)
    setCityQuery(city.name)
    setShowCityDropdown(false)
    setCityResults([])
    await save({
      defaultCity: city.name,
      defaultLat: city.lat,
      defaultLon: city.lon,
    })
  }

  // ── Auto-detect location ───────────────────
  const detectLocation = async () => {
    try {
      const res = await fetch("/api/location")
      const data = await res.json()
      setDefaultCity(data.city ?? "")
      setCityQuery(data.city ?? "")
      await save({
        defaultCity: data.city,
        defaultLat: data.lat,
        defaultLon: data.lon,
      })
    } catch {}
  }

  // ── Change password ────────────────────────
  const changePassword = async () => {
    setPassError("")
    setSavingPass(true)
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: currentPass,
          newPassword: newPass,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setPassError(data.error ?? "Failed to update password")
        toast(data.error ?? "Failed to update password", "error")
      } else {
        toast("Password updated successfully!", "success")
        setEditingPass(false)
        setCurrentPass("")
        setNewPass("")
        setConfirmPass("")
      }
    } catch {
      setPassError("Something went wrong")
      toast("Something went wrong", "error")
    } finally {
      setSavingPass(false)
    }
  }

  // ── Delete account ─────────────────────────
  const deleteAccount = async () => {
    setDeleting(true)
    try {
      const res = await fetch("/api/auth/delete-account", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: deletePass }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast(data.error ?? "Failed to delete account", "error")
      } else {
        toast("Account deleted. Redirecting…", "info")
        setTimeout(() => (window.location.href = "/"), 1500)
      }
    } catch {
      toast("Something went wrong", "error")
    } finally {
      setDeleting(false)
    }
  }

  if (loading)
    return (
      <div className="flex gap-6">
        <Skeleton className="w-52 h-64 shrink-0" />
        <div className="flex-1 flex flex-col gap-3">
          <Skeleton className="h-8 w-48" />
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-14" />
          ))}
        </div>
      </div>
    )

  return (
    <div className="flex gap-6">
      {/* ── Left nav ──────────────────────────── */}
      <div className="w-52 shrink-0">
        <div
          className="rounded-2xl p-2 sticky top-4"
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm
                         font-medium transition-all duration-200 text-left"
              style={{
                background:
                  activeNav === item.id
                    ? "rgba(59,130,246,0.1)"
                    : "transparent",
                color: activeNav === item.id ? "#60a5fa" : "#64748b",
                border:
                  activeNav === item.id
                    ? "1px solid rgba(59,130,246,0.2)"
                    : "1px solid transparent",
              }}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Right content ─────────────────────── */}
      <div className="flex-1 min-w-0">
        <div
          className="rounded-2xl p-6"
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          {/* Save feedback */}
          {saved && (
            <div
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl mb-4 text-sm text-green-300"
              style={{
                background: "rgba(34,197,94,0.1)",
                border: "1px solid rgba(34,197,94,0.2)",
              }}
            >
              ✓ Settings saved successfully
            </div>
          )}

          {/* ── Default Location ──────────────── */}
          {activeNav === "location" && (
            <div>
              <h2
                className="text-base font-bold text-slate-100 mb-1"
                style={{ fontFamily: "var(--font-d)" }}
              >
                Default Location
              </h2>
              <p className="text-xs text-slate-500 mb-5">
                This location is used as the default when the dashboard loads.
              </p>

              <SettingRow
                label="Auto-detect location"
                description="Use your IP address to detect location automatically"
              >
                <button
                  onClick={detectLocation}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-blue-400
                             transition-all hover:bg-blue-500/20"
                  style={{
                    background: "rgba(59,130,246,0.1)",
                    border: "1px solid rgba(59,130,246,0.2)",
                  }}
                >
                  Detect now
                </button>
              </SettingRow>

              <SettingRow
                label="Default city"
                description="Search and select any city worldwide"
              >
                <div className="relative w-64" ref={cityRef}>
                  <input
                    type="text"
                    value={cityQuery}
                    onChange={(e) => {
                      setCityQuery(e.target.value)
                      setShowCityDropdown(true)
                    }}
                    onFocus={() => setShowCityDropdown(true)}
                    placeholder="Search any city…"
                    className="w-full px-3 py-2 rounded-xl text-sm text-slate-200 outline-none
                               placeholder-slate-600 transition-all"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                  />

                  {/* Current saved city badge */}
                  {defaultCity && (
                    <p className="text-[10px] text-blue-400 mt-1">
                      ✓ Current: {defaultCity}
                    </p>
                  )}

                  {/* Dropdown */}
                  {showCityDropdown &&
                    (citySearching ||
                      cityResults.length > 0 ||
                      cityQuery.length >= 2) && (
                      <div
                        className="absolute top-full mt-1 left-0 right-0 z-50 rounded-xl overflow-hidden"
                        style={{
                          background: "rgba(9,21,37,0.98)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          backdropFilter: "blur(24px)",
                          boxShadow: "0 16px 40px rgba(0,0,0,0.5)",
                        }}
                      >
                        {citySearching ? (
                          <div className="flex items-center gap-2 px-4 py-3">
                            <span
                              className="w-3 h-3 border border-blue-400/30 border-t-blue-400
                                           rounded-full animate-spin"
                            />
                            <p className="text-xs text-slate-500">Searching…</p>
                          </div>
                        ) : cityResults.length === 0 ? (
                          <p className="text-xs text-slate-600 text-center py-3">
                            No cities found
                          </p>
                        ) : (
                          cityResults.map((city) => (
                            <button
                              key={`${city.name}-${city.lat}`}
                              onClick={() => selectCity(city)}
                              className="w-full flex items-center justify-between px-4 py-2.5
                                       hover:bg-white/5 transition-colors text-left"
                            >
                              <span className="text-sm text-slate-300 font-medium">
                                {city.name}
                              </span>
                              <span className="text-xs text-slate-600">
                                {city.country}
                              </span>
                            </button>
                          ))
                        )}
                      </div>
                    )}
                </div>
              </SettingRow>
            </div>
          )}

          {/* ── Appearance ────────────────────── */}
          {activeNav === "appearance" && (
            <div>
              <h2
                className="text-base font-bold text-slate-100 mb-1"
                style={{ fontFamily: "var(--font-d)" }}
              >
                Appearance
              </h2>
              <p className="text-xs text-slate-500 mb-5">
                Customize how WeatherWise looks and displays data.
              </p>

              <SettingRow
                label="Temperature unit"
                description="Unit used for all temperature values"
              >
                <Select
                  value={tempUnit}
                  onChange={(v) => {
                    setTempUnit(v)
                    save({ tempUnit: v })
                  }}
                  options={TEMP_UNITS}
                />
              </SettingRow>
              <SettingRow
                label="Wind speed unit"
                description="Unit used for wind speed values"
              >
                <Select
                  value={windUnit}
                  onChange={(v) => {
                    setWindUnit(v)
                    save({ windUnit: v })
                  }}
                  options={WIND_UNITS}
                />
              </SettingRow>
              {/* Theme toggle — hidden for now, re-enable when light mode is ready
              <SettingRow label="Theme" description="App color theme">
                <Select value={theme} onChange={v => { setTheme(v as any); save({ theme: v }) }} options={THEMES} />
              </SettingRow>
              */}
              <SettingRow
                label="Language"
                description="Display language for the app"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">English</span>
                  <span
                    className="px-2 py-0.5 rounded-full text-[11px] font-semibold
                                   text-amber-400 bg-amber-500/10 border border-amber-500/20"
                  >
                    Coming soon
                  </span>
                </div>
              </SettingRow>
            </div>
          )}

          {/* ── Notifications ─────────────────── */}
          {activeNav === "notifications" && (
            <div>
              <h2
                className="text-base font-bold text-slate-100 mb-1"
                style={{ fontFamily: "var(--font-d)" }}
              >
                Notifications
              </h2>
              <p className="text-xs text-slate-500 mb-5">
                Control what alerts and updates you receive.
              </p>

              <SettingRow
                label="Enable notifications"
                description="Master toggle for all notifications"
              >
                <Toggle
                  value={notifications}
                  onChange={(v) => {
                    setNotifications(v)
                    save({ notifications: v })
                  }}
                />
              </SettingRow>

              {[
                {
                  label: "Severe weather alerts",
                  desc: "Storms, floods, extreme heat",
                },
                {
                  label: "Daily forecast summary",
                  desc: "Morning briefing every day",
                },
                { label: "Rain alerts", desc: "Notify when rain is expected" },
                {
                  label: "UV index warnings",
                  desc: "Alert when UV exceeds level 6",
                },
                {
                  label: "Air quality alerts",
                  desc: "Alert when AQI exceeds 100",
                },
              ].map((item) => (
                <SettingRow
                  key={item.label}
                  label={item.label}
                  description={item.desc}
                >
                  <Toggle
                    value={notifications}
                    onChange={(v) => {
                      setNotifications(v)
                      save({ notifications: v })
                    }}
                  />
                </SettingRow>
              ))}
            </div>
          )}

          {/* ── Account ───────────────────────── */}
          {activeNav === "account" && (
            <div>
              <h2
                className="text-base font-bold text-slate-100 mb-1"
                style={{ fontFamily: "var(--font-d)" }}
              >
                Account
              </h2>
              <p className="text-xs text-slate-500 mb-5">
                Manage your profile and account security.
              </p>

              <SettingRow label="Full name" description="Your display name">
                <div className="flex items-center gap-2">
                  {editingName ? (
                    <>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        autoFocus
                        className="px-3 py-2 rounded-xl text-sm text-slate-200 outline-none w-36"
                        style={{
                          background: "rgba(255,255,255,0.06)",
                          border: "1px solid rgba(59,130,246,0.4)",
                        }}
                      />
                      <button
                        onClick={async () => {
                          await save({ name })
                          setEditingName(false)
                        }}
                        disabled={saving}
                        className="px-3 py-2 rounded-xl text-xs font-semibold text-blue-400
                                   disabled:opacity-50 transition-all hover:bg-blue-500/20"
                        style={{
                          background: "rgba(59,130,246,0.1)",
                          border: "1px solid rgba(59,130,246,0.2)",
                        }}
                      >
                        {saving ? "…" : "Save"}
                      </button>
                      <button
                        onClick={() => setEditingName(false)}
                        className="text-xs text-slate-500 hover:text-slate-300 transition-colors px-2"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="text-sm text-slate-300">
                        {name || "—"}
                      </span>
                      <button
                        onClick={() => setEditingName(true)}
                        className="text-xs text-blue-400 hover:text-blue-300 transition-colors px-2"
                      >
                        Edit
                      </button>
                    </>
                  )}
                </div>
              </SettingRow>

              <SettingRow
                label="Email address"
                description="Used for login and notifications"
              >
                <span className="text-sm text-slate-400">
                  {userData?.email}
                </span>
              </SettingRow>

              <SettingRow
                label="Password"
                description="Update your account password"
              >
                <button
                  onClick={() => setEditingPass(!editingPass)}
                  className="px-3 py-2 rounded-xl text-xs font-semibold transition-all
                             text-slate-400 hover:text-slate-200"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  {editingPass ? "Cancel" : "Change password"}
                </button>
              </SettingRow>

              {editingPass && (
                <div
                  className="flex flex-col gap-3 p-4 rounded-xl mb-2"
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  {[
                    {
                      label: "Current password",
                      value: currentPass,
                      setter: setCurrentPass,
                    },
                    {
                      label: "New password",
                      value: newPass,
                      setter: setNewPass,
                      hint:
                        newPass.length > 0 && newPass.length < 8
                          ? "Min. 8 characters"
                          : "",
                    },
                    {
                      label: "Confirm password",
                      value: confirmPass,
                      setter: setConfirmPass,
                    },
                  ].map((f) => (
                    <div key={f.label}>
                      <label className="text-xs text-slate-500 block mb-1">
                        {f.label}
                      </label>
                      <input
                        type="password"
                        value={f.value}
                        onChange={(e) => {
                          f.setter(e.target.value)
                          setPassError("")
                        }}
                        className="w-full px-3 py-2 rounded-xl text-sm text-slate-200 outline-none"
                        style={{
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.1)",
                        }}
                      />
                      {"hint" in f && f.hint && (
                        <p className="text-[11px] text-amber-400 mt-1">
                          {f.hint}
                        </p>
                      )}
                    </div>
                  ))}

                  {/* Mismatch warning */}
                  {newPass && confirmPass && newPass !== confirmPass && (
                    <p className="text-xs text-red-400">
                      Passwords do not match
                    </p>
                  )}

                  {/* Server error */}
                  {passError && (
                    <p className="text-xs text-red-400">{passError}</p>
                  )}

                  <button
                    onClick={changePassword}
                    disabled={
                      savingPass ||
                      !currentPass ||
                      newPass.length < 8 ||
                      newPass !== confirmPass
                    }
                    className="w-full py-2 rounded-xl text-sm font-semibold text-white mt-1
                               transition-all disabled:opacity-40"
                    style={{
                      background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                    }}
                  >
                    {savingPass ? "Updating…" : "Update password"}
                  </button>
                </div>
              )}

              {/* Danger zone */}
              <div
                className="mt-6 pt-4"
                style={{ borderTop: "1px solid rgba(239,68,68,0.15)" }}
              >
                <p className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-3">
                  Danger zone
                </p>

                {!showDelete ? (
                  <button
                    onClick={() => setShowDelete(true)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-red-400
                               transition-all hover:bg-red-500/20"
                    style={{
                      background: "rgba(239,68,68,0.08)",
                      border: "1px solid rgba(239,68,68,0.2)",
                    }}
                  >
                    Delete account
                  </button>
                ) : (
                  <div
                    className="flex flex-col gap-3 p-4 rounded-xl"
                    style={{
                      background: "rgba(239,68,68,0.05)",
                      border: "1px solid rgba(239,68,68,0.2)",
                    }}
                  >
                    <p className="text-xs text-red-300 font-medium">
                      ⚠️ This will permanently delete your account, all
                      favorites, and settings. This cannot be undone.
                    </p>
                    <div>
                      <label className="text-xs text-slate-500 block mb-1">
                        Enter your password to confirm
                      </label>
                      <input
                        type="password"
                        value={deletePass}
                        onChange={(e) => setDeletePass(e.target.value)}
                        placeholder="Your password"
                        className="w-full px-3 py-2 rounded-xl text-sm text-slate-200 outline-none"
                        style={{
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(239,68,68,0.3)",
                        }}
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={deleteAccount}
                        disabled={!deletePass || deleting}
                        className="flex-1 py-2 rounded-xl text-xs font-bold text-white
                                   transition-all disabled:opacity-40"
                        style={{ background: "#ef4444" }}
                      >
                        {deleting ? "Deleting…" : "Yes, delete my account"}
                      </button>
                      <button
                        onClick={() => {
                          setShowDelete(false)
                          setDeletePass("")
                        }}
                        className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400
                                   hover:text-slate-200 transition-all"
                        style={{ background: "rgba(255,255,255,0.05)" }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
