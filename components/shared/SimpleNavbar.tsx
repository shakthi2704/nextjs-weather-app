import Link from "next/link"

const SimpleNavbar = () => {
  return (
    <nav
      className="flex items-center justify-between px-6 md:px-12 h-16 border-b"
      style={{ borderColor: "rgba(255,255,255,0.07)" }}
    >
      <Link href="/" className="flex items-center gap-2 no-underline">
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
      <Link
        href="/"
        className="text-sm text-slate-400 hover:text-slate-100 transition-colors duration-200"
      >
        ← Back to home
      </Link>
    </nav>
  )
}

export default SimpleNavbar
