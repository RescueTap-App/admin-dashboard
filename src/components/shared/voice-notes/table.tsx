"use client"

import SearchInput from "@/components/shared/search-input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  fileKeyLabel,
  type VoiceNoteListItem,
} from "@/types/voice-notes.types"
import { format } from "date-fns"
import * as React from "react"

type VoiceNotesTableProps = {
  data: VoiceNoteListItem[]
}

export function VoiceNotesTable({ data }: VoiceNotesTableProps) {
  const [globalFilter, setGlobalFilter] = React.useState("")

  const filtered = React.useMemo(() => {
    const q = globalFilter.trim().toLowerCase()
    if (!q) return data
    return data.filter((row) =>
      [row.fileKey, row.userId, row.id, row.recordedAt]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q),
    )
  }, [data, globalFilter])

  return (
    <React.Fragment>
      <div className="mb-4 flex items-center gap-3">
        <SearchInput
          value={globalFilter}
          placeholder="voice notes"
          onChange={(e) => setGlobalFilter(e.target.value)}
        />
      </div>

      <div className="overflow-hidden border">
        <Table>
          <TableHeader className="bg-muted sticky top-0 z-10">
            <TableRow>
              <TableHead className="font-nunito">File</TableHead>
              <TableHead className="font-nunito">User ID</TableHead>
              <TableHead className="font-nunito">Recorded At</TableHead>
              <TableHead className="font-nunito">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length ? (
              filtered.map((row) => {
                const recorded = row.recordedAt
                  ? new Date(row.recordedAt)
                  : null
                const recordedLabel =
                  recorded && !Number.isNaN(recorded.getTime())
                    ? format(recorded, "MMM d, yyyy hh:mm a")
                    : row.recordedAt

                return (
                  <TableRow key={row.id}>
                    <TableCell>
                      <p
                        className="text-muted-foreground max-w-xs truncate px-1.5 font-lato"
                        title={row.fileKey}
                      >
                        {fileKeyLabel(row.fileKey) || row.fileKey}
                      </p>
                    </TableCell>
                    <TableCell>
                      <p className="text-muted-foreground px-1.5 font-mono text-xs font-lato">
                        {row.userId}
                      </p>
                    </TableCell>
                    <TableCell>
                      <p className="text-muted-foreground px-1.5 font-lato">
                        {recordedLabel}
                      </p>
                    </TableCell>
                    <TableCell>
                      {row.audioUrl ? (
                        <audio
                          controls
                          preload="metadata"
                          src={row.audioUrl}
                          aria-label={`Play voice note ${row.id}`}
                          className="h-9 w-64 max-w-full"
                        >
                          Your browser does not support audio playback.
                        </audio>
                      ) : null}
                    </TableCell>
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No voice notes yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </React.Fragment>
  )
}
