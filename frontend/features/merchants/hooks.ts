import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { merchantsApi } from "./api"
import type { MerchantFormData } from "./types"

export function useMerchants() {
  return useQuery({
    queryKey: ["merchants"],
    queryFn: merchantsApi.list,
  })
}

export function useMerchant(id: string) {
  return useQuery({
    queryKey: ["merchants", id],
    queryFn: () => merchantsApi.getById(id),
    enabled: !!id,
  })
}

export function useCreateMerchant() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: MerchantFormData) => merchantsApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["merchants"] })
    },
  })
}
