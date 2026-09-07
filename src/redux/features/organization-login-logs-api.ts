import { createApi } from "@reduxjs/toolkit/query/react"
import { customBaseQueryWithReauth } from "@/lib/custom-base-query"

export type OrganizationLoginLog = {
  _id: string
  userId?: { _id: string; firstName?: string; lastName?: string; email?: string } | string
  createdAt?: string
  loggedInAt?: string
  deviceType?: string
  ipAddress?: string
}

export type OrganizationLoginLogArgs = {
  organizationId: string
  from?: string
  to?: string
}

export const organizationLoginLogsApi = createApi({
  reducerPath: "organizationLoginLogsApi",
  baseQuery: customBaseQueryWithReauth,
  tagTypes: ["OrganizationLoginLogs"],
  endpoints: (builder) => ({
    getOrganizationLoginLogs: builder.query<OrganizationLoginLog[], OrganizationLoginLogArgs>({
      query: ({ organizationId, from, to }) => {
        const params = new URLSearchParams()
        if (from) params.set("from", from)
        if (to) params.set("to", to)
        const query = params.toString()
        return `/users/organization/${organizationId}/login-logs${query ? `?${query}` : ""}`
      },
      providesTags: ["OrganizationLoginLogs"],
    }),
  }),
})

export const { useGetOrganizationLoginLogsQuery } = organizationLoginLogsApi