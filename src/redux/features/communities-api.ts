import { createApi } from "@reduxjs/toolkit/query/react"
import { customBaseQueryWithReauth } from "@/lib/custom-base-query"

export type Community = {
    _id: string
    name: string
    description?: string
    avatar?: string
    createdBy: string
    members: Array<{ userId: string; role: "admin" | "member" }>
    isActive: boolean
}

export type CreateCommunityInput = Pick<Community, "name" | "description" | "avatar" | "createdBy">

export const communitiesApi = createApi({
    reducerPath: "communitiesApi",
    baseQuery: customBaseQueryWithReauth,
    tagTypes: ["Communities"],
    endpoints: (builder) => ({
        getCommunities: builder.query<Community[], string>({
            query: (userId) => `/communities?userId=${encodeURIComponent(userId)}`,
            providesTags: ["Communities"],
        }),
        createCommunity: builder.mutation<Community, CreateCommunityInput>({
            query: (data) => ({ url: "/communities", method: "POST", body: data }),
            invalidatesTags: ["Communities"],
        }),
    }),
})

export const { useGetCommunitiesQuery, useCreateCommunityMutation } = communitiesApi