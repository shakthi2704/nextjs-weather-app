// src/components/ui/CitySearchBar.tsx
"use client"

import { useState, useEffect, useRef } from "react"

export interface CityResult {
  name: string
  country: string
  admin1?: string
  latitude: number
  longitude: number
  timezone: string
}

interface Props {
  currentCity?: string
  onSelect: (city: CityResult) => void
  loading?: boolean
}

export default function CitySearchBar({
  currentCity,
  onSelect,
  loading,
}: Props) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<CityResult[]>([])
  const [searching, setSearching] = useState(false)
  const [showDrop, setShowDrop] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Debounced search
  useEffect(() => {
    if (query.length < 2) {
      setResults([])
      return
    }
    const t = setTimeout(async () => {
      setSearching(true)
      try {
        const res = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=6&language=en&format=json`,
        )
        const data = await res.json()
        setResults(data.results ?? [])
        setShowDrop(true)
      } catch {
        setResults([])
      } finally {
        setSearching(false)
      }
    }, 300)
    return () => clearTimeout(t)
  }, [query])

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setShowDrop(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const handleSelect = (r: CityResult) => {
    setQuery("")
    setResults([])
    setShowDrop(false)
    onSelect(r)
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-sm">
      <div
        className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl transition-all"
        style={{
          background: "rgba(255,255,255,0.04)",
          border:
            showDrop && results.length > 0
              ? "1px solid rgba(59,130,246,0.4)"
              : "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <span className="text-slate-500 text-sm shrink-0">
          {searching || loading ? (
            <span
              className="inline-block w-3.5 h-3.5 border border-slate-600 border-t-blue-400
                             rounded-full animate-spin"
            />
          ) : (
            "🔍"
          )}
        </span>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setShowDrop(true)
          }}
          onFocus={() => results.length > 0 && setShowDrop(true)}
          placeholder={
            currentCity ? `Searching from ${currentCity}…` : "Search any city…"
          }
          className="flex-1 bg-transparent text-sm text-slate-200 placeholder-slate-600 outline-none"
        />
        {/* Current city badge */}
        {currentCity && !query && (
          <span
            className="shrink-0 flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[11px]
                           font-medium text-blue-400"
            style={{
              background: "rgba(59,130,246,0.1)",
              border: "1px solid rgba(59,130,246,0.2)",
            }}
          >
            📍 {currentCity}
          </span>
        )}
        {query && (
          <button
            onClick={() => {
              setQuery("")
              setResults([])
              setShowDrop(false)
            }}
            className="text-slate-600 hover:text-slate-400 transition-colors text-xs shrink-0"
          >
            ✕
          </button>
        )}
      </div>

      {/* Dropdown */}
      {showDrop && results.length > 0 && (
        <div
          className="absolute top-full mt-1.5 left-0 right-0 rounded-xl overflow-hidden"
          style={{
            background: "rgba(9,21,37,0.98)",
            border: "1px solid rgba(255,255,255,0.1)",
            backdropFilter: "blur(24px)",
            boxShadow: "0 16px 48px rgba(0,0,0,0.6)",
            zIndex: 100,
          }}
        >
          {results.map((r) => (
            <button
              key={`${r.name}-${r.latitude}`}
              onClick={() => handleSelect(r)}
              className="w-full flex items-center justify-between px-4 py-2.5
                         hover:bg-white/[0.05] transition-colors text-left"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
            >
              <div>
                <p className="text-sm text-slate-200 font-medium">{r.name}</p>
                {r.admin1 && (
                  <p className="text-[11px] text-slate-600">{r.admin1}</p>
                )}
              </div>
              <span className="text-xs text-slate-600 shrink-0 ml-3">
                {r.country}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
