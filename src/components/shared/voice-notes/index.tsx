"use client"

import { Card, CardHeader } from "@/components/ui/card"
import { Suspense } from "react"
import { VoiceNotesTable } from "./table"
import type { VoiceNoteListItem } from "@/types/voice-notes.types"

type VoiceNotesListProps = {
  /** Optional subtitle override for org vs super-admin copy */
  description?: string
  /** Future: pass API rows here. Defaults to empty until endpoints exist. */
  data?: VoiceNoteListItem[]
}

export default function VoiceNotesList({
  description = "Voice recordings from emergencies and alerts. Playback will appear here once connected to the API.",
  data = [],
}: VoiceNotesListProps) {
  return (
    <Card className="rounded-sm px-3 min-w-full shadow">
      <CardHeader className="flex flex-row justify-between px-0">
        <div>
          <h1 className="font-semibold text-xl">Voice Notes</h1>
          <p className="text-sm pt-2">{description}</p>
        </div>
      </CardHeader>
      <div className="overflow-x-auto md:max-w-md min-w-full">
        <Suspense>
          <VoiceNotesTable data={data} />
        </Suspense>
      </div>
    </Card>
  )
}
