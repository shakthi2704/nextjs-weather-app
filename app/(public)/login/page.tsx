// src/app/(public)/login/page.tsx
"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn } from "next-auth/react"

// ── Star canvas (same as hero) ─────────────────
function StarCanvas() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current!
    const ctx = canvas.getContext("2d")!
    let raf: number
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    const stars = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.2 + 0.3,
      a: Math.random(),
      s: (Math.random() - 0.5) * 0.004,
    }))
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      stars.forEach((s) => {
        s.a = Math.max(0.05, Math.min(1, s.a + s.s))
        if (s.a <= 0.05 || s.a >= 1) s.s *= -1
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(148,163,184,${s.a})`
        ctx.fill()
      })
      raf = requestAnimationFrame(draw)
    }
    draw()
    const onResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    window.addEventListener("resize", onResize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", onResize)
    }
  }, [])
  return (
    <canvas
      ref={ref}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  )
}

// ── Error messages map ─────────────────────────
const AUTH_ERRORS: Record<string, string> = {
  CredentialsSignin: "Incorrect email or password.",
  Configuration: "Server configuration error. Please try again.",
  AccessDenied: "Access denied.",
  Default: "Something went wrong. Please try again.",
}

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Show error from URL (e.g. redirected from middleware with ?error=...)
  useEffect(() => {
    const urlError = searchParams.get("error")
    if (urlError) setError(AUTH_ERRORS[urlError] ?? AUTH_ERRORS.Default)
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setError("Please fill in all fields.")
      return
    }

    setLoading(true)
    setError("")

    try {
      const result = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      })

      if (result?.error) {
        setError(AUTH_ERRORS[result.error] ?? AUTH_ERRORS.Default)
      } else {
        // Successful login — redirect to dashboard (or callbackUrl)
        const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard"
        router.push(callbackUrl)
        router.refresh()
      }
    } catch {
      setError(AUTH_ERRORS.Default)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="relative min-h-screen flex items-center justify-center px-4"
      style={{ background: "#060d1f" }}
    >
      <StarCanvas />

      {/* Glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-150 h-75
                   rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse, rgba(59,130,246,0.1) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 w-full max-w-md">
        {/* Card */}
        <div
          className="rounded-3xl p-8"
          style={{
            background: "rgba(9,21,37,0.8)",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(32px)",
            boxShadow: "0 24px 64px rgba(0,0,0,0.4)",
          }}
        >
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
              style={{
                background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
              }}
            >
              🌤️
            </div>
            <span
              className="text-lg font-bold text-slate-100"
              style={{ fontFamily: "var(--font-d)" }}
            >
              WeatherWise
            </span>
          </div>

          <h1
            className="text-2xl font-bold text-slate-100 text-center mb-1"
            style={{ fontFamily: "var(--font-d)", letterSpacing: -0.5 }}
          >
            Welcome back
          </h1>
          <p className="text-sm text-slate-500 text-center mb-7">
            Sign in to your account
          </p>

          {/* Error banner */}
          {error && (
            <div
              className="flex items-center gap-2.5 px-4 py-3 rounded-xl mb-5 text-sm text-red-300"
              style={{
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.25)",
              }}
            >
              <span className="shrink-0">⚠️</span>
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Email */}
            <div>
              <label className="text-xs text-slate-400 font-medium block mb-1.5">
                Email address
              </label>
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3 rounded-xl text-sm text-slate-100
                           placeholder-slate-600 outline-none transition-all duration-200"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
                onFocus={(e) =>
                  (e.target.style.borderColor = "rgba(59,130,246,0.5)")
                }
                onBlur={(e) =>
                  (e.target.style.borderColor = "rgba(255,255,255,0.1)")
                }
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs text-slate-400 font-medium">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 pr-11 rounded-xl text-sm text-slate-100
                             placeholder-slate-600 outline-none transition-all duration-200"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                  onFocus={(e) =>
                    (e.target.style.borderColor = "rgba(59,130,246,0.5)")
                  }
                  onBlur={(e) =>
                    (e.target.style.borderColor = "rgba(255,255,255,0.1)")
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2
                             text-slate-500 hover:text-slate-300 transition-colors text-sm"
                >
                  {showPass ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-semibold text-white
                         transition-all duration-200 mt-1 disabled:opacity-60
                         disabled:cursor-not-allowed"
              style={{
                background: loading
                  ? "rgba(59,130,246,0.5)"
                  : "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                boxShadow: loading ? "none" : "0 4px 20px rgba(59,130,246,0.3)",
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span
                    className="w-4 h-4 border-2 border-white/30 border-t-white
                                   rounded-full animate-spin"
                  />
                  Signing in…
                </span>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-xs text-slate-500 mt-6">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
