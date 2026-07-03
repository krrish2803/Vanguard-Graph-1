"use client"

export function GraphLegend() {
  const items = [
    { label: "Merchant", color: "#3B82F6" },
    { label: "Device", color: "#A855F7" },
    { label: "Bank Account", color: "#F59E0B" },
    { label: "IP Address", color: "#10B981" },
    { label: "Fraud Case", color: "#EF4444" },
    { label: "Suspicious Link", color: "#EF4444", dashed: true },
  ]

  return (
    <div className="absolute top-4 right-4 glass rounded-xl p-3 space-y-1.5">
      <p className="text-[10px] font-medium text-[var(--text-muted)] uppercase tracking-wider">Legend</p>
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: item.color, opacity: 0.8 }}
          />
          <span className="text-xs text-[var(--text-secondary)]">{item.label}</span>
        </div>
      ))}
    </div>
  )
}
