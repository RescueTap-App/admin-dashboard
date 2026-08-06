"use client"

import SearchInput from "@/components/shared/search-input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { VoiceNoteListItem } from "@/types/voice-notes.types"
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
      [row.userName, row.relatedTo, row.status, row.durationLabel]
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
              <TableHead className="font-nunito">User</TableHead>
              <TableHead className="font-nunito">Recorded At</TableHead>
              <TableHead className="font-nunito">Duration</TableHead>
              <TableHead className="font-nunito">Related To</TableHead>
              <TableHead className="font-nunito">Status</TableHead>
              <TableHead className="font-nunito">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length ? (
              filtered.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <p className="text-muted-foreground px-1.5 font-lato">
                      {row.userName}
                    </p>
                  </TableCell>
                  <TableCell>
                    <p className="text-muted-foreground px-1.5 font-lato">
                      {format(new Date(row.recordedAt), "MMM d, yyyy hh:mm a")}
                    </p>
                  </TableCell>
                  <TableCell>
                    <p className="text-muted-foreground px-1.5 font-lato">
                      {row.durationLabel}
                    </p>
                  </TableCell>
                  <TableCell>
                    <p className="text-muted-foreground px-1.5 font-lato">
                      {row.relatedTo}
                    </p>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-muted-foreground px-1.5 capitalize">
                      {row.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <audio
                      controls
                      preload="metadata"
                      src={row.audioUrl}
                      aria-label={`Play voice note from ${row.userName}`}
                      className="h-9 w-64 max-w-full"
                    >
                      Your browser does not support audio playback.
                    </audio>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
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
