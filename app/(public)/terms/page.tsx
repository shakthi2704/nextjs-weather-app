import SimpleNavbar from "@/components/shared/SimpleNavbar"
import Link from "next/link"

const SECTIONS = [
  {
    title: "Acceptance of Terms",
    content: `By accessing or using WeatherWise, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service. We reserve the right to update these terms at any time, and your continued use of WeatherWise constitutes acceptance of any changes.`,
  },
  {
    title: "Use of Service",
    content: `WeatherWise grants you a limited, non-exclusive, non-transferable licence to use the service for personal, non-commercial purposes. You agree not to misuse the service, attempt to access it by any means other than the interface we provide, or use it in ways that could damage, disable, or impair the service.`,
  },
  {
    title: "User Accounts",
    content: `You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorised use. WeatherWise is not liable for any loss or damage arising from your failure to protect your account information.`,
  },
  {
    title: "Weather Data Accuracy",
    content: `Weather forecasts are inherently uncertain. WeatherWise provides weather information on an "as is" basis using data from third-party providers. We make no warranties about the accuracy, completeness, or reliability of any weather data. Do not make critical safety decisions based solely on information from WeatherWise.`,
  },
  {
    title: "Intellectual Property",
    content: `All content, features, and functionality of WeatherWise — including but not limited to the design, code, text, graphics, and logos — are owned by WeatherWise and are protected by applicable intellectual property laws. You may not copy, modify, or distribute any part of the service without our prior written consent.`,
  },
  {
    title: "Prohibited Activities",
    content: `You agree not to: scrape or systematically collect data from WeatherWise without permission; attempt to reverse engineer any part of the service; use the service to distribute spam or malicious content; impersonate any person or entity; or violate any applicable laws or regulations.`,
  },
  {
    title: "Limitation of Liability",
    content: `To the maximum extent permitted by law, WeatherWise shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the service. Our total liability to you for any claim shall not exceed the amount you paid us in the past twelve months, or $10, whichever is greater.`,
  },
  {
    title: "Termination",
    content: `We reserve the right to suspend or terminate your account at any time for violations of these terms or for any other reason at our discretion. You may also terminate your account at any time from your account settings. Upon termination, your right to use the service ceases immediately.`,
  },
  {
    title: "Governing Law",
    content: `These Terms of Service shall be governed by and construed in accordance with applicable laws. Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the courts in the applicable jurisdiction.`,
  },
  {
    title: "Contact",
    content: `If you have any questions about these Terms of Service, please contact us at legal@weatherwise.app or through our Contact page.`,
  },
]

export default function TermsPage() {
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
            Terms of Service
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            Last updated: January 1, 2026 &nbsp;·&nbsp; Effective: January 1,
            2026
          </p>
          <p className="text-slate-400 text-base mt-4 leading-relaxed">
            Please read these Terms of Service carefully before using
            WeatherWise. These terms govern your use of our service and form a
            binding agreement between you and WeatherWise.
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
              href="/privacy"
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              Privacy Policy
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
