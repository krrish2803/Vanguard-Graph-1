import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-500/20 rounded-full"
            style={{
              left: `${((i * 17 + 3) % 100)}%`,
              top: `${((i * 13 + 7) % 100)}%`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
      </div>
      <div className="relative z-10 text-center">
        <h1 className="text-8xl font-bold gradient-text mb-4">404</h1>
        <p className="text-lg text-[var(--text-secondary)] mb-2 font-mono">Entity not found in the graph</p>
        <p className="text-sm text-[var(--text-muted)] mb-8">The page you&apos;re looking for doesn&apos;t exist or has been removed.</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-medium px-6 py-2.5 rounded-xl transition-colors shadow-lg shadow-blue-600/25"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  )
}
