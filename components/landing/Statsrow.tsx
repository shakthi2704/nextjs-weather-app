"use client"

import { useEffect, useRef } from "react"

const STATS = [
  { num: "2M+", label: "Cities covered" },
  { num: "99.9%", label: "Uptime reliability" },
  { num: "10min", label: "Data refresh rate" },
  { num: "16+", label: "Weather data points" },
]

const StatsRow = () => {
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add("opacity-100", "translate-y-0")
              entry.target.classList.remove("opacity-0", "translate-y-5")
            }, i * 100)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 },
    )
    itemRefs.current.forEach((el) => {
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  return (
    <section className="relative z-10 px-12 pb-24">
      <div className="max-w-6xl mx-auto">
        {/* Divider */}
        <div className="flex items-center gap-4 mb-0">
          <div className="flex-1 h-px bg-white/5" />
          <span className="text-xs text-slate-500 font-medium uppercase tracking-widest whitespace-nowrap">
            Trusted worldwide
          </span>
          <div className="flex-1 h-px bg-white/5" />
        </div>

        {/* Stats */}
        <div className="flex justify-center text-white flex-wrap">
          {STATS.map((s, i) => (
            <div
              key={s.num}
              ref={(el) => {
                itemRefs.current[i] = el
              }}
              className="opacity-0 translate-y-5 transition-all duration-500
                       flex-1 min-w-[160px] max-w-[220px]
                       px-6 py-10 text-center
                       border-r border-white/5 last:border-r-0"
            >
              {/* gradient-text class handles all the gradient + clip CSS */}
              <p
                className="gradient-text font-extrabold mb-1.5 leading-none"
                style={{
                  fontFamily: "var(--font-d)",
                  fontSize: 42,
                  letterSpacing: -2,
                }}
              >
                {s.num}
              </p>
              <p className="text-sm text-slate-400">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default StatsRow
