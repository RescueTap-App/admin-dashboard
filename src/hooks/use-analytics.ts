"use client"

import {
  useGetAdminDashboardAnalyticsQuery,
  useGetEmergenciesAnalyticsQuery,
  useGetVoiceNotesAnalyticsQuery,
  useGetLiveLocationAnalyticsQuery,
  useGetKPIsAnalyticsQuery,
} from "@/redux/features/analytics-api"

interface UseAnalyticsOptions {
  fetchDashboard?: boolean
  fetchEmergencies?: boolean
  fetchVoiceNotes?: boolean
  fetchLiveLocation?: boolean
  fetchKPIs?: boolean
  dateRange?: 'week' | 'month' | 'year'
  emergencyFilters?: {
    region?: string
    type?: string
    severity?: string
  }
}

export default function useAnalytics({
  fetchDashboard = false,
  fetchEmergencies = false,
  fetchVoiceNotes = false,
  fetchLiveLocation = false,
  fetchKPIs = false,
  dateRange = 'month',
  emergencyFilters = {},
}: UseAnalyticsOptions = {}) {
  const { data: dashboardData, isLoading: loadingDashboard } =
    useGetAdminDashboardAnalyticsQuery({ dateRange }, { skip: !fetchDashboard })

  const { data: emergenciesData, isLoading: loadingEmergencies } =
    useGetEmergenciesAnalyticsQuery(emergencyFilters, { skip: !fetchEmergencies })

  const { data: voiceNotesData, isLoading: loadingVoiceNotes } =
    useGetVoiceNotesAnalyticsQuery({ dateRange }, { skip: !fetchVoiceNotes })

  const { data: liveLocationData, isLoading: loadingLiveLocation } =
    useGetLiveLocationAnalyticsQuery(undefined, { skip: !fetchLiveLocation })

  const { data: kpisData, isLoading: loadingKPIs } =
    useGetKPIsAnalyticsQuery({ dateRange }, { skip: !fetchKPIs })

  return {
    dashboardData,
    loadingDashboard,
    emergenciesData,
    loadingEmergencies,
    voiceNotesData,
    loadingVoiceNotes,
    liveLocationData,
    loadingLiveLocation,
    kpisData,
    loadingKPIs,
  }
}
