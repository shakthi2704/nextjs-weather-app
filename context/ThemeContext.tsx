"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react"

type Theme = "dark" | "light" | "system"

interface ThemeContextValue {
  theme: Theme
  setTheme: (t: Theme) => void
  resolved: "dark" | "light" // actual applied theme
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "dark",
  setTheme: () => {},
  resolved: "dark",
})

export const useTheme = () => useContext(ThemeContext)

function applyTheme(resolved: "dark" | "light") {
  const root = document.documentElement
  if (resolved === "light") {
    root.classList.add("light")
    root.classList.remove("dark")
  } else {
    root.classList.add("dark")
    root.classList.remove("light")
  }
}

function getResolved(theme: Theme): "dark" | "light" {
  if (theme === "system") {
    return window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark"
  }
  return theme
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark")
  const [resolved, setResolved] = useState<"dark" | "light">("dark")

  // ── Load theme from settings API (if logged in) or localStorage ──
  useEffect(() => {
    async function load() {
      let savedTheme: Theme = "dark"

      // Try settings API first (authenticated users)
      try {
        const res = await fetch("/api/settings")
        if (res.ok) {
          const data = await res.json()
          if (data.settings?.theme) {
            savedTheme = data.settings.theme as Theme
          }
        }
      } catch {}

      // Fallback to localStorage
      if (savedTheme === "dark") {
        const ls = localStorage.getItem("ww-theme") as Theme | null
        if (ls) savedTheme = ls
      }

      setThemeState(savedTheme)
      const r = getResolved(savedTheme)
      setResolved(r)
      applyTheme(r)
    }
    load()
  }, [])

  // ── Listen for system theme changes ─────────
  useEffect(() => {
    if (theme !== "system") return
    const mq = window.matchMedia("(prefers-color-scheme: light)")
    const handler = (e: MediaQueryListEvent) => {
      const r = e.matches ? "light" : "dark"
      setResolved(r)
      applyTheme(r)
    }
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [theme])

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t)
    localStorage.setItem("ww-theme", t)
    const r = getResolved(t)
    setResolved(r)
    applyTheme(r)
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolved }}>
      {children}
    </ThemeContext.Provider>
  )
}
