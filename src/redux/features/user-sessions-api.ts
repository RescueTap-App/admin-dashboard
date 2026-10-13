import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQueryWithReauth } from '@/lib/custom-base-query';

export type UserSessionsAnalytics = {
  _id?: string;
  organization_id: string;
  organizationName: string;
  total_logins: number;
  daily_active_users: number;
  seats_used: number;
  seats_allocated: number;
  peak_login_time: string;
  last_login: string;
  login_trend: Array<{
    date: string;
    count: number;
  }>;
};

export type UserSessionStats = {
  totalLogins: number;
  dailyActiveUsers: number;
  seatsUsed: number;
  seatsAllocated: number;
  seatsUsagePercentage: number;
  peakLoginTime: string;
  topOrganizations: UserSessionsAnalytics[];
  loginTrend: Array<{ date: string; count: number }>;
};

export const userSessionsApi = createApi({
  reducerPath: 'userSessionsApi',
  baseQuery: customBaseQueryWithReauth,
  tagTypes: ['UserSessions', 'Organization'],
  endpoints: (builder) => ({
    getUserSessionsAnalytics: builder.query<UserSessionStats, void>({
      query: () => `/users/analytics/dashboard`,
      providesTags: ['UserSessions'],
    }),
    getOrganizationSessionAnalytics: builder.query<UserSessionsAnalytics, string>({
      query: (organizationId: string) =>
        `/users/organization/${organizationId}/sessions/analytics`,
      providesTags: (result, error, organizationId) => [
        { type: 'UserSessions', id: organizationId },
      ],
    }),
    recordUserLogin: builder.mutation<
      { success: boolean },
      {
        organization_id?: string;
        ip_address?: string;
        device_type?: string;
      }
    >({
      query: (data) => ({
        url: `/users/sessions/record-login`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['UserSessions'],
    }),
  }),
});

export const {
  useGetUserSessionsAnalyticsQuery,
  useGetOrganizationSessionAnalyticsQuery,
  useRecordUserLoginMutation,
} = userSessionsApi;
