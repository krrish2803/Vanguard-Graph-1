"use client"

import { useState } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import Sidebar from "./_components/sidebar"
import Topbar from "./_components/topbar"
import { CommandMenu } from "./_components/command-menu"

const queryClient = new QueryClient()

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <QueryClientProvider client={queryClient}>
      <DashboardShell sidebarCollapsed={sidebarCollapsed} setSidebarCollapsed={setSidebarCollapsed}>
        {children}
      </DashboardShell>
    </QueryClientProvider>
  )
}

function DashboardShell({
  children,
  sidebarCollapsed,
  setSidebarCollapsed,
}: {
  children: React.ReactNode
  sidebarCollapsed: boolean
  setSidebarCollapsed: (v: boolean) => void
}) {

  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex">
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
      <CommandMenu />
    </div>
  )
}
