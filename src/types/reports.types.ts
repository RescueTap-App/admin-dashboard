export type Report = {
  _id: string
  reportId: string
  type: "quick" | "detailed"
  userId: string | { _id: string; firstName?: string; lastName?: string }
  location?: {
    address?: string
    latitude?: number
    longitude?: number
  }
  category?: string
  description?: string
  urgencyLevel: "low" | "medium" | "high" | "critical"
  status: "pending" | "verified" | "resolved"
  createdAt: string
  updatedAt: string
}