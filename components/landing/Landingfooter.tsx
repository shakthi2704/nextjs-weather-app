import Link from "next/link"

const LINKS = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "API Docs", href: "/docs" },
  { label: "GitHub", href: "https://github.com" },
]

const LandingFooter = () => {
  return (
    <footer
      className="relative z-10 flex items-center justify-between flex-wrap
                 gap-4 px-6 md:px-12 py-8"
      style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
    >
      {/* Left — logo + copyright */}
      <div className="flex items-center gap-3 flex-wrap">
        <Link href="/" className="flex items-center gap-2 no-underline">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-sm shrink-0"
            style={{
              background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
              boxShadow: "0 0 12px rgba(59,130,246,0.3)",
            }}
          >
            🌤
          </div>
          <span
            className="font-extrabold text-slate-100 text-base"
            style={{ fontFamily: "var(--font-d)", letterSpacing: "-0.5px" }}
          >
            WeatherWise
          </span>
        </Link>
        <span className="text-slate-500 text-sm">
          © {new Date().getFullYear()} WeatherWise. All rights reserved.
        </span>
      </div>

      {/* Right — links */}
      <div className="flex items-center gap-5">
        {LINKS.map((l) => (
          <Link
            key={l.label}
            href={l.href}
            className="text-sm text-slate-500 hover:text-slate-300 transition-colors duration-200"
          >
            {l.label}
          </Link>
        ))}
      </div>
    </footer>
  )
}

export default LandingFooter
