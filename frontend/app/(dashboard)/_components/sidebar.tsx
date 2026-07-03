"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Bell,
  Search,
  Network,
  Store,
  Workflow,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User,
} from "lucide-react"

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Alerts", href: "/alerts", icon: Bell, count: 8 },
  { label: "Investigations", href: "/investigations", icon: Search },
  { label: "Graph", href: "/graph", icon: Network },
  { label: "Merchants", href: "/merchants", icon: Store },
  { label: "Workflows", href: "/workflows", icon: Workflow },
  { label: "Settings", href: "/settings", icon: Settings },
]

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname()

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 64 : 240 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="h-screen bg-[var(--bg-surface)] border-r border-[var(--bg-border)] flex flex-col shrink-0 overflow-hidden"
    >
      <div className={cn("flex items-center h-16 border-b border-[var(--bg-border)]", collapsed ? "justify-center px-2" : "px-4")}>
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-lg shadow-blue-500/25">
            V
          </div>
          {!collapsed && (
            <span className="font-bold text-sm">
              Vanguard Graph
            </span>
          )}
        </Link>
      </div>

      <nav className="flex-1 py-4 space-y-1 px-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group relative",
                active
                  ? "bg-blue-500/10 text-blue-400 border-l-2 border-blue-500"
                  : "text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-white/5"
              )}
            >
              {active && collapsed && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-blue-500 rounded-full glow-blue" />
              )}
              <Icon className="w-5 h-5 shrink-0" />
              {!collapsed && (
                <span className="text-sm font-medium">
                  {item.label}
                </span>
              )}
              {item.count && !collapsed && (
                <span className="ml-auto bg-red-500/10 text-red-400 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {item.count}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-[var(--bg-border)] p-3">
        <div className={cn("flex items-center gap-3 mb-3", collapsed && "justify-center")}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
            KR
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">Krrish</p>
              <p className="text-[10px] text-[var(--text-muted)] truncate">Admin</p>
            </div>
          )}
        </div>
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center h-8 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-white/5 transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </motion.aside>
  )
}
