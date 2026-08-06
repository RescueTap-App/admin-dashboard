"use client"

import { Card, CardHeader } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import useVoiceNotes from "@/hooks/use-voice-notes"
import { RootState } from "@/lib/store"
import type { VoiceNoteListItem } from "@/types/voice-notes.types"
import { Suspense } from "react"
import { useSelector } from "react-redux"
import { VoiceNotesTable } from "./table"

type VoiceNotesListProps = {
  /** Optional subtitle override for org vs super-admin copy */
  description?: string
  /**
   * Optional static rows (e.g. super-admin dummy data).
   * When omitted, the list loads from `GET /voicerecord/user/:userId`
   * using the **logged-in** user/organisation id from auth state.
   */
  data?: VoiceNoteListItem[]
  /**
   * When true (default if `data` is not provided), fetch live voice notes
   * for the authenticated user/org.
   */
  fetchFromApi?: boolean
}

export default function VoiceNotesList({
  description = "Voice recordings from emergencies and alerts for your account.",
  data,
  fetchFromApi,
}: VoiceNotesListProps) {
  const { user } = useSelector((state: RootState) => state.auth)
  // Org/user-scoped list: always the logged-in session id, never other dashboard users.
  const loggedInUserId = user?._id
  const shouldFetch = fetchFromApi ?? data === undefined

  const { voiceNotes, isLoading, isError } = useVoiceNotes({
    userId: loggedInUserId,
    enabled: shouldFetch && Boolean(loggedInUserId),
  })

  const rows = shouldFetch ? voiceNotes : (data ?? [])
  const showLoading = shouldFetch && isLoading

  return (
    <Card className="rounded-sm px-3 min-w-full shadow">
      <CardHeader className="flex flex-row justify-between px-0">
        <div>
          <h1 className="font-semibold text-xl">Voice Notes</h1>
          <p className="text-sm pt-2">{description}</p>
        </div>
      </CardHeader>
      <div className="overflow-x-auto md:max-w-md min-w-full">
        {showLoading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground">
            <Spinner className="size-5" />
            <span className="text-sm">Loading voice notes…</span>
          </div>
        ) : isError && shouldFetch ? (
          <div className="py-16 text-center text-sm text-muted-foreground">
            Could not load voice notes. Please try again later.
          </div>
        ) : (
          <Suspense>
            <VoiceNotesTable data={rows} />
          </Suspense>
        )}
      </div>
    </Card>
  )
}
