"use client"

import { PageHeader } from "@/components/shared/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MerchantsTable } from "./_components/merchants-table"
import { useRouter } from "next/navigation"
import { Plus } from "lucide-react"

export default function MerchantsPage() {
  const router = useRouter()

  return (
    <div>
      <PageHeader
        title="Merchants"
        description="View and manage your merchant portfolio"
        action={
          <Button variant="primary" size="sm" onClick={() => router.push("/merchants/new")}>
            <Plus className="w-4 h-4 mr-1" /> New Merchant
          </Button>
        }
      />
      <Card>
        <CardContent>
          <MerchantsTable />
        </CardContent>
      </Card>
    </div>
  )
}
