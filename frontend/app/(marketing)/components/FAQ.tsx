"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    q: "What types of fraud does Vanguard Graph detect?",
    a: "Vanguard Graph specializes in detecting coordinated fraud rings — groups of merchants sharing devices, IP addresses, bank accounts, or other signals. It catches synthetic identity rings, account takeover networks, and cross-merchant collusion schemes that traditional flat checks miss.",
  },
  {
    q: "How does the graph model work?",
    a: "Every merchant onboarding creates nodes (merchant, device, IP, bank account) and edges (uses_device, connects_from_ip, has_bank_account) in Neo4j AuraDB. When a new merchant onboards, Cypher queries traverse the graph looking for shared entities up to 3 degrees away, scoring each connection path.",
  },
  {
    q: "What is Ring Replay?",
    a: "Ring Replay is a visual timeline feature that shows how a fraud ring formed over time. You can see which merchant joined first, what device or bank account they shared, and how each subsequent merchant connected to the ring — all in an animated, playable interface.",
  },
  {
    q: "How does the AI risk memo work?",
    a: "When an investigation completes, the raw Cypher output (node IDs, relationship paths, scores) is sent to Claude AI via NVIDIA's API. Claude generates a plain-language memo explaining the risk in simple terms — what was found, why it matters, and what action to take.",
  },
  {
    q: "Is this real-time?",
    a: "Yes. Every merchant onboarding triggers an automated investigation workflow. The graph query runs in milliseconds, the AI memo generates in seconds, and the results appear in the dashboard immediately via Render Workflows.",
  },
  {
    q: "What tracks does this cover?",
    a: "Vanguard Graph covers device fingerprints (canvas, WebGL, audio), IP addresses (with geolocation and proxy detection), bank account numbers and IFSC codes, email addresses, phone numbers, and behavioral signals like typing patterns and mouse movements.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="relative py-28 px-6 border-t border-white/5">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-400 text-lg">
            Everything you need to know about Vanguard Graph.
          </p>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="bg-white/5 border border-white/10 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4 text-left text-sm font-medium text-white hover:bg-white/5 transition-colors"
              >
                <span>{faq.q}</span>
                <motion.svg
                  animate={{ rotate: openIndex === i ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-gray-500 shrink-0 ml-4"
                >
                  <path d="M4 6l4 4 4-4" />
                </motion.svg>
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-6 pb-4 text-sm text-gray-400 leading-relaxed">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
