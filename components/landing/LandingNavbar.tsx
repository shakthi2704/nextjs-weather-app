"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

const LandingNavbar = () => {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <nav
      className={`
        fixed top-0 left-0 right-0 z-50
        flex items-center justify-between
        h-16 px-10
        border-b border-white/10
        backdrop-blur-xl
        transition-all duration-300
        ${
          scrolled
            ? "bg-[#060d1f]/65 shadow-[0_4px_32px_rgba(0,0,0,0.4)]"
            : "bg-[#060d1f]/70"
        }
      `}
    >
      <Link href="/" className="flex items-center gap-2 shrink-0 no-underline">
        <div
          className="w-8 h-8 rounded-md flex items-center justify-center text-base shrink-0"
          style={{
            background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
            boxShadow: "0 0 16px rgba(59,130,246,0.4)",
          }}
        >
          🌤
        </div>
        <span
          className="text-slate-100 font-extrabold text-xl tracking-tight whitespace-nowrap"
          style={{ fontFamily: "var(--font-d)" }}
        >
          WeatherWise
        </span>
      </Link>

      <div className="flex items-center gap-1">
        {["Features", "Pricing", "Docs"].map((item) => (
          <Link
            key={item}
            href={`#${item.toLowerCase()}`}
            className="px-4 py-2 rounded-md text-sm font-medium text-slate-400
                       whitespace-nowrap hover:text-slate-100 hover:bg-white/5
                       transition-all duration-200"
          >
            {item}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Link
          href="/login"
          className="px-4 py-2 rounded-md text-sm font-medium text-slate-100
                     whitespace-nowrap bg-white/10 border border-white/15
                     hover:bg-white/15 hover:border-white/25
                     transition-all duration-200"
        >
          Log in
        </Link>

        <Link
          href="/register"
          className="px-4 py-2 rounded-md text-sm font-semibold text-white
                     whitespace-nowrap bg-blue-500
                     hover:bg-blue-600 hover:-translate-y-px
                     transition-all duration-200"
          style={{ boxShadow: "0 0 20px rgba(59,130,246,0.4)" }}
        >
          Get started
        </Link>
      </div>
    </nav>
  )
}

export default LandingNavbar
