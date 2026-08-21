import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQueryWithReauth } from '@/lib/custom-base-query';

export type SlotRequest = {
    _id: string;
    organizationId: {
        _id: string;
        organizationName: string;
    } | string;
    additionalUserSlots: number;
    additionalDriverSlots: number;
    requesterName: string;
    urgency: "low" | "medium" | "high" | "urgent";
    justification: string;
    status: "pending" | "approved" | "rejected";
    createdAt: string;
    updatedAt: string;
}

export const slotRequestsApi = createApi({
    reducerPath: 'slotRequestsApi',
    baseQuery: customBaseQueryWithReauth,
    tagTypes: ['SlotRequests'],
    endpoints: (builder) => ({
        getAllSlotRequests: builder.query<SlotRequest[], { status?: string } | void>({
            query: (params) => {
                if (params && params.status) {
                    return `/slot-requests?status=${params.status}`
                }
                return `/slot-requests`
            },
            providesTags: ['SlotRequests'],
        }),
        reviewSlotRequest: builder.mutation<SlotRequest, { id: string, status: "approved" | "rejected" }>({
            query: ({ id, status }) => ({
                url: `/slot-requests/${id}/status`,
                method: 'PATCH',
                body: { status },
            }),
            invalidatesTags: ['SlotRequests'],
        }),
        createSlotRequest: builder.mutation<SlotRequest, Partial<SlotRequest>>({
            query: (body) => ({
                url: `/slot-requests`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['SlotRequests'],
        }),
    }),
});

export const {
    useGetAllSlotRequestsQuery,
    useReviewSlotRequestMutation,
    useCreateSlotRequestMutation,
} = slotRequestsApi;
