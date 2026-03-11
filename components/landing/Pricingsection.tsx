import Link from "next/link"

const PLANS = [
  {
    name: "Free",
    price: "0",
    desc: "Perfect for personal use and casual weather checking.",
    popular: false,
    features: [
      "7-day forecast",
      "Current weather",
      "Air quality index",
      "3 saved cities",
      "Basic weather alerts",
      "°C / °F toggle",
    ],
    cta: "Get started free",
    href: "/register",
    style: "border-white/[0.07] bg-white/[0.03]",
    btnStyle:
      "bg-white/10 border border-white/15 text-slate-100 hover:bg-white/15",
  },
  {
    name: "Pro",
    price: "4",
    desc: "For weather enthusiasts who want the full experience.",
    popular: true,
    features: [
      "Everything in Free",
      "Hourly forecast (48hr)",
      "Interactive radar map",
      "Unlimited saved cities",
      "Advanced weather alerts",
      "City comparison (4 cities)",
      "Smart AI insights",
      "Historical weather data",
    ],
    cta: "Start Pro free",
    href: "/register?plan=pro",
    style: "border-blue-500/40 bg-blue-500/[0.06]",
    btnStyle: "bg-blue-500 text-white hover:bg-blue-600",
  },
  {
    name: "Team",
    price: "12",
    desc: "For teams, businesses and power users.",
    popular: false,
    features: [
      "Everything in Pro",
      "Up to 10 team members",
      "API access",
      "Custom alert rules",
      "Priority support",
      "Data export (CSV, JSON)",
    ],
    cta: "Contact us",
    href: "/contact",
    style: "border-white/[0.07] bg-white/[0.03]",
    btnStyle:
      "bg-white/10 border border-white/15 text-slate-100 hover:bg-white/15",
  },
]

const PricingSection = () => {
  return (
    <section id="pricing" className="relative z-10 px-6 md:px-12 pb-24">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-2.5 mb-4">
          <span className="w-6 h-0.5 rounded-full bg-blue-500" />
          <span className="text-xs font-semibold text-blue-400 uppercase tracking-[2px]">
            Pricing
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
          Simple, transparent pricing
        </h2>

        <p className="text-slate-400 text-base mb-12 max-w-xl leading-relaxed">
          Start free, upgrade when you need more. No hidden fees, no surprises.
          Cancel anytime.
        </p>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-3xl p-8 border transition-all duration-300
                          hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(0,0,0,0.4)]
                          ${plan.style}`}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div
                  className="absolute -top-3.5 left-1/2 -translate-x-1/2
                                px-4 py-1 rounded-full text-xs font-bold
                                bg-blue-500 text-white whitespace-nowrap"
                  style={{ boxShadow: "0 0 16px rgba(59,130,246,0.5)" }}
                >
                  Most popular
                </div>
              )}

              {/* Plan name */}
              <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-4">
                {plan.name}
              </p>

              {/* Price */}
              <div className="flex items-end gap-1 mb-2">
                <span className="text-slate-500 text-lg mb-1">$</span>
                <span
                  className="font-extrabold text-slate-100 leading-none"
                  style={{
                    fontFamily: "var(--font-d)",
                    fontSize: 52,
                    letterSpacing: -2,
                  }}
                >
                  {plan.price}
                </span>
                <span className="text-slate-500 text-sm mb-2">/ month</span>
              </div>

              <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                {plan.desc}
              </p>

              {/* CTA */}
              <Link
                href={plan.href}
                className={`block w-full text-center py-3 rounded-2xl text-sm font-semibold
                            transition-all duration-200 hover:-translate-y-px mb-8 ${plan.btnStyle}`}
                style={
                  plan.popular
                    ? { boxShadow: "0 0 20px rgba(59,130,246,0.3)" }
                    : {}
                }
              >
                {plan.cta}
              </Link>

              {/* Divider */}
              <div className="h-px bg-white/[0.07] mb-6" />

              {/* Features */}
              <ul className="flex flex-col gap-3">
                {plan.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-3 text-sm text-slate-300"
                  >
                    <span className="text-green-400 font-bold mt-0.5 shrink-0">
                      ✓
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <p className="text-center text-sm text-slate-500 mt-8">
          All plans include a 14-day free trial. No credit card required.
        </p>
      </div>
    </section>
  )
}

export default PricingSection
