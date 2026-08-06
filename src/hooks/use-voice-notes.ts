"use client"

import { useGetVoiceNotesByUserQuery } from "@/redux/features/voice-notes-api"
import {
  mapVoiceRecordToListItem,
  type VoiceNoteListItem,
} from "@/types/voice-notes.types"
import { useMemo } from "react"

type UseVoiceNotesOptions = {
  /**
   * Logged-in user / organisation id used by `GET /voicerecord/user/:userId`.
   * Do not pass other dashboard member ids.
   */
  userId?: string
  /** When false, the query is skipped (e.g. super-admin dummy data path). */
  enabled?: boolean
}

export default function useVoiceNotes({
  userId,
  enabled = true,
}: UseVoiceNotesOptions = {}) {
  const {
    data: raw,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetVoiceNotesByUserQuery(userId!, {
    skip: !enabled || !userId,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,
  })

  const voiceNotes: VoiceNoteListItem[] = useMemo(() => {
    if (!raw?.length) return []
    return [...raw]
      .map(mapVoiceRecordToListItem)
      .sort(
        (a, b) =>
          new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime(),
      )
  }, [raw])

  return {
    voiceNotes,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  }
}
