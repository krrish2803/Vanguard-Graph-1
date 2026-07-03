"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Header from "../components/Header";
import Footer from "../components/Footer";

const sections = [
  {
    id: "overview",
    title: "Overview",
    content: (
      <div className="space-y-4">
        <p className="text-gray-300 leading-relaxed">
          Vanguard Graph is a fraud coordination intelligence engine that uses graph databases (Neo4j AuraDB)
          to detect coordinated merchant fraud rings in real-time. Every merchant onboarding is checked against
          the existing graph for shared devices, IP addresses, bank accounts, and other signals.
        </p>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="text-xs text-gray-500 font-mono mb-2">// Core concept</div>
          <code className="text-sm text-green-400 font-mono">
            merchant --uses_device--&gt; device &lt;--uses_device-- merchant_2
          </code>
          <div className="text-xs text-gray-500 mt-2">A shared device between two merchants = potential fraud ring</div>
        </div>
      </div>
    ),
  },
  {
    id: "getting-started",
    title: "Getting Started",
    content: (
      <div className="space-y-4">
        <p className="text-gray-300 leading-relaxed">
          Navigate to the Dashboard and start by onboarding merchants. Each merchant&apos;s signals
          (device fingerprint, IP, bank account) are automatically ingested into the Neo4j graph.
        </p>
        <ol className="space-y-3 list-decimal list-inside text-gray-300">
          <li>Open the <a href="/dashboard" className="text-blue-400 hover:underline">Dashboard</a></li>
          <li>Click &ldquo;New Merchant&rdquo; to onboard a test merchant</li>
          <li>Fill in the merchant details (name, email, device, bank account, IP)</li>
          <li>Submit — an investigation workflow triggers automatically</li>
          <li>View the risk score and AI-generated memo in the alerts section</li>
        </ol>
      </div>
    ),
  },
  {
    id: "graph-model",
    title: "Graph Model",
    content: (
      <div className="space-y-4">
        <p className="text-gray-300 leading-relaxed">
          The graph uses a property graph model with the following node types and relationships:
        </p>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 overflow-x-auto">
          <pre className="text-sm font-mono">
            <span className="text-blue-400">(:Merchant)</span>{" "}
            <span className="text-gray-500">-[:USES_DEVICE]-&gt;</span>{" "}
            <span className="text-purple-400">(:Device)</span>
            {"\n"}
            <span className="text-blue-400">(:Merchant)</span>{" "}
            <span className="text-gray-500">-[:CONNECTS_FROM]-&gt;</span>{" "}
            <span className="text-purple-400">(:IPAddress)</span>
            {"\n"}
            <span className="text-blue-400">(:Merchant)</span>{" "}
            <span className="text-gray-500">-[:HAS_BANK_ACCOUNT]-&gt;</span>{" "}
            <span className="text-purple-400">(:BankAccount)</span>
            {"\n"}
            <span className="text-blue-400">(:Merchant)</span>{" "}
            <span className="text-gray-500">-[:HAS_EMAIL]-&gt;</span>{" "}
            <span className="text-purple-400">(:Email)</span>
          </pre>
        </div>
        <p className="text-gray-300 leading-relaxed">
          The graph traversal checks for shared nodes up to 3 degrees of separation.
        </p>
      </div>
    ),
  },
  {
    id: "api",
    title: "API Reference",
    content: (
      <div className="space-y-6">
        <p className="text-gray-300 leading-relaxed">
          The backend exposes a RESTful API at <code className="text-green-400 bg-white/5 px-1.5 py-0.5 rounded text-sm">http://localhost:3001/api/v1</code>.
        </p>
        {[
          { method: "GET", path: "/merchants", desc: "List all merchants (paginated)", params: "?page=1&limit=20&status=active" },
          { method: "GET", path: "/merchants/:id", desc: "Get merchant details by ID", params: "" },
          { method: "POST", path: "/merchants", desc: "Create a new merchant", params: "{ name, email, deviceFingerprint, ... }" },
          { method: "GET", path: "/alerts", desc: "List alerts (paginated, filterable)", params: "?merchantId=xxx&riskLevel=high" },
          { method: "POST", path: "/workflows/trigger", desc: "Trigger an investigation workflow", params: "{ merchantId, workflowType }" },
          { method: "GET", path: "/graph/merchant/:id", desc: "Get Neo4j graph data for a merchant", params: "" },
        ].map((endpoint) => (
          <div key={endpoint.path} className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                endpoint.method === "GET" ? "bg-green-500/20 text-green-400" : "bg-blue-500/20 text-blue-400"
              }`}>
                {endpoint.method}
              </span>
              <code className="text-sm text-gray-200 font-mono">{endpoint.path}</code>
            </div>
            <p className="text-sm text-gray-400 mb-1">{endpoint.desc}</p>
            {endpoint.params && (
              <code className="text-xs text-gray-500 font-mono">{endpoint.params}</code>
            )}
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "ai-memos",
    title: "AI Risk Memos",
    content: (
      <div className="space-y-4">
        <p className="text-gray-300 leading-relaxed">
          When an investigation completes, the raw Cypher output is sent to Claude AI. The generated memo includes:
        </p>
        <ul className="space-y-2 text-gray-300">
          <li className="flex items-start gap-2">
            <span className="text-green-400">•</span>
            <span><strong className="text-white">Risk Summary</strong> — One-line verdict of the finding</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400">•</span>
            <span><strong className="text-white">Evidence Path</strong> — How the connection was discovered</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400">•</span>
            <span><strong className="text-white">Severity Assessment</strong> — Score and confidence level</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400">•</span>
            <span><strong className="text-white">Recommended Action</strong> — Block, review, or pass</span>
          </li>
        </ul>
      </div>
    ),
  },
  {
    id: "architecture",
    title: "Architecture",
    content: (
      <div className="space-y-4">
        <p className="text-gray-300 leading-relaxed">The system is composed of four main layers:</p>
        <div className="space-y-3">
          {[
            { title: "Frontend", desc: "Next.js App Router with Tailwind CSS. Dashboard, alerts, merchant onboarding, and graph visualization." },
            { title: "Backend API", desc: "Express.js with Prisma ORM, Zod validation, JWT auth, and rate limiting." },
            { title: "Graph Database", desc: "Neo4j AuraDB stores the entity relationship graph. Queried via Cypher for ring detection." },
            { title: "Workflow Engine", desc: "Render Workflows handles background investigations with retry and checkpoint recovery." },
          ].map((layer) => (
            <div key={layer.title} className="bg-white/5 border border-white/10 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-white mb-1">{layer.title}</h4>
              <p className="text-sm text-gray-400">{layer.desc}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
];

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState("overview");

  return (
    <main className="bg-black text-white min-h-screen">
      <Header />
      <section className="pt-24 pb-28 px-6">
        <div className="max-w-6xl mx-auto flex gap-8">
          <aside className="hidden lg:block w-56 shrink-0">
            <nav className="sticky top-24 space-y-1">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Documentation</h3>
              {sections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  className={`block w-full text-left text-sm px-3 py-1.5 rounded-lg transition-colors ${
                    activeSection === s.id
                      ? "bg-blue-600/20 text-blue-400 font-medium"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {s.title}
                </button>
              ))}
            </nav>
          </aside>

          <div className="flex-1 min-w-0 max-w-3xl">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-3xl font-bold mb-8">
                {sections.find((s) => s.id === activeSection)?.title}
              </h2>
              {sections.find((s) => s.id === activeSection)?.content}
            </motion.div>
          </div>

          <aside className="hidden xl:block w-48 shrink-0">
            <div className="sticky top-24">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">On this page</h3>
              <div className="space-y-1">
                {sections.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setActiveSection(s.id)}
                    className={`block text-xs transition-colors ${
                      activeSection === s.id ? "text-blue-400" : "text-gray-600 hover:text-gray-400"
                    }`}
                  >
                    {s.title}
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>
      <Footer />
    </main>
  );
}
