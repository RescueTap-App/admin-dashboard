import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQueryWithReauth } from '@/lib/custom-base-query';
import { VisitorDataTypes, VisitorsLogResponse } from '@/types/visitors.types';

export const visitorsApi = createApi({
    reducerPath: 'visitorsApi',
    tagTypes: ['Visitors'],
    baseQuery: customBaseQueryWithReauth,
    endpoints: (builder) => ({
        getOrgVisitors: builder.query<VisitorsLogResponse, { orgId: string, page: number, limit: number }>({
            query: ({ orgId, limit, page }) => `/visitors/organization/${orgId}/visitors?limit=${limit}&page=${page}`,
            providesTags: (_result, _error, { orgId }) => [
                { type: 'Visitors', id: orgId },
            ],
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
            invalidatesTags: (_result, _error, { tenantId }) => [
                { type: 'Visitors', id: tenantId },
            ],
        }),
        verifyCode: builder.mutation({
            query: ({ data }: { data: { code: string, tenantId: string } }) => ({
                url: `/visitors/verify/${data.code}`,
                method: 'POST',
                body: { 'tenantId': data.tenantId },
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
    useLazyGetOrgVisitorsQuery,
    useGetAllVisitorsQuery,
    useGetTenantVisitorsQuery,
    useInviteVisitorMutation,
    useVerifyCodeMutation,
    useUpdateVisitorMutation,
    useCancelVisitorMutation,
    useCheckOutVisitorMutation,
} = visitorsApi;

