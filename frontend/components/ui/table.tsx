"use client"

import { cn } from "@/lib/utils"

interface TableProps {
  className?: string
  children: React.ReactNode
}

export function Table({ className, children }: TableProps) {
  return (
    <div className={cn("w-full overflow-x-auto", className)}>
      <table className="w-full border-collapse">{children}</table>
    </div>
  )
}

export function TableHeader({ className, children }: TableProps) {
  return <thead className={cn("border-b border-[var(--bg-border)]", className)}>{children}</thead>
}

export function TableBody({ className, children }: TableProps) {
  return <tbody className={cn("divide-y divide-[var(--bg-border)]", className)}>{children}</tbody>
}

export function TableRow({ className, children, onClick }: TableProps & { onClick?: () => void }) {
  return (
    <tr
      onClick={onClick}
      className={cn(
        "transition-colors duration-150",
        onClick && "cursor-pointer hover:bg-white/5",
        className
      )}
    >
      {children}
    </tr>
  )
}

export function TableHead({ className, children }: TableProps) {
  return (
    <th className={cn("px-4 py-3 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider", className)}>
      {children}
    </th>
  )
}

export function TableCell({ className, children }: TableProps) {
  return <td className={cn("px-4 py-3 text-sm text-[var(--text-secondary)]", className)}>{children}</td>
}
