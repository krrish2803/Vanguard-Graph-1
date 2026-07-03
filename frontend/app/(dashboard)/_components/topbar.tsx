"use client"

import { Bell, Search } from "lucide-react"

export default function Topbar() {
  return (
    <header className="h-16 border-b border-[var(--bg-border)] bg-[var(--bg-surface)] flex items-center justify-between px-6">
      <div className="relative w-80">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
        <input
          type="text"
          placeholder="Search merchants, alerts, investigations..."
          className="w-full h-9 bg-[var(--bg-base)] border border-[var(--bg-border)] rounded-xl pl-9 pr-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-colors"
        />
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-xs text-emerald-400 font-mono">System Active</span>
        </div>

        <button className="relative p-2 rounded-xl hover:bg-white/5 transition-colors">
          <Bell className="w-5 h-5 text-[var(--text-muted)]" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
          KR
        </div>
      </div>
    </header>
  )
}
