"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Header from "../components/Header";
import Footer from "../components/Footer";

const tiers = [
  {
    name: "Free",
    price: "₹0",
    desc: "For individual developers exploring graph fraud detection.",
    features: [
      "Up to 100 merchants",
      "Basic graph queries",
      "Email alerts",
      "Community support",
      "7-day data retention",
    ],
    cta: "Get Started",
    href: "/dashboard",
  },
  {
    name: "Pro",
    price: "₹2,499",
    period: "/mo",
    desc: "For growing fintech teams that need real-time fraud prevention.",
    features: [
      "Up to 10,000 merchants",
      "Full graph traversal (3 degrees)",
      "AI risk memos via Claude",
      "Ring Replay timeline",
      "Slack + webhook alerts",
      "30-day data retention",
      "Priority support",
    ],
    cta: "Start Free Trial",
    href: "/dashboard",
    recommended: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    desc: "For platforms with custom compliance and scale requirements.",
    features: [
      "Unlimited merchants",
      "Custom graph schemas",
      "On-premise deployment option",
      "Dedicated Claude AI fine-tuning",
      "Custom retention policies",
      "SLA with 99.99% uptime",
      "24/7 dedicated support",
      "SSO + RBAC",
    ],
    cta: "Contact Sales",
    href: "#contact",
  },
];

export default function PricingPage() {
  return (
    <main className="bg-black text-white min-h-screen">
      <Header />
      <section className="pt-32 pb-28 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Simple, Transparent Pricing
            </h1>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              Start free, scale as you grow. No hidden fees.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {tiers.map((tier, i) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`relative rounded-2xl p-8 flex flex-col ${
                  tier.recommended
                    ? "bg-gradient-to-b from-blue-600/10 via-purple-600/10 to-pink-600/10 border-2 border-blue-500/50 shadow-xl shadow-blue-600/10"
                    : "bg-white/5 border border-white/10"
                }`}
              >
                {tier.recommended && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white text-xs font-semibold px-4 py-1 rounded-full">
                    Recommended
                  </div>
                )}

                {tier.recommended && (
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 blur-3xl -z-10" />
                )}

                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-1">{tier.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold">{tier.price}</span>
                    {tier.period && (
                      <span className="text-sm text-gray-500">{tier.period}</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-400 mt-2">{tier.desc}</p>
                </div>

                <div className="flex-1 space-y-3 mb-8">
                  {tier.features.map((f) => (
                    <div key={f} className="flex items-start gap-3 text-sm text-gray-300">
                      <svg className="w-4 h-4 mt-0.5 shrink-0 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                      {f}
                    </div>
                  ))}
                </div>

                <Link
                  href={tier.href}
                  className={`text-center font-semibold py-3 rounded-full transition-all text-sm ${
                    tier.recommended
                      ? "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/25"
                      : "bg-white/10 hover:bg-white/20 text-white"
                  }`}
                >
                  {tier.cta}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
