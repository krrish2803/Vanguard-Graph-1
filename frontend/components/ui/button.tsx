"use client"

import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const buttonVariants = cva(
  "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary: "bg-[var(--accent-blue)] hover:bg-blue-500 text-white shadow-lg shadow-[var(--accent-blue-glow)] hover:shadow-blue-500/40",
        ghost: "bg-white/5 hover:bg-white/10 text-[var(--text-primary)] border border-[var(--bg-border)]",
        danger: "bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-[var(--danger-glow)]",
        outline: "bg-transparent border border-[var(--bg-border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-white/20",
        success: "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-[var(--success-glow)]",
      },
      size: {
        sm: "h-8 px-3 text-xs rounded-lg",
        md: "h-10 px-4 text-sm rounded-xl",
        lg: "h-12 px-6 text-base rounded-xl",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
)

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  loading?: boolean
}

export function Button({ className, variant, size, loading, children, disabled, ...props }: ButtonProps) {
  return (
    <button className={cn(buttonVariants({ variant, size }), className)} disabled={disabled || loading} {...props}>
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  )
}
