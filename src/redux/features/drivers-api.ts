import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQueryWithReauth } from '@/lib/custom-base-query';
import { DriverRegistrationData } from '@/types/drivers.types';

export const driversApi = createApi({
    reducerPath: 'driversApi',
    baseQuery: customBaseQueryWithReauth,
    tagTypes: ['Drivers'],
    endpoints: (builder) => ({
        getallDrivers: builder.query({
            query: () => `/drivers`,
            providesTags: ['Drivers'],
        }),
        getaDriver: builder.query({
            query: (id) => `/drivers/${id}`,
            providesTags: ['Drivers'],
        }),
        createDriver: builder.mutation({
            query: ({ data }: { data: DriverRegistrationData }) => ({
                url: '/drivers',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Drivers'],
        }),
        updateDriver: builder.mutation({
            query: ({ id, data }: { id?: string, data: DriverRegistrationData }) => ({
                url: `/drivers/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Drivers'],
        }),
    }),
});

export const {
    useGetallDriversQuery,
    useGetaDriverQuery,
    useCreateDriverMutation,
    useUpdateDriverMutation
} = driversApi;

