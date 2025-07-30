import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQueryWithReauth } from '@/lib/custom-base-query';


export const driversApi = createApi({
    reducerPath: 'driversApi',
    baseQuery: customBaseQueryWithReauth,
    endpoints: (builder) => ({
        getallDrivers: builder.query({
            query: (inviterId) => `/users/${inviterId}/drivers`,
        }),
    }),
});

export const {
    useGetallDriversQuery
} = driversApi;

