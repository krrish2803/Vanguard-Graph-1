"use client"

import { PageHeader } from "@/components/shared/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"

const tabs = ["General", "Notifications", "API Keys", "Team", "Billing"]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("General")

  return (
    <div>
      <PageHeader title="Settings" description="Configure your system preferences" />
      <Card>
        <CardContent>
          <div className="flex items-center gap-2 border-b border-[var(--bg-border)] pb-3 mb-6">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? "bg-blue-500/10 text-blue-400"
                    : "text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-white/5"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === "General" && (
            <div className="space-y-6 max-w-lg">
              <Field label="System Name" description="Display name for this instance">
                <input
                  defaultValue="Vanguard Graph"
                  className="w-full h-10 bg-[var(--bg-base)] border border-[var(--bg-border)] rounded-xl px-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-blue-500/50"
                />
              </Field>
              <Field label="Risk Threshold" description="Score above which merchants are flagged as high risk">
                <input
                  defaultValue="70"
                  className="w-full h-10 bg-[var(--bg-base)] border border-[var(--bg-border)] rounded-xl px-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-blue-500/50"
                />
              </Field>
              <Field label="Alert Retention (days)" description="How long to retain resolved alerts">
                <input
                  defaultValue="90"
                  className="w-full h-10 bg-[var(--bg-base)] border border-[var(--bg-border)] rounded-xl px-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-blue-500/50"
                />
              </Field>
              <div className="pt-4">
                <Button variant="primary">Save Changes</Button>
              </div>
            </div>
          )}

          {activeTab !== "General" && (
            <div className="py-12 text-center">
              <p className="text-sm text-[var(--text-muted)]">{activeTab} settings coming soon.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function Field({ label, description, children }: { label: string; description: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-[var(--text-primary)]">{label}</label>
      <p className="text-xs text-[var(--text-muted)]">{description}</p>
      {children}
    </div>
  )
}
