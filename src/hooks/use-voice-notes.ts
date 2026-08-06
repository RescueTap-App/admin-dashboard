"use client"

import {
  useGetVoiceNotesByUserQuery,
  useLazyGetVoiceNoteSignedUrlQuery,
} from "@/redux/features/voice-notes-api"
import {
  extractSignedUrl,
  mapVoiceRecordToListItem,
  type VoiceNoteListItem,
} from "@/types/voice-notes.types"
import { useEffect, useMemo, useState } from "react"

type UseVoiceNotesOptions = {
  /** Logged-in user / organisation id for `GET /voicerecord/user/:userId`. */
  userId?: string
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

  const [fetchSignedUrl] = useLazyGetVoiceNoteSignedUrlQuery()
  const [urlById, setUrlById] = useState<Record<string, string>>({})
  const [resolvingUrls, setResolvingUrls] = useState(false)

  const baseNotes: VoiceNoteListItem[] = useMemo(() => {
    if (!raw?.length) return []
    return [...raw]
      .map(mapVoiceRecordToListItem)
      .sort(
        (a, b) =>
          new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime(),
      )
  }, [raw])

  // List items only have fileKey — resolve playable URLs via signed-url endpoint.
  useEffect(() => {
    let cancelled = false

    const resolve = async () => {
      const needsUrl = baseNotes.filter((n) => !n.audioUrl && !urlById[n.id])
      if (!needsUrl.length) return

      setResolvingUrls(true)
      try {
        const results = await Promise.all(
          needsUrl.map(async (note) => {
            try {
              const response = await fetchSignedUrl(note.id).unwrap()
              const url = extractSignedUrl(response)
              return url ? ([note.id, url] as const) : null
            } catch {
              return null
            }
          }),
        )

        if (cancelled) return

        setUrlById((prev) => {
          const next = { ...prev }
          for (const pair of results) {
            if (pair) next[pair[0]] = pair[1]
          }
          return next
        })
      } finally {
        if (!cancelled) setResolvingUrls(false)
      }
    }

    void resolve()
    return () => {
      cancelled = true
    }
    // urlById intentionally omitted: we only resolve ids not already cached.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseNotes, fetchSignedUrl])

  const voiceNotes: VoiceNoteListItem[] = useMemo(
    () =>
      baseNotes.map((note) => ({
        ...note,
        audioUrl: note.audioUrl || urlById[note.id],
      })),
    [baseNotes, urlById],
  )

  return {
    voiceNotes,
    isLoading,
    isFetching: isFetching || resolvingUrls,
    isError,
    error,
    refetch,
  }
}
