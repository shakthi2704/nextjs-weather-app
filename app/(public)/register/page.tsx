// src/app/(public)/register/page.tsx
"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"

// ── Star canvas ────────────────────────────────
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

// ── Password strength ──────────────────────────
function getStrength(pw: string): {
  score: number
  label: string
  color: string
} {
  let score = 0
  if (pw.length >= 8) score++
  if (pw.length >= 12) score++
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  const map = [
    { label: "", color: "bg-white/10" },
    { label: "Weak", color: "bg-red-500" },
    { label: "Fair", color: "bg-orange-500" },
    { label: "Good", color: "bg-yellow-500" },
    { label: "Strong", color: "bg-green-500" },
  ]
  return { score, ...map[Math.min(score, 4)] }
}

export default function RegisterPage() {
  const router = useRouter()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const strength = getStrength(password)
  const passMatch = confirmPassword.length > 0 && password === confirmPassword
  const passMismatch =
    confirmPassword.length > 0 && password !== confirmPassword

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (passMismatch) {
      setError("Passwords do not match.")
      return
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.")
      return
    }

    setLoading(true)

    try {
      // 1. Create account via register API
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? "Registration failed. Please try again.")
        return
      }

      // 2. Auto sign in after successful registration
      const result = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      })

      if (result?.error) {
        // Account created but auto-login failed — redirect to login
        router.push("/login?registered=true")
      } else {
        router.push("/dashboard")
        router.refresh()
      }
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="relative min-h-screen flex items-center justify-center px-4 py-10"
      style={{ background: "#060d1f" }}
    >
      <StarCanvas />

      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-150 h-75
                   rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse, rgba(59,130,246,0.1) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 w-full max-w-md">
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
            Create an account
          </h1>
          <p className="text-sm text-slate-500 text-center mb-7">
            Start your free WeatherWise account
          </p>

          {/* Error */}
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
            {/* Name */}
            <div>
              <label className="text-xs text-slate-400 font-medium block mb-1.5">
                Full name
              </label>
              <input
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Smith"
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
              <label className="text-xs text-slate-400 font-medium block mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
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

              {/* Strength bars */}
              {password.length > 0 && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`flex-1 h-1 rounded-full transition-all duration-300
                                    ${strength.score >= i ? strength.color : "bg-white/10"}`}
                      />
                    ))}
                  </div>
                  <p
                    className={`text-[10px] ${
                      strength.score <= 1
                        ? "text-red-400"
                        : strength.score <= 2
                          ? "text-orange-400"
                          : strength.score <= 3
                            ? "text-yellow-400"
                            : "text-green-400"
                    }`}
                  >
                    {strength.label && `Password strength: ${strength.label}`}
                  </p>
                </div>
              )}
            </div>

            {/* Confirm password */}
            <div>
              <label className="text-xs text-slate-400 font-medium block mb-1.5">
                Confirm password
              </label>
              <input
                type={showPass ? "text" : "password"}
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                required
                className="w-full px-4 py-3 rounded-xl text-sm text-slate-100
                           placeholder-slate-600 outline-none transition-all duration-200"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: `1px solid ${
                    passMatch
                      ? "rgba(34,197,94,0.5)"
                      : passMismatch
                        ? "rgba(239,68,68,0.5)"
                        : "rgba(255,255,255,0.1)"
                  }`,
                }}
              />
              {passMatch && (
                <p className="text-[10px] text-green-400 mt-1">
                  ✓ Passwords match
                </p>
              )}
              {passMismatch && (
                <p className="text-[10px] text-red-400 mt-1">
                  ✗ Passwords do not match
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || passMismatch}
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
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account…
                </span>
              ) : (
                "Create account"
              )}
            </button>

            <p className="text-center text-[10px] text-slate-600 -mt-1">
              By creating an account you agree to our{" "}
              <Link
                href="/terms"
                className="text-slate-500 hover:text-slate-300 transition-colors"
              >
                Terms
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="text-slate-500 hover:text-slate-300 transition-colors"
              >
                Privacy Policy
              </Link>
            </p>
          </form>

          <p className="text-center text-xs text-slate-500 mt-6">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
