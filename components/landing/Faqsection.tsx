"use client"

import { useState } from "react"
import Link from "next/link"

const FAQS = [
  {
    q: "Is WeatherWise really free?",
    a: "Yes! The Free plan is completely free forever with no credit card required. You get 7-day forecasts, current weather, air quality index, and 3 saved cities. Upgrade to Pro for advanced features.",
  },
  {
    q: "Where does the weather data come from?",
    a: "We use Open-Meteo for forecasts and current conditions, WeatherAPI for city search, and OpenWeatherMap for severe weather alerts. All are industry-leading providers with high accuracy and reliability.",
  },
  {
    q: "How accurate is the forecast?",
    a: "Our forecasts use high-resolution numerical weather models updated every hour. Short-range forecasts (1-2 days) are highly accurate. Beyond 5 days, accuracy naturally decreases — we always show confidence indicators.",
  },
  {
    q: "Can I use WeatherWise on my phone?",
    a: "Absolutely. WeatherWise is fully responsive and works great on all devices. We also support PWA installation — you can add it to your home screen for a native app-like experience.",
  },
  {
    q: "How do weather alerts work?",
    a: "We pull alerts in real time from OpenWeatherMap's global alert network. When a severe weather event is detected near your saved cities, you will see an alert banner on your dashboard immediately.",
  },
  {
    q: "Can I compare weather between cities?",
    a: "Yes — Pro users can compare up to 4 cities side by side with charts, temperature differentials, and precipitation breakdowns. Great for travel planning or just satisfying your curiosity.",
  },
  {
    q: "How do I cancel my Pro subscription?",
    a: "You can cancel anytime from your account settings. Your Pro features remain active until the end of your billing period. We never charge cancellation fees.",
  },
]

// ── Single FAQ item ────────────────────────────
interface FAQItemProps {
  q: string
  a: string
  isOpen: boolean
  onToggle: () => void
}

const FAQItem = ({ q, a, isOpen, onToggle }: FAQItemProps) => (
  <div
    className={`rounded-2xl border transition-all duration-200 cursor-pointer
                ${
                  isOpen
                    ? "bg-blue-500/[0.06] border-blue-500/25"
                    : "bg-white/[0.03] border-white/[0.07] hover:border-white/15"
                }`}
    onClick={onToggle}
  >
    {/* Question row */}
    <div className="flex items-center justify-between gap-4 px-6 py-5">
      <p
        className={`text-sm font-semibold leading-relaxed
                     ${isOpen ? "text-slate-100" : "text-slate-200"}`}
      >
        {q}
      </p>
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0
                    text-sm font-bold transition-all duration-200
                    ${
                      isOpen
                        ? "bg-blue-500 text-white rotate-45"
                        : "bg-white/10 text-slate-400"
                    }`}
      >
        +
      </div>
    </div>

    {/* Answer */}
    {isOpen && (
      <div className="px-6 pb-5">
        <div className="h-px bg-blue-500/15 mb-4" />
        <p className="text-sm text-slate-400 leading-relaxed">{a}</p>
      </div>
    )}
  </div>
)

// ── Main component ─────────────────────────────
const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section id="faq" className="relative z-10 px-6 md:px-12 pb-24">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-2.5 mb-4">
          <span className="w-6 h-0.5 rounded-full bg-blue-500" />
          <span className="text-xs font-semibold text-blue-400 uppercase tracking-[2px]">
            FAQ
          </span>
        </div>

        <h2
          className="font-extrabold text-slate-100 mb-4 leading-tight"
          style={{
            fontFamily: "var(--font-d)",
            fontSize: "clamp(28px, 4vw, 44px)",
            letterSpacing: -1.5,
          }}
        >
          Frequently asked questions
        </h2>

        <p className="text-slate-400 text-base mb-12 max-w-xl leading-relaxed">
          Everything you need to know about WeatherWise. Can not find the
          answer? Feel free to reach out to our team.
        </p>

        {/* Two column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {FAQS.map((faq, i) => (
            <FAQItem
              key={i}
              q={faq.q}
              a={faq.a}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 text-center">
          <p className="text-sm text-slate-400">
            Still have questions?{" "}
            <Link
              href="/contact"
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200"
            >
              Contact our support team →
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}

export default FAQSection
