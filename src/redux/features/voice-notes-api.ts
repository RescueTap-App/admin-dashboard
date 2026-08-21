import { createApi } from "@reduxjs/toolkit/query/react"
import { customBaseQueryWithReauth } from "@/lib/custom-base-query"
import type { VoiceRecordApiItem, OrgVoiceRecordApiItem } from "@/types/voice-notes.types"

/**
 * Voice-record endpoints.
 *
 * List by user: `GET /voicerecord/user/:userId`
 * List by org:  `GET /voicerecord/organization/:organizationId` (with user attached)
 * Play: `GET /voicerecord/signed-url/:id`
 */
export const voiceNotesApi = createApi({
  reducerPath: "voiceNotesApi",
  baseQuery: customBaseQueryWithReauth,
  tagTypes: ["VoiceNotes"],
  endpoints: (builder) => ({
    getVoiceNotesByUser: builder.query<VoiceRecordApiItem[], string>({
      query: (userId: string) => `/voicerecord/user/${userId}`,
      transformResponse: (response: unknown): VoiceRecordApiItem[] => {
        if (Array.isArray(response)) return response as VoiceRecordApiItem[]
        if (
          response &&
          typeof response === "object" &&
          Array.isArray((response as { data?: unknown }).data)
        ) {
          return (response as { data: VoiceRecordApiItem[] }).data
        }
        return []
      },
      providesTags: ["VoiceNotes"],
    }),
    getVoiceNotesByOrganization: builder.query<OrgVoiceRecordApiItem[], { organizationId: string; userId?: string }>({
      query: ({ organizationId, userId }) => {
        const params = userId ? `?userId=${userId}` : ""
        return `/voicerecord/organization/${organizationId}${params}`
      },
      transformResponse: (response: unknown): OrgVoiceRecordApiItem[] => {
        if (Array.isArray(response)) return response as OrgVoiceRecordApiItem[]
        if (
          response &&
          typeof response === "object" &&
          Array.isArray((response as { data?: unknown }).data)
        ) {
          return (response as { data: OrgVoiceRecordApiItem[] }).data
        }
        return []
      },
      providesTags: ["VoiceNotes"],
    }),
    getVoiceNoteSignedUrl: builder.query<unknown, string>({
      query: (id: string) => `/voicerecord/signed-url/${id}`,
    }),
  }),
})

export const {
  useGetVoiceNotesByUserQuery,
  useGetVoiceNotesByOrganizationQuery,
  useLazyGetVoiceNoteSignedUrlQuery,
} = voiceNotesApi
