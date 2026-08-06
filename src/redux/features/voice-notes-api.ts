import { createApi } from "@reduxjs/toolkit/query/react"
import { customBaseQueryWithReauth } from "@/lib/custom-base-query"
import type { VoiceRecordApiItem } from "@/types/voice-notes.types"

/**
 * Voice-record endpoints.
 *
 * List: `GET /voicerecord/user/:userId` (logged-in user/org id only)
 * Play: `GET /voicerecord/signed-url/:id` (list payload has fileKey, not url)
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
    getVoiceNoteSignedUrl: builder.query<unknown, string>({
      query: (id: string) => `/voicerecord/signed-url/${id}`,
    }),
  }),
})

export const {
  useGetVoiceNotesByUserQuery,
  useLazyGetVoiceNoteSignedUrlQuery,
} = voiceNotesApi
