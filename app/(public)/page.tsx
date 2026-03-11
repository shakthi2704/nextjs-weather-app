import HeroSection from "@/components/landing/Herosection"
import HeroWeatherCard from "@/components/landing/Heroweathercard"
import LocationBar from "@/components/landing/Locationbar"
import LandingNavbar from "@/components/landing/LandingNavbar"
import StatsRow from "@/components/landing/Statsrow"
import FeaturesGrid from "@/components/landing/Featuresgrid"
import CTASection from "@/components/landing/Ctasection"
import LandingFooter from "@/components/landing/Landingfooter"
import FAQSection from "@/components/landing/Faqsection"
import PricingSection from "@/components/landing/Pricingsection"

export default function HomePage() {
  return (
    <div className="w-full min-h-screen">
      <LandingNavbar />
      <main>
        <HeroSection />
        <LocationBar />
        <HeroWeatherCard />
        <StatsRow />
        <FeaturesGrid />
        <CTASection />
        <PricingSection />
        <FAQSection />
      </main>
      <LandingFooter />
    </div>
  )
}
