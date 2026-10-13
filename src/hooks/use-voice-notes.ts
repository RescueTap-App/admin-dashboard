"use client"

import {
  useGetVoiceNotesByUserQuery,
  useGetVoiceNotesByOrganizationQuery,
  useLazyGetVoiceNoteSignedUrlQuery,
} from "@/redux/features/voice-notes-api"
import {
  extractSignedUrl,
  mapVoiceRecordToListItem,
  type VoiceNoteListItem,
} from "@/types/voice-notes.types"
import { useEffect, useMemo, useState } from "react"

type UseVoiceNotesOptions = {
  /** Pass userId to fetch a single user's notes via `GET /voicerecord/user/:userId`. */
  userId?: string
  /** Pass organizationId to fetch ALL org notes via `GET /voicerecord/organization/:organizationId`. */
  organizationId?: string
  /** Optionally filter by a specific user when using the org endpoint. */
  filterUserId?: string
  enabled?: boolean
}

export default function useVoiceNotes({
  userId,
  organizationId,
  filterUserId,
  enabled = true,
}: UseVoiceNotesOptions = {}) {
  // Org-wide endpoint (preferred when organizationId is provided)
  const {
    data: orgRaw,
    isLoading: orgLoading,
    isFetching: orgFetching,
    isError: orgError,
    refetch: orgRefetch,
  } = useGetVoiceNotesByOrganizationQuery(
    { organizationId: organizationId!, userId: filterUserId },
    { skip: !enabled || !organizationId, refetchOnFocus: true, refetchOnMountOrArgChange: true, refetchOnReconnect: true },
  )

  // Fallback: single-user endpoint
  const {
    data: userRaw,
    isLoading: userLoading,
    isFetching: userFetching,
    isError: userError,
    refetch: userRefetch,
  } = useGetVoiceNotesByUserQuery(userId!, {
    skip: !enabled || !userId || !!organizationId,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,
  })

  const raw = organizationId ? orgRaw : userRaw
  const isLoading = organizationId ? orgLoading : userLoading
  const isFetching = organizationId ? orgFetching : userFetching
  const isError = organizationId ? orgError : userError
  const refetch = organizationId ? orgRefetch : userRefetch

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

  // Resolve playable URLs via signed-url endpoint.
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
    refetch,
  }
}
