"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Store, Bell, Network, Workflow, Settings, LayoutDashboard, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

const commands = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Alerts", href: "/alerts", icon: Bell },
  { label: "Investigations", href: "/investigations", icon: Search },
  { label: "Graph View", href: "/graph", icon: Network },
  { label: "Merchants", href: "/merchants", icon: Store },
  { label: "Workflows", href: "/workflows", icon: Workflow },
  { label: "Settings", href: "/settings", icon: Settings },
]

export function CommandMenu() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(0)
  const router = useRouter()

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setOpen((v) => !v)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const filtered = query
    ? commands.filter((c) => c.label.toLowerCase().includes(query.toLowerCase()))
    : commands

  const navigate = useCallback(
    (href: string) => {
      setOpen(false)
      setQuery("")
      router.push(href)
    },
    [router]
  )

  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (!open) return
      if (e.key === "ArrowDown") {
        e.preventDefault()
        setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1))
      }
      if (e.key === "ArrowUp") {
        e.preventDefault()
        setSelectedIndex((i) => Math.max(i - 1, 0))
      }
      if (e.key === "Enter" && filtered[selectedIndex]) {
        e.preventDefault()
        navigate(filtered[selectedIndex].href)
      }
      if (e.key === "Escape") {
        setOpen(false)
        setQuery("")
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [open, filtered, selectedIndex, navigate])

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => { setOpen(false); setQuery("") }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="relative w-full max-w-lg"
          >
            <div className="glass rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border border-[var(--bg-border)]">
              <div className="flex items-center gap-3 px-4 h-12 border-b border-[var(--bg-border)]">
                <Search className="w-4 h-4 text-[var(--text-muted)]" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search pages..."
                  className="flex-1 bg-transparent text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none"
                />
                <kbd className="text-[10px] font-mono text-[var(--text-muted)] border border-[var(--bg-border)] rounded px-1.5 py-0.5">
                  ESC
                </kbd>
              </div>
              <div className="p-2 max-h-64 overflow-y-auto">
                {filtered.length === 0 && (
                  <p className="text-sm text-[var(--text-muted)] text-center py-8">No results found.</p>
                )}
                {filtered.map((cmd, i) => {
                  const Icon = cmd.icon
                  return (
                    <button
                      key={cmd.href}
                      onClick={() => navigate(cmd.href)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors text-left group",
                        i === selectedIndex
                          ? "bg-blue-500/10 text-blue-400"
                          : "text-[var(--text-secondary)] hover:bg-white/5"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="flex-1">{cmd.label}</span>
                      <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  )
                })}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
