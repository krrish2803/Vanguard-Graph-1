export type InvestigationStatus = 'pending' | 'ingesting' | 'enriching' | 'graph_linking' | 'scoring' | 'generating_memo' | 'completed' | 'failed'

export interface Investigation {
  id: string
  merchantId: string
  status: InvestigationStatus
  riskScore: number | null
  riskMemo: string | null
  createdAt: Date
  updatedAt: Date
}

export interface CreateInvestigationDTO {
  merchantId: string
}

export interface UpdateInvestigationDTO {
  status?: InvestigationStatus
  riskScore?: number | null
  riskMemo?: string | null
}

export interface InvestigationQuery {
  page?: number
  limit?: number
  merchantId?: string
  status?: InvestigationStatus
}
