"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const stats = [
  { value: "10,000+", label: "Merchants Analyzed" },
  { value: "847", label: "Fraud Rings Detected" },
  { value: "₹2.3Cr", label: "Saved" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function Hero() {
  const [counts, setCounts] = useState([0, 0, 0]);

  const particles = useMemo(() => {
    const rng = seededRandom(42);
    return Array.from({ length: 40 }).map((_, i) => ({
      key: i,
      left: `${rng() * 100}%`,
      top: `${rng() * 100}%`,
      delay: `${rng() * 3}s`,
      duration: `${2 + rng() * 3}s`,
    }));
  }, []);

  useEffect(() => {
    const targets = [10000, 847, 23];
    const duration = 2000;
    const start = Date.now();

    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      setCounts([
        Math.floor(progress * targets[0]),
        Math.floor(progress * targets[1]),
        Math.floor(progress * targets[2]),
      ]);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 animate-mesh bg-gradient-to-br from-blue-900/30 via-purple-900/20 to-pink-900/30" />

      <div className="absolute inset-0">
        {particles.map((p) => (
          <div
            key={p.key}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse-glow"
            style={{
              left: p.left,
              top: p.top,
              animationDelay: p.delay,
              animationDuration: p.duration,
            }}
          />
        ))}
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-5xl mx-auto px-6 text-center"
      >
        <motion.div variants={itemVariants} className="inline-block bg-white/5 border border-white/10 text-xs text-gray-300 px-4 py-1.5 rounded-full mb-8 tracking-wide uppercase backdrop-blur-sm">
          Fraud Coordination Intelligence Engine
        </motion.div>

        <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-extrabold leading-tight mb-6">
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Catch Fraud Rings
          </span>
          <br />
          <span className="text-white">Before Money Moves</span>
        </motion.h1>

        <motion.p variants={itemVariants} className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          Graph-powered fraud intelligence for fintech platforms. Detect coordinated merchant rings in real-time.
        </motion.p>

        <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-4 mb-16">
          <Link
            href="/dashboard"
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-3.5 rounded-full transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-500/50 text-lg"
          >
            Launch Dashboard →
          </Link>
          <a
            href="#how-it-works"
            className="border border-white/20 hover:border-white/40 text-gray-300 hover:text-white font-semibold px-8 py-3.5 rounded-full transition-all text-lg"
          >
            See How It Works
          </a>
        </motion.div>

        <motion.div variants={itemVariants} className="grid grid-cols-3 gap-4 md:gap-8 max-w-2xl mx-auto">
          {stats.map((stat, i) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                {i === 0 && `${counts[i].toLocaleString()}+`}
                {i === 1 && `${counts[i]}`}
                {i === 2 && `₹${counts[i] / 10}Cr`}
              </div>
              <div className="text-xs md:text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
    </section>
  );
}
