"use client";

import { motion } from "framer-motion";

const features = [
  {
    icon: "🕸️",
    title: "Graph Intelligence",
    desc: "Neo4j AuraDB stores every entity relationship — shared devices, IPs, bank accounts — creating a live fraud network map.",
    color: "from-blue-500 to-cyan-400",
    border: "border-blue-500/30",
    glow: "shadow-blue-500/10",
  },
  {
    icon: "🔄",
    title: "Ring Replay",
    desc: "Visual timeline showing exactly how a fraud ring formed — which merchant joined when, and what signals connected them.",
    color: "from-purple-500 to-pink-400",
    border: "border-purple-500/30",
    glow: "shadow-purple-500/10",
  },
  {
    icon: "🧠",
    title: "AI Risk Memos",
    desc: "Claude analyzes Cypher graph output and generates plain-language explanations with recommended actions for each alert.",
    color: "from-amber-500 to-orange-400",
    border: "border-amber-500/30",
    glow: "shadow-amber-500/10",
  },
  {
    icon: "⚡",
    title: "Durable Workflows",
    desc: "Render Workflows power every investigation with retry-safe, resumable execution — no investigation is ever lost.",
    color: "from-green-500 to-emerald-400",
    border: "border-green-500/30",
    glow: "shadow-green-500/10",
  },
  {
    icon: "🎯",
    title: "Path Explorer",
    desc: "Click any merchant and instantly see 2nd and 3rd degree links — shared devices, IPs, and bank accounts across the graph.",
    color: "from-red-500 to-rose-400",
    border: "border-red-500/30",
    glow: "shadow-red-500/10",
  },
  {
    icon: "📊",
    title: "Risk Scoring",
    desc: "Transparent weighted heuristic scoring combines distance-to-flagged entity, signal strength, and historical patterns.",
    color: "from-indigo-500 to-violet-400",
    border: "border-indigo-500/30",
    glow: "shadow-indigo-500/10",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Features() {
  return (
    <section id="features" className="relative py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Why Vanguard Graph
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Six layers of fraud intelligence working together to protect your platform.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((f) => (
            <motion.div
              key={f.title}
              variants={cardVariants}
              className={`group relative bg-white/5 backdrop-blur-sm rounded-2xl p-6 border ${f.border} hover:scale-[1.02] transition-all duration-300 shadow-lg ${f.glow} hover:shadow-xl`}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center text-2xl mb-4`}>
                {f.icon}
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${f.color} blur-3xl -z-10`} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
