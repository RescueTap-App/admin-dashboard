"use client"

import {
  useGetUserSessionsAnalyticsQuery,
  useGetOrganizationSessionAnalyticsQuery,
} from "@/redux/features/user-sessions-api"

interface UseUserSessionsOptions {
  fetchUserSessions?: boolean
  organizationId?: string
}

export default function useUserSessions({
  fetchUserSessions = false,
  organizationId,
}: UseUserSessionsOptions = {}) {
  const {
    data: userSessionsStats,
    isLoading: loadingUserSessions,
    isError: errorUserSessions,
  } = useGetUserSessionsAnalyticsQuery(undefined, {
    skip: !fetchUserSessions,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,
  })

  const {
    data: organizationSessions,
    isLoading: loadingOrgSessions,
    isError: errorOrgSessions,
  } = useGetOrganizationSessionAnalyticsQuery(organizationId!, {
    skip: !organizationId,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,
  })

  return {
    userSessionsStats: userSessionsStats || {
      totalLogins: 0,
      dailyActiveUsers: 0,
      seatsUsed: 0,
      seatsAllocated: 0,
      seatsUsagePercentage: 0,
      peakLoginTime: "N/A",
      topOrganizations: [],
      loginTrend: [],
    },
    loadingUserSessions,
    errorUserSessions,
    organizationSessions,
    loadingOrgSessions,
    errorOrgSessions,
  }
}
