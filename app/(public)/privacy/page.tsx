import SimpleNavbar from "@/components/shared/SimpleNavbar"
import Link from "next/link"

const SECTIONS = [
  {
    title: "Information We Collect",
    content: `We collect information you provide directly to us when you create an account, such as your name and email address. We also collect information automatically when you use WeatherWise, including your approximate location (used only to fetch local weather data), device type, and usage patterns. We do not sell your personal information to any third party.`,
  },
  {
    title: "How We Use Your Information",
    content: `We use the information we collect to provide, maintain, and improve WeatherWise. This includes delivering weather data relevant to your location, sending weather alerts you have opted into, and personalising your dashboard experience. We may also use your email to send important service updates and security notices.`,
  },
  {
    title: "Location Data",
    content: `WeatherWise uses your location solely to fetch accurate local weather data. If you grant browser location permission, your precise coordinates are sent directly to our weather API providers (Open-Meteo, OpenWeatherMap) and are never stored on our servers. If you deny location access, we fall back to IP-based approximate location which is discarded after each request.`,
  },
  {
    title: "Cookies and Storage",
    content: `We use cookies and local storage to keep you signed in and to remember your preferences such as temperature units and saved cities. We do not use tracking cookies or third-party advertising cookies. You can clear cookies at any time through your browser settings, though this will sign you out.`,
  },
  {
    title: "Data Sharing",
    content: `We do not sell, trade, or rent your personal information. We share data only with the third-party services required to operate WeatherWise — specifically our weather API providers. These providers receive only the minimum data necessary (latitude/longitude or city name) to return weather results.`,
  },
  {
    title: "Data Security",
    content: `We implement industry-standard security measures to protect your personal information. Passwords are hashed using bcrypt before storage and are never stored in plain text. We use HTTPS for all data transmission. Despite these measures, no method of transmission over the internet is 100% secure.`,
  },
  {
    title: "Data Retention",
    content: `We retain your account information for as long as your account is active. You may delete your account at any time from Settings, which will permanently remove all your personal data, saved cities, and preferences from our systems within 30 days.`,
  },
  {
    title: "Children's Privacy",
    content: `WeatherWise is not directed at children under 13. We do not knowingly collect personal information from children under 13. If you believe we have inadvertently collected such information, please contact us immediately and we will delete it promptly.`,
  },
  {
    title: "Changes to This Policy",
    content: `We may update this Privacy Policy from time to time. We will notify you of any significant changes by email or by displaying a notice on the dashboard. Your continued use of WeatherWise after changes take effect constitutes your acceptance of the revised policy.`,
  },
  {
    title: "Contact Us",
    content: `If you have any questions about this Privacy Policy or how we handle your data, please contact us at privacy@weatherwise.app or through our Contact page.`,
  },
]

export default function PrivacyPage() {
  return (
    <div className="min-h-screen" style={{ background: "#060d1f" }}>
      {/* Navbar */}
      <SimpleNavbar />

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-2.5 mb-4">
            <span className="w-6 h-0.5 rounded-full bg-blue-500" />
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-[2px]">
              Legal
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
            Privacy Policy
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            Last updated: January 1, 2026 &nbsp;·&nbsp; Effective: January 1,
            2026
          </p>
          <p className="text-slate-400 text-base mt-4 leading-relaxed">
            At WeatherWise, your privacy matters to us. This policy explains
            what information we collect, how we use it, and the choices you
            have.
          </p>
        </div>

        {/* Sections */}
        <div className="flex flex-col gap-8">
          {SECTIONS.map((s, i) => (
            <div
              key={i}
              className="rounded-2xl p-6"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <h2
                className="font-bold text-slate-100 mb-3 text-lg"
                style={{ fontFamily: "var(--font-d)" }}
              >
                {i + 1}. {s.title}
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                {s.content}
              </p>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div className="mt-12 pt-8 border-t border-white/[0.07] flex flex-wrap gap-4 justify-between items-center">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} WeatherWise. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link
              href="/terms"
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="/contact"
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
