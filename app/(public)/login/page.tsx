"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"

// ── Same star canvas as HeroSection ───────────
const StarCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let raf: number
    const stars = Array.from({ length: 120 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.2 + 0.2,
      a: Math.random(),
      speed: Math.random() * 0.003 + 0.001,
      phase: Math.random() * Math.PI * 2,
    }))

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const draw = (t: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

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

      const glow = ctx.createRadialGradient(
        canvas.width / 2,
        0,
        0,
        canvas.width / 2,
        0,
        600,
      )
      glow.addColorStop(0, "rgba(30,58,138,0.3)")
      glow.addColorStop(1, "transparent")
      ctx.fillStyle = glow
      ctx.fillRect(0, 0, canvas.width, canvas.height)

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

// ── Login Page ─────────────────────────────────
export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPass, setShowPass] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      // const res = await signIn("credentials", { email, password, redirect: false })
      // if (res?.error) setError("Invalid email or password")
      // else router.push("/dashboard")
      await new Promise((r) => setTimeout(r, 1000))
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4">
      {/* Background */}
      <StarCanvas />
      <div
        className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Glow behind card */}
      <div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                   w-[600px] h-[400px] pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(ellipse, rgba(59,130,246,0.12) 0%, transparent 70%)",
        }}
      />

      {/* Card */}
      <div
        className="relative z-10 w-full max-w-md rounded-3xl p-8 md:p-10"
        style={{
          background: "rgba(9,21,37,0.8)",
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(32px)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.5)",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 mb-8 no-underline w-fit"
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-base shrink-0"
            style={{
              background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
              boxShadow: "0 0 16px rgba(59,130,246,0.4)",
            }}
          >
            🌤
          </div>
          <span
            className="text-slate-100 font-extrabold text-xl tracking-tight"
            style={{ fontFamily: "var(--font-d)" }}
          >
            WeatherWise
          </span>
        </Link>

        {/* Heading */}
        <h1
          className="font-extrabold text-slate-100 mb-1.5 leading-tight"
          style={{
            fontFamily: "var(--font-d)",
            fontSize: 28,
            letterSpacing: -1,
          }}
        >
          Welcome back
        </h1>
        <p className="text-sm text-slate-400 mb-7">
          Sign in to continue tracking weather.
        </p>

        {/* Error */}
        {error && (
          <div
            className="mb-5 px-4 py-3 rounded-xl text-sm text-red-400
                          bg-red-500/10 border border-red-500/20"
          >
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full px-4 py-3 rounded-xl text-sm text-slate-100
                         placeholder:text-slate-600 outline-none transition-all duration-200"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
              onFocus={(e) => {
                e.target.style.border = "1px solid rgba(59,130,246,0.5)"
                e.target.style.background = "rgba(59,130,246,0.05)"
                e.target.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.1)"
              }}
              onBlur={(e) => {
                e.target.style.border = "1px solid rgba(255,255,255,0.1)"
                e.target.style.background = "rgba(255,255,255,0.05)"
                e.target.style.boxShadow = "none"
              }}
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-xs text-blue-400 hover:text-blue-300 transition-colors duration-200"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 pr-11 rounded-xl text-sm text-slate-100
                           placeholder:text-slate-600 outline-none transition-all duration-200"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
                onFocus={(e) => {
                  e.target.style.border = "1px solid rgba(59,130,246,0.5)"
                  e.target.style.background = "rgba(59,130,246,0.05)"
                  e.target.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.1)"
                }}
                onBlur={(e) => {
                  e.target.style.border = "1px solid rgba(255,255,255,0.1)"
                  e.target.style.background = "rgba(255,255,255,0.05)"
                  e.target.style.boxShadow = "none"
                }}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2
                           text-slate-500 hover:text-slate-300 transition-colors duration-200"
              >
                {showPass ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl text-sm font-semibold text-white mt-1
                       transition-all duration-200 hover:-translate-y-px
                       disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: "#3b82f6",
              boxShadow: "0 0 24px rgba(59,130,246,0.35)",
            }}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-white/[0.07]" />
          <span className="text-xs text-slate-600">New to WeatherWise?</span>
          <div className="flex-1 h-px bg-white/[0.07]" />
        </div>

        {/* Register link */}
        <Link
          href="/register"
          className="block w-full py-3 rounded-xl text-sm font-medium text-slate-100
                     text-center transition-all duration-200 hover:-translate-y-px"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          Create a free account →
        </Link>
      </div>
    </div>
  )
}
