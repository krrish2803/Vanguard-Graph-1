"use client"

import { cn } from "@/lib/utils"

interface CardProps {
  className?: string
  children: React.ReactNode
  glow?: "red" | "blue" | "purple" | "warning" | "success" | null
  hover?: boolean
  onClick?: () => void
}

export function Card({ className, children, glow, hover, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "glass rounded-xl p-5 transition-all duration-200",
        glow && `glow-${glow}`,
        hover && "hover:border-white/20 cursor-pointer",
        className
      )}
    >
      {children}
    </div>
  )
}

export function CardHeader({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("flex items-center justify-between mb-4", className)}>{children}</div>
}

export function CardTitle({ className, children }: { className?: string; children: React.ReactNode }) {
  return <h3 className={cn("text-sm font-semibold text-[var(--text-primary)]", className)}>{children}</h3>
}

export function CardContent({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn(className)}>{children}</div>
}
