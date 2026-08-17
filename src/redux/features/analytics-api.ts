import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQueryWithReauth } from '@/lib/custom-base-query';

export type EmergencyData = {
  _id: string;
  type: 'Fire' | 'Accident' | 'Crime' | 'Medical' | 'Other';
  region: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  timeOfDay: 'Morning' | 'Afternoon' | 'Evening' | 'Night';
  dayOfWeek: string;
  timestamp: string;
  respondedAt?: string;
  resolvedAt?: string;
};

export type VoiceNotesAnalyticsData = {
  dailyCount: number;
  averageDuration: number;
  topTopics: Array<{ topic: string; count: number }>;
  topUsers: Array<{ userId: string; count: number }>;
  topOrganizations: Array<{ orgId: string; orgName: string; count: number }>;
  totalNotes: number;
};

export type LiveLocationAnalyticsData = {
  activeUsers: number;
  averageSessionDuration: number;
  peakHours: Array<{ hour: string; count: number }>;
  emergencyTriggeredSessions: number;
};

export type KPIData = {
  totalEmergenciesThisMonth: number;
  totalEmergenciesLastMonth: number;
  emergencyPercentageChange: number;
  averageResponseTime: number; // in minutes
  activeUsersPerRegion: Array<{ region: string; count: number }>;
  mostActiveOrganizations: Array<{ name: string; emergencies: number }>;
  emergencyDensityHeatmap: Array<{
    region: string;
    lat: number;
    lng: number;
    density: number;
  }>;
  emergenciesByType: Array<{ type: string; count: number }>;
  emergenciesBySeverity: Array<{ severity: string; count: number }>;
};

export type AdminDashboardAnalytics = {
  emergencies: EmergencyData[];
  voiceNotes: VoiceNotesAnalyticsData;
  liveLocation: LiveLocationAnalyticsData;
  kpis: KPIData;
  timestamp: string;
};

export const analyticsApi = createApi({
  reducerPath: 'analyticsApi',
  baseQuery: customBaseQueryWithReauth,
  tagTypes: ['Analytics', 'Emergencies', 'VoiceNotes', 'LiveLocation', 'KPIs'],
  endpoints: (builder) => ({
    getAdminDashboardAnalytics: builder.query<AdminDashboardAnalytics, { dateRange?: 'week' | 'month' | 'year' }>({
      query: ({ dateRange = 'month' }) =>
        `/analytics/dashboard?dateRange=${dateRange}`,
      providesTags: ['Analytics'],
    }),
    getEmergenciesAnalytics: builder.query<
      EmergencyData[],
      { region?: string; type?: string; severity?: string }
    >({
      query: ({ region, type, severity }) => {
        const params = new URLSearchParams();
        if (region) params.append('region', region);
        if (type) params.append('type', type);
        if (severity) params.append('severity', severity);
        return `/analytics/emergencies?${params.toString()}`;
      },
      providesTags: ['Emergencies'],
    }),
    getVoiceNotesAnalytics: builder.query<VoiceNotesAnalyticsData, { dateRange?: string }>({
      query: ({ dateRange = '30days' }) =>
        `/analytics/voice-notes?dateRange=${dateRange}`,
      providesTags: ['VoiceNotes'],
    }),
    getLiveLocationAnalytics: builder.query<LiveLocationAnalyticsData, void>({
      query: () => `/analytics/live-location`,
      providesTags: ['LiveLocation'],
    }),
    getKPIsAnalytics: builder.query<KPIData, { dateRange?: string }>({
      query: ({ dateRange = '30days' }) =>
        `/analytics/kpis?dateRange=${dateRange}`,
      providesTags: ['KPIs'],
    }),
  }),
});

export const {
  useGetAdminDashboardAnalyticsQuery,
  useGetEmergenciesAnalyticsQuery,
  useGetVoiceNotesAnalyticsQuery,
  useGetLiveLocationAnalyticsQuery,
  useGetKPIsAnalyticsQuery,
} = analyticsApi;
