"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { merchantFormSchema, type MerchantFormSchema } from "@/features/merchants/schemas"
import { useCreateMerchant } from "@/features/merchants/hooks"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface MerchantFormProps {
  onSuccess: () => void
}

export function MerchantForm({ onSuccess }: MerchantFormProps) {
  const mutation = useCreateMerchant()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MerchantFormSchema>({
    resolver: zodResolver(merchantFormSchema),
  })

  function onSubmit(data: MerchantFormSchema) {
    mutation.mutate(data, { onSuccess })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-[var(--text-secondary)]">Business Name</label>
          <input
            {...register("name")}
            placeholder="Rajesh Kumar Traders"
            className="w-full h-10 bg-[var(--bg-base)] border border-[var(--bg-border)] rounded-xl px-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20"
          />
          {errors.name && <p className="text-xs text-red-400">{errors.name.message}</p>}
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-[var(--text-secondary)]">Email</label>
          <input
            {...register("email")}
            placeholder="contact@business.com"
            className="w-full h-10 bg-[var(--bg-base)] border border-[var(--bg-border)] rounded-xl px-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20"
          />
          {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-[var(--text-secondary)]">Phone</label>
          <input
            {...register("phone")}
            placeholder="9876543210"
            className="w-full h-10 bg-[var(--bg-base)] border border-[var(--bg-border)] rounded-xl px-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20"
          />
          {errors.phone && <p className="text-xs text-red-400">{errors.phone.message}</p>}
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-[var(--text-secondary)]">Device Fingerprint</label>
          <input
            {...register("deviceFingerprint")}
            placeholder="D-000"
            className="w-full h-10 bg-[var(--bg-base)] border border-[var(--bg-border)] rounded-xl px-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20"
          />
          {errors.deviceFingerprint && <p className="text-xs text-red-400">{errors.deviceFingerprint.message}</p>}
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-[var(--text-secondary)]">IP Address</label>
          <input
            {...register("ipAddress")}
            placeholder="192.168.1.1"
            className="w-full h-10 bg-[var(--bg-base)] border border-[var(--bg-border)] rounded-xl px-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20"
          />
          {errors.ipAddress && <p className="text-xs text-red-400">{errors.ipAddress.message}</p>}
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-[var(--text-secondary)]">Bank Account</label>
          <input
            {...register("bankAccountNumber")}
            placeholder="****4421"
            className="w-full h-10 bg-[var(--bg-base)] border border-[var(--bg-border)] rounded-xl px-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20"
          />
          {errors.bankAccountNumber && <p className="text-xs text-red-400">{errors.bankAccountNumber.message}</p>}
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-[var(--text-secondary)]">IFSC Code</label>
          <input
            {...register("bankAccountIfsc")}
            placeholder="HDFC0001234"
            className="w-full h-10 bg-[var(--bg-base)] border border-[var(--bg-border)] rounded-xl px-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20"
          />
          {errors.bankAccountIfsc && <p className="text-xs text-red-400">{errors.bankAccountIfsc.message}</p>}
        </div>
      </div>
      <div className="flex justify-end gap-3">
        <Button variant="ghost" size="md" type="button" onClick={onSuccess}>
          Cancel
        </Button>
        <Button variant="primary" size="md" type="submit" loading={mutation.isPending}>
          <Loader2 className="w-4 h-4 mr-1" /> Submit for Review
        </Button>
      </div>
    </form>
  )
}
