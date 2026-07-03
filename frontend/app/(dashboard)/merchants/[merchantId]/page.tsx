"use client"

import { useMerchant } from "@/features/merchants/hooks"
import { PageHeader } from "@/components/shared/page-header"
import { CardSkeleton } from "@/components/ui/skeleton"
import { MerchantProfile } from "./_components/merchant-profile"
import { LinkedEntities } from "./_components/linked-entities"
import { MerchantTimeline } from "./_components/merchant-timeline"

export default function MerchantDetailPage({ params }: { params: { merchantId: string } }) {
  const { data: merchant, isLoading } = useMerchant(params.merchantId)

  if (isLoading) {
    return (
      <div className="space-y-4">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    )
  }

  if (!merchant) {
    return (
      <PageHeader title="Merchant not found" description="The requested merchant does not exist." />
    )
  }

  return (
    <div>
      <PageHeader title={merchant.name} description={`ID: ${merchant.id} · ${merchant.email}`} />
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <MerchantProfile merchant={merchant} />
          <LinkedEntities merchant={merchant} />
        </div>
        <div className="col-span-1">
          <MerchantTimeline merchant={merchant} />
        </div>
      </div>
    </div>
  )
}
