"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function CTA() {
  return (
    <section className="relative py-28 px-6 overflow-hidden">
      <div className="absolute inset-0 animate-mesh bg-gradient-to-br from-blue-900/40 via-purple-900/30 to-pink-900/40" />
      <div className="absolute inset-0 bg-black/50" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative z-10 max-w-3xl mx-auto text-center"
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Ready to catch your first fraud ring?
        </h2>
        <p className="text-gray-400 text-lg mb-10 max-w-lg mx-auto">
          Launch the dashboard and see Vanguard Graph in action. Real merchants, real graph data, real risk scores.
        </p>
        <Link
          href="/dashboard"
          className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-semibold px-10 py-4 rounded-full transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-500/50 text-lg"
        >
          Launch Dashboard →
        </Link>
        <div className="mt-8">
          <span className="text-xs text-gray-600 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
            Built for Namespace Hackathon AH6926
          </span>
        </div>
      </motion.div>
    </section>
  );
}
