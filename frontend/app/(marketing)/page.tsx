import Header from "./components/Header"
import Hero from "./components/Hero"
import Features from "./components/Features"
import WhyUs from "./components/WhyUs"
import CTA from "./components/CTA"
import FAQ from "./components/FAQ"
import Footer from "./components/Footer"

export default function MarketingPage() {
  return (
    <main className="bg-black text-white min-h-screen">
      <Header />
      <Hero />
      <Features />
      <WhyUs />
      <CTA />
      <FAQ />
      <Footer />
    </main>
  )
}
