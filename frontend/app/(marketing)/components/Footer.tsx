import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 px-6 py-12">
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
        <div>
          <Link href="/" className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold text-xs">
              V
            </div>
            <span className="font-bold text-sm">Vanguard Graph</span>
          </Link>
          <p className="text-xs text-gray-500 max-w-xs">
            Fraud Coordination Intelligence Engine — detecting coordinated merchant rings with graph-powered intelligence.
          </p>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Links</h4>
          <div className="flex flex-col gap-2">
            <Link href="/dashboard" className="text-xs text-gray-500 hover:text-white transition-colors">Dashboard</Link>
            <Link href="/docs" className="text-xs text-gray-500 hover:text-white transition-colors">Documentation</Link>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-xs text-gray-500 hover:text-white transition-colors">GitHub</a>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Built With</h4>
          <p className="text-xs text-gray-500 mb-1">Neo4j + Render + Claude AI</p>
          <p className="text-xs text-gray-600 mt-3">Team: Krrish, Anurag, Naitik</p>
          <p className="text-xs text-gray-600 mt-1">Built for Namespace Hackathon AH6926</p>
        </div>
      </div>
    </footer>
  );
}
