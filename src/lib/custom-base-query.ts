import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import type { RootState } from '@/lib/store'; 

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const customBaseQueryWithReauth: BaseQueryFn<any, unknown, unknown> = async (args, api, extraOptions) => {
  const token = (api.getState() as RootState).auth.token;

  const rawBaseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.rescuetap.org',
    prepareHeaders: (headers) => {
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  });

  const result = await rawBaseQuery(args, api, extraOptions);

  // Optional: Add re-auth flow here if needed (e.g., handle 401 errors)

  return result;
};
