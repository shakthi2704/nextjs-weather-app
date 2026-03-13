// src/context/SettingsContext.tsx
"use client"

import { createContext, useContext, useEffect, useState } from "react"

interface UserSettings {
  tempUnit: "celsius" | "fahrenheit"
  windUnit: "kmh" | "mph" | "ms" | "knots"
  theme: string
  language: string
}

interface SettingsContextValue {
  settings: UserSettings
  // Conversion helpers
  fmtTemp: (celsius: number, showUnit?: boolean) => string
  fmtWind: (kmh: number, showUnit?: boolean) => string
  fmtWindFull: (kmh: number) => string
}

const DEFAULTS: UserSettings = {
  tempUnit: "celsius",
  windUnit: "kmh",
  theme: "dark",
  language: "en",
}

const SettingsContext = createContext<SettingsContextValue>({
  settings: DEFAULTS,
  fmtTemp: (c) => `${c}°C`,
  fmtWind: (k) => `${k} km/h`,
  fmtWindFull: (k) => `${k} km/h`,
})

export const useSettings = () => useContext(SettingsContext)

// ── Conversion functions ────────────────────
export function convertTemp(
  celsius: number,
  unit: UserSettings["tempUnit"],
): number {
  if (unit === "fahrenheit") return Math.round((celsius * 9) / 5 + 32)
  return Math.round(celsius)
}

export function convertWind(
  kmh: number,
  unit: UserSettings["windUnit"],
): number {
  switch (unit) {
    case "mph":
      return Math.round(kmh * 0.621371)
    case "ms":
      return Math.round(kmh / 3.6)
    case "knots":
      return Math.round(kmh * 0.539957)
    default:
      return Math.round(kmh)
  }
}

const TEMP_SYMBOL: Record<UserSettings["tempUnit"], string> = {
  celsius: "°C",
  fahrenheit: "°F",
}

const WIND_SYMBOL: Record<UserSettings["windUnit"], string> = {
  kmh: "km/h",
  mph: "mph",
  ms: "m/s",
  knots: "kn",
}

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<UserSettings>(DEFAULTS)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/settings")
        if (!res.ok) return
        const data = await res.json()
        if (data.settings) {
          setSettings({
            tempUnit: data.settings.tempUnit ?? "celsius",
            windUnit: data.settings.windUnit ?? "kmh",
            theme: data.settings.theme ?? "dark",
            language: data.settings.language ?? "en",
          })
        }
      } catch {}
    }
    load()
  }, [])

  const fmtTemp = (celsius: number, showUnit = true) => {
    const val = convertTemp(celsius, settings.tempUnit)
    return showUnit ? `${val}${TEMP_SYMBOL[settings.tempUnit]}` : `${val}°`
  }

  const fmtWind = (kmh: number, showUnit = true) => {
    const val = convertWind(kmh, settings.windUnit)
    return showUnit ? `${val} ${WIND_SYMBOL[settings.windUnit]}` : `${val}`
  }

  const fmtWindFull = (kmh: number) => fmtWind(kmh)

  return (
    <SettingsContext.Provider
      value={{ settings, fmtTemp, fmtWind, fmtWindFull }}
    >
      {children}
    </SettingsContext.Provider>
  )
}
