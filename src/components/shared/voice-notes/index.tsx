"use client"

import { Card, CardHeader } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import useVoiceNotes from "@/hooks/use-voice-notes"
import { RootState } from "@/lib/store"
import { Suspense } from "react"
import { useSelector } from "react-redux"
import { VoiceNotesTable } from "./table"

type VoiceNotesListProps = {
  /** Optional subtitle override for org vs super-admin copy */
  description?: string
}

export default function VoiceNotesList({
  description = "Voice recordings from emergencies and alerts for your account.",
}: VoiceNotesListProps) {
  const { user } = useSelector((state: RootState) => state.auth)
  // Always the logged-in session id — never other dashboard member ids.
  const loggedInUserId = user?._id

  const { voiceNotes, isLoading, isError } = useVoiceNotes({
    userId: loggedInUserId,
    enabled: Boolean(loggedInUserId),
  })

  return (
    <Card className="rounded-sm px-3 min-w-full shadow">
      <CardHeader className="flex flex-row justify-between px-0">
        <div>
          <h1 className="font-semibold text-xl">Voice Notes</h1>
          <p className="text-sm pt-2">{description}</p>
        </div>
      </CardHeader>
      <div className="overflow-x-auto md:max-w-md min-w-full">
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground">
            <Spinner className="size-5" />
            <span className="text-sm">Loading voice notes…</span>
          </div>
        ) : isError ? (
          <div className="py-16 text-center text-sm text-muted-foreground">
            Could not load voice notes. Please try again later.
          </div>
        ) : (
          <Suspense>
            <VoiceNotesTable data={voiceNotes} />
          </Suspense>
        )}
      </div>
    </Card>
  )
}
