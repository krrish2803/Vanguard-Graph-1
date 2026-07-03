export default function Loading() {
  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-blue-500/25">
            V
          </div>
          <div className="absolute -inset-2 rounded-2xl border border-blue-500/20 animate-pulse" />
        </div>
        <div className="space-y-2 text-center">
          <p className="text-sm font-mono text-[var(--text-secondary)]">Initializing threat intelligence...</p>
          <div className="h-0.5 w-48 bg-[var(--bg-elevated)] rounded-full overflow-hidden">
            <div className="h-full w-1/3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full animate-[shimmer_1.5s_infinite]" />
          </div>
        </div>
      </div>
    </div>
  )
}
