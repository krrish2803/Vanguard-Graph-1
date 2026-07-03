"use client"

import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/shared/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { MerchantForm } from "./_components/merchant-form"

export default function NewMerchantPage() {
  const router = useRouter()

  return (
    <div>
      <PageHeader
        title="New Merchant"
        description="Onboard a new merchant for risk evaluation"
      />
      <Card>
        <CardContent>
          <MerchantForm onSuccess={() => router.push("/merchants")} />
        </CardContent>
      </Card>
    </div>
  )
}
