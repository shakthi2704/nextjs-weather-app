"use client"

import { useState } from "react"
import Link from "next/link"
import SimpleNavbar from "@/components/shared/SimpleNavbar"

export default function ContactPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      // POST /api/contact will go here
      await new Promise((r) => setTimeout(r, 1000))
      setSent(true)
    } catch {
      setError("Something went wrong. Please try again or email us directly.")
    } finally {
      setLoading(false)
    }
  }

  const focusStyle = {
    border: "1px solid rgba(59,130,246,0.5)",
    background: "rgba(59,130,246,0.05)",
    boxShadow: "0 0 0 3px rgba(59,130,246,0.1)",
  }
  const blurStyle = {
    border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.05)",
    boxShadow: "none",
  }
  const baseStyle = {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
  }
  const inputClass =
    "w-full px-4 py-3 rounded-xl text-sm text-slate-100 placeholder:text-slate-600 outline-none transition-all duration-200"

  return (
    <div className="min-h-screen" style={{ background: "#060d1f" }}>
      <SimpleNavbar />

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-2.5 mb-4">
            <span className="w-6 h-0.5 rounded-full bg-blue-500" />
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-[2px]">
              Get in touch
            </span>
          </div>
          <h1
            className="font-extrabold text-slate-100 mb-4 leading-tight"
            style={{
              fontFamily: "var(--font-d)",
              fontSize: "clamp(28px, 4vw, 42px)",
              letterSpacing: -1.5,
            }}
          >
            Contact us
          </h1>
          <p className="text-slate-400 text-base leading-relaxed max-w-xl">
            Have a question, found a bug, or just want to say hi? We read every
            message and usually reply within 24 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── Left — Contact info ────────────── */}
          <div className="flex flex-col gap-4">
            {[
              { icon: "✉️", label: "General", value: "hello@weatherwise.app" },
              {
                icon: "🛡️",
                label: "Privacy",
                value: "privacy@weatherwise.app",
              },
              { icon: "⚖️", label: "Legal", value: "legal@weatherwise.app" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-start gap-4 p-5 rounded-2xl"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <span className="text-xl shrink-0">{item.icon}</span>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                    {item.label}
                  </p>
                  <p className="text-sm font-medium text-slate-200">
                    {item.value}
                  </p>
                </div>
              </div>
            ))}

            {/* Response time note */}
            <div
              className="p-5 rounded-2xl mt-2"
              style={{
                background: "rgba(59,130,246,0.06)",
                border: "1px solid rgba(59,130,246,0.2)",
              }}
            >
              <p className="text-xs text-blue-400 font-semibold uppercase tracking-wider mb-1">
                Response time
              </p>
              <p className="text-sm text-slate-300 leading-relaxed">
                We typically reply within{" "}
                <strong className="text-slate-100">24 hours</strong> on
                weekdays.
              </p>
            </div>
          </div>

          <div
            className="lg:col-span-2 rounded-3xl p-8"
            style={{
              background: "rgba(9,21,37,0.6)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            {sent ? (
              /* Success state */
              <div className="h-full flex flex-col items-center justify-center text-center py-12 gap-4">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-2"
                  style={{
                    background: "rgba(34,197,94,0.1)",
                    border: "1px solid rgba(34,197,94,0.2)",
                  }}
                >
                  ✅
                </div>
                <h2
                  className="font-bold text-slate-100 text-xl"
                  style={{ fontFamily: "var(--font-d)" }}
                >
                  Message sent!
                </h2>
                <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
                  Thanks for reaching out. We will get back to you at{" "}
                  <strong className="text-slate-200">{email}</strong> within 24
                  hours.
                </p>
                <button
                  onClick={() => {
                    setSent(false)
                    setName("")
                    setEmail("")
                    setSubject("")
                    setMessage("")
                  }}
                  className="mt-4 px-6 py-2.5 rounded-xl text-sm font-medium text-slate-100
                             transition-all duration-200 hover:-translate-y-px"
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.12)",
                  }}
                >
                  Send another message
                </button>
              </div>
            ) : (
              /* Form */
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {error && (
                  <div className="px-4 py-3 rounded-xl text-sm text-red-400 bg-red-500/10 border border-red-500/20">
                    {error}
                  </div>
                )}

                {/* Name + Email row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Smith"
                      required
                      className={inputClass}
                      style={baseStyle}
                      onFocus={(e) => Object.assign(e.target.style, focusStyle)}
                      onBlur={(e) => Object.assign(e.target.style, blurStyle)}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      className={inputClass}
                      style={baseStyle}
                      onFocus={(e) => Object.assign(e.target.style, focusStyle)}
                      onBlur={(e) => Object.assign(e.target.style, blurStyle)}
                    />
                  </div>
                </div>

                {/* Subject */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Subject
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                    className={inputClass}
                    style={{
                      ...baseStyle,
                      color: subject ? "" : "rgb(75,85,99)",
                    }}
                  >
                    <option value="" disabled>
                      Select a topic...
                    </option>
                    <option value="bug">Bug report</option>
                    <option value="feature">Feature request</option>
                    <option value="billing">Billing question</option>
                    <option value="privacy">Privacy concern</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Message */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Message
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us more..."
                    required
                    rows={5}
                    className={`${inputClass} resize-none`}
                    style={baseStyle}
                    onFocus={(e) => Object.assign(e.target.style, focusStyle)}
                    onBlur={(e) => Object.assign(e.target.style, blurStyle)}
                  />
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
                  {loading ? "Sending..." : "Send message"}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Footer note */}
        <div className="mt-12 pt-8 border-t border-white/[0.07] flex flex-wrap gap-4 justify-between items-center">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} WeatherWise. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link
              href="/privacy"
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
