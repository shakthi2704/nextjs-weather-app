import Link from "next/link"

const FEATURES = [
  "7-day forecast",
  "Air quality index",
  "Radar map",
  "Weather alerts",
  "Favorite cities",
  "Dark mode",
]

const CTASection = () => {
  return (
    <section className="relative z-10 flex justify-center px-6 md:px-12 pb-28">
      <div
        className="w-full max-w-3xl rounded-3xl p-10 md:p-16 text-center relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, rgba(29,78,216,0.2) 0%, rgba(59,130,246,0.1) 100%)",
          border: "1px solid rgba(59,130,246,0.25)",
          boxShadow: "0 0 80px rgba(59,130,246,0.08)",
        }}
      >
        {/* Top glow */}
        <div
          className="absolute -top-24 left-1/2 -translate-x-1/2
                     w-[500px] h-[300px] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse, rgba(59,130,246,0.15) 0%, transparent 70%)",
          }}
        />

        {/* Content */}
        <div className="relative z-10">
          <h2
            className="font-extrabold text-slate-100 mb-4 leading-tight"
            style={{
              fontFamily: "var(--font-d)",
              fontSize: "clamp(26px, 4vw, 42px)",
              letterSpacing: -1.5,
            }}
          >
            Start tracking your weather
            <br />
            like a professional
          </h2>

          <p className="text-base text-slate-400 mb-9 leading-relaxed max-w-lg mx-auto">
            Create a free account. Save your favourite cities, get personalised
            alerts, and access the full dashboard.
          </p>

          {/* Buttons */}
          <div className="flex justify-center gap-3 flex-wrap mb-4">
            <Link
              href="/register"
              className="flex items-center gap-2 px-7 py-3.5 rounded-2xl
                         text-base font-semibold text-white bg-blue-500
                         hover:bg-blue-600 hover:-translate-y-0.5
                         transition-all duration-200"
              style={{ boxShadow: "0 0 30px rgba(59,130,246,0.35)" }}
            >
              ⚡ Create free account
            </Link>
            <Link
              href="/login"
              className="flex items-center gap-2 px-7 py-3.5 rounded-2xl
                         text-base font-medium text-slate-100
                         bg-white/5 border border-white/10
                         hover:bg-white/10 hover:-translate-y-0.5
                         transition-all duration-200"
            >
              Already have an account →
            </Link>
          </div>

          <p className="text-xs text-slate-500 mb-8">
            No credit card required · Free forever for personal use
          </p>

          {/* Feature list */}
          <div
            className="flex justify-center flex-wrap gap-x-6 gap-y-2 pt-6"
            style={{ borderTop: "1px solid rgba(59,130,246,0.15)" }}
          >
            {FEATURES.map((f) => (
              <div
                key={f}
                className="flex items-center gap-1.5 text-sm text-slate-400"
              >
                <span className="text-green-400 font-bold text-base">✓</span>
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default CTASection
