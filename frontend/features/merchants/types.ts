import type { Merchant } from "@/lib/mock-data"

export type { Merchant }
export interface MerchantFormData {
  name: string
  email: string
  phone: string
  deviceFingerprint: string
  ipAddress: string
  bankAccountNumber: string
  bankAccountIfsc: string
}
