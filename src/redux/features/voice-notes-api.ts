import { createApi } from "@reduxjs/toolkit/query/react"
import { customBaseQueryWithReauth } from "@/lib/custom-base-query"
import type { VoiceRecordApiItem } from "@/types/voice-notes.types"

/**
 * Voice-record endpoints used by the mobile app and admin/org dashboards.
 *
 * List is scoped to the **logged-in** user/organisation id
 * (`GET /voicerecord/user/:userId`), not other dashboard member ids.
 */
export const voiceNotesApi = createApi({
  reducerPath: "voiceNotesApi",
  baseQuery: customBaseQueryWithReauth,
  tagTypes: ["VoiceNotes"],
  endpoints: (builder) => ({
    /** Voice notes for the logged-in user / organisation admin. */
    getVoiceNotesByUser: builder.query<VoiceRecordApiItem[], string>({
      query: (userId: string) => `/voicerecord/user/${userId}`,
      transformResponse: (response: unknown): VoiceRecordApiItem[] => {
        if (Array.isArray(response)) return response as VoiceRecordApiItem[]
        // Some backends wrap the list
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
    /** Signed playback URL when the list row does not already include `url`. */
    getVoiceNoteSignedUrl: builder.query<{ url?: string; signedUrl?: string }, string>({
      query: (id: string) => `/voicerecord/signed-url/${id}`,
    }),
  }),
})

export const {
  useGetVoiceNotesByUserQuery,
  useLazyGetVoiceNoteSignedUrlQuery,
} = voiceNotesApi
