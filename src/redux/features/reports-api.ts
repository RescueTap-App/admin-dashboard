import { createApi } from "@reduxjs/toolkit/query/react"
import { customBaseQueryWithReauth } from "@/lib/custom-base-query"
import type { Report } from "@/types/reports.types"

export const reportsApi = createApi({
  reducerPath: "reportsApi",
  baseQuery: customBaseQueryWithReauth,
  tagTypes: ["Reports"],
  endpoints: (builder) => ({
    getAdminReports: builder.query<Report[], void>({
      query: () => "/reports/admin/all",
      providesTags: ["Reports"],
    }),
  }),
})

export const { useGetAdminReportsQuery } = reportsApi