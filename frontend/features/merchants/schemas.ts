import { z } from "zod"

export const merchantFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Phone must be at least 10 digits"),
  deviceFingerprint: z.string().min(1, "Device fingerprint is required"),
  ipAddress: z.string().ip("Invalid IP address"),
  bankAccountNumber: z.string().min(4, "Bank account is required"),
  bankAccountIfsc: z.string().min(8, "IFSC code is required"),
})

export type MerchantFormSchema = z.infer<typeof merchantFormSchema>
