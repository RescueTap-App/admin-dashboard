import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQueryWithReauth } from '@/lib/custom-base-query';
import { VisitorDataTypes } from '@/types/visitors.types';


export const visitorsApi = createApi({
    reducerPath: 'visitorsApi',
    tagTypes: ['Visitors'],
    baseQuery: customBaseQueryWithReauth,
    endpoints: (builder) => ({
        getOrgVisitors: builder.query({
            query: (orgId: string) => `/visitors/organization/${orgId}/visitors`,
            providesTags: ['Visitors'],
        }),
        getAllVisitors: builder.query({
            query: () => `/visitors/logs`,
            providesTags: ['Visitors'],
        }),
        getTenantVisitors: builder.query({
            query: (tenantId: string) => `/visitors/${tenantId}/visitors`,
            providesTags: ['Visitors'],
        }),
        inviteVisitor: builder.mutation({
            query: ({ data, tenantId }: { data: VisitorDataTypes, tenantId: string }) => ({
                url: `/visitors/${tenantId}/invite`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Visitors'],
        }),
        verifyCode: builder.mutation({
            query: ({ data }: { data: { code: string } }) => ({
                url: `/visitors/verify/${data.code}`,
                method: 'POST',
            }),
            invalidatesTags: ['Visitors'],
        }),
        updateVisitor: builder.mutation({
            query: ({ id, data }: { id?: string, data: VisitorDataTypes }) => ({
                url: `/visitors/${id}`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['Visitors'],
        }),
        cancelVisitor: builder.mutation({
            query: ({ id }: { id?: string }) => ({
                url: `/visitors/${id}/cancel`,
                method: 'PATCH',
            }),
            invalidatesTags: ['Visitors'],
        }),
        checkOutVisitor: builder.mutation({
            query: ({ id }: { id?: string }) => ({
                url: `/visitors/${id}/checkout`,
                method: 'PATCH',
            }),
            invalidatesTags: ['Visitors'],
        }),
    }),
});

export const {
    useGetOrgVisitorsQuery,
    useGetAllVisitorsQuery,
    useGetTenantVisitorsQuery,
    useInviteVisitorMutation,
    useVerifyCodeMutation,
    useUpdateVisitorMutation,
    useCancelVisitorMutation,
    useCheckOutVisitorMutation,
} = visitorsApi;

