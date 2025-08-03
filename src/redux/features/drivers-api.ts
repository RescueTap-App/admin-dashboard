import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQueryWithReauth } from '@/lib/custom-base-query';
import { UpdateDriverFormData, CreateDriverFormData } from '@/constants/validations/drivers';

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
            query: ({ data }: { data: CreateDriverFormData }) => ({
                url: '/drivers',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Drivers'],
        }),
        updateDriver: builder.mutation({
            query: ({ id, data }: { id?: string, data: UpdateDriverFormData }) => ({
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

