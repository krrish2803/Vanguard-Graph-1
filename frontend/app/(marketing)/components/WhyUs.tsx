"use client";

import { motion } from "framer-motion";

export default function WhyUs() {
  return (
    <section id="how-it-works" className="relative py-28 px-6 border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Traditional Tools vs Vanguard Graph
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Flat checks miss the connections. Graph intelligence catches the rings.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 items-stretch">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                <span className="text-red-400 text-xl">✕</span>
              </div>
              <h3 className="text-xl font-semibold text-red-400">Traditional Fraud Tools</h3>
            </div>

            <div className="space-y-4">
              {[
                "Check one record at a time",
                "Miss shared devices across merchants",
                "No visibility beyond direct matches",
                "Manual investigation with no graph context",
                "Reactive — catch fraud after payout",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 text-gray-400">
                  <span className="text-red-500/60 shrink-0 mt-0.5">✕</span>
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/5">
              <div className="text-xs text-gray-500 mb-2 font-mono">merchants table lookup</div>
              <div className="space-y-1">
                {["merchant_1  →  device: abc  →  no match", "merchant_2  →  device: xyz  →  no match", "merchant_3  →  device: abc  →  no match"].map((row, i) => (
                  <div key={i} className="text-xs text-gray-600 font-mono bg-white/5 px-2 py-1 rounded">{row}</div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 border border-blue-500/20 rounded-2xl p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                <span className="text-green-400 text-xl">✓</span>
              </div>
              <h3 className="text-xl font-semibold text-green-400">Vanguard Graph</h3>
            </div>

            <div className="space-y-4">
              {[
                "Full graph traversal on every onboard",
                "Shared device → shared fraud ring",
                "2nd and 3rd degree connection detection",
                "AI-generated plain-language risk memos",
                "Proactive — catch fraud before payout",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 text-gray-400">
                  <span className="text-green-500/60 shrink-0 mt-0.5">✓</span>
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-white/5 rounded-xl border border-blue-500/10">
              <div className="text-xs text-gray-500 mb-2 font-mono">Cypher graph traversal</div>
              <div className="space-y-1">
                {["merchant_1  ── device: abc ── merchant_3  ⚠️", "                    ╎", "              bank: 1234", "                    ╎", "merchant_2  ────────────  ⚠️ RING DETECTED"].map((row, i) => (
                  <div key={i} className={`text-xs font-mono px-2 py-1 rounded ${row.includes('⚠️') ? 'text-red-400 bg-red-500/10' : 'text-gray-500 bg-white/5'}`}>{row}</div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
