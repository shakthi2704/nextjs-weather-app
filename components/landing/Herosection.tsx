"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"

// ── Types ──────────────────────────────────────
interface Star {
  x: number
  y: number
  r: number
  a: number
  speed: number
  phase: number
}

// ── Canvas background ──────────────────────────
const StarCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let stars: Star[] = []
    let raf: number

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initStars()
    }

    const initStars = () => {
      stars = Array.from({ length: 120 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.2 + 0.2,
        a: Math.random(),
        speed: Math.random() * 0.003 + 0.001,
        phase: Math.random() * Math.PI * 2,
      }))
    }

    const draw = (t: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Sky gradient
      const g = ctx.createLinearGradient(
        0,
        0,
        canvas.width * 0.5,
        canvas.height,
      )
      g.addColorStop(0, "#04080f")
      g.addColorStop(0.5, "#060d1f")
      g.addColorStop(1, "#04080f")
      ctx.fillStyle = g
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Top-center blue glow
      const glow1 = ctx.createRadialGradient(
        canvas.width / 2,
        0,
        0,
        canvas.width / 2,
        0,
        600,
      )
      glow1.addColorStop(0, "rgba(30,58,138,0.35)")
      glow1.addColorStop(1, "transparent")
      ctx.fillStyle = glow1
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Bottom-left glow
      const glow2 = ctx.createRadialGradient(
        0,
        canvas.height,
        0,
        0,
        canvas.height,
        400,
      )
      glow2.addColorStop(0, "rgba(14,74,110,0.2)")
      glow2.addColorStop(1, "transparent")
      ctx.fillStyle = glow2
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Stars
      stars.forEach((s) => {
        const alpha =
          ((Math.sin(t * s.speed + s.phase) + 1) / 2) * s.a * 0.7 + 0.05
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(148,163,184,${alpha})`
        ctx.fill()
      })

      raf = requestAnimationFrame(draw)
    }

    window.addEventListener("resize", resize)
    resize()
    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", resize)
    }
  }, [])

  return (
    <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />
  )
}

// ── HeroSection ────────────────────────────────
const HeroSection = () => {
  return (
    <>
      <StarCanvas />

      <div
        className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      <section
        className="hero-glow-top relative z-10 min-h-screen flex flex-col
                   items-center justify-center text-center
                   px-6 pt-24 pb-16 overflow-hidden"
      >
        <div
          className="animate-float-1 absolute w-[500px] h-[500px] -top-36 -right-24
                        rounded-full blur-[60px] opacity-15 pointer-events-none bg-blue-800"
        />
        <div
          className="animate-float-2 absolute w-[300px] h-[300px] bottom-12 -left-20
                        rounded-full blur-[60px] opacity-15 pointer-events-none bg-sky-500"
        />
        <div
          className="animate-float-3 absolute w-[200px] h-[200px] top-[40%] right-[10%]
                        rounded-full blur-[60px] opacity-15 pointer-events-none bg-blue-500"
        />

        <div className="relative z-10 flex flex-col items-center w-full max-w-4xl mx-auto">
          <div
            className="animate-fade-up inline-flex items-center gap-2 mb-7
                          px-4 py-1.5 rounded-full
                          bg-blue-500/10 border border-blue-500/30"
          >
            <span
              className="animate-pulse-dot w-1.5 h-1.5 rounded-full bg-blue-500"
              style={{ boxShadow: "0 0 0 0 rgba(59,130,246,0.6)" }}
            />
            <span className="text-sm font-medium text-blue-400">
              Real-time weather · Powered by Open-Meteo
            </span>
          </div>

          <h1
            className="animate-fade-up-2 font-extrabold text-slate-100 mb-5
                       leading-[1.05] tracking-tight"
            style={{
              fontSize: "clamp(40px, 7vw, 80px)",
              fontFamily: "var(--font-d)",
              letterSpacing: "-3px",
            }}
          >
            Weather intelligence
            <br />
            <span
              style={{
                background:
                  "linear-gradient(135deg, #60a5fa 0%, #3b82f6 40%, #93c5fd 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              built for precision
            </span>
          </h1>

          {/* Subtitle */}
          <p
            className="animate-fade-up-3 text-slate-400 font-normal mb-10 leading-relaxed"
            style={{ fontSize: "clamp(15px, 2vw, 18px)", maxWidth: 520 }}
          >
            A professional-grade weather dashboard with forecasts, air quality,
            radar maps, and smart alerts — all in one beautifully designed app.
          </p>

          {/* CTA buttons */}
          <div className="animate-fade-up-3 flex items-center gap-3 flex-wrap justify-center">
            <Link
              href="/register"
              className="flex items-center gap-2 px-7 py-3.5 rounded-md
                         text-base font-semibold text-white bg-blue-500
                         hover:bg-blue-600 hover:-translate-y-0.5
                         transition-all duration-200"
              style={{ boxShadow: "0 0 30px rgba(59,130,246,0.35)" }}
            >
              ⚡ Start for free
            </Link>
            <Link
              href="#features"
              className="flex items-center gap-2 px-7 py-3.5 rounded-md
                         text-base font-medium text-slate-100
                         bg-white/5 border border-white/10
                         hover:bg-white/10 hover:-translate-y-0.5
                         transition-all duration-200"
            >
              See features →
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

export default HeroSection
