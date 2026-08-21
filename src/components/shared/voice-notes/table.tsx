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
import {
  IconDownload,
  // IconPlay,
  IconCheck,
  IconClockPlay,
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type VoiceNotesTableProps = {
  data: VoiceNoteListItem[]
}

export function VoiceNotesTable({ data }: VoiceNotesTableProps) {
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<"all" | "new" | "listened">("all")
  const [dateRange, setDateRange] = React.useState<"all" | "today" | "week" | "month">("all")
  const [notes, setNotes] = React.useState<Record<string, string>>({})
  const [selectedNote, setSelectedNote] = React.useState<VoiceNoteListItem | null>(null)
  const [listeningStatus, setListeningStatus] = React.useState<Record<string, boolean>>({})

  const filtered = React.useMemo(() => {
    let result = data
    const q = globalFilter.trim().toLowerCase()

    // Text search
    if (q) {
      result = result.filter((row) =>
        [row.fileKey, row.userId, row.id, row.recordedAt]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(q),
      )
    }

    // Date range filter
    const now = new Date()
    if (dateRange !== "all") {
      result = result.filter((row) => {
        const recorded = new Date(row.recordedAt)
        switch (dateRange) {
          case "today": {
            const today = new Date()
            today.setHours(0, 0, 0, 0)
            return recorded >= today
          }
          case "week": {
            const weekAgo = new Date(now)
            weekAgo.setDate(weekAgo.getDate() - 7)
            return recorded >= weekAgo
          }
          case "month": {
            const monthAgo = new Date(now)
            monthAgo.setMonth(monthAgo.getMonth() - 1)
            return recorded >= monthAgo
          }
          default:
            return true
        }
      })
    }

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter((row) => {
        const isListened = listeningStatus[row.id] ?? false
        return statusFilter === "listened" ? isListened : !isListened
      })
    }

    return result
  }, [data, globalFilter, statusFilter, dateRange, listeningStatus])

  const statistics = React.useMemo(() => {
    let mostActiveName = "N/A"
    if (data.length > 0) {
      const userCounts: Record<string, { count: number; name: string }> = {}
      let maxCount = 0

      for (const row of data) {
        if (!userCounts[row.userId]) {
          userCounts[row.userId] = { count: 0, name: row.userName || row.userId }
        }
        userCounts[row.userId].count++

        if (userCounts[row.userId].count > maxCount) {
          maxCount = userCounts[row.userId].count
          mostActiveName = userCounts[row.userId].name
        }
      }
    }

    const stats = {
      total: data.length,
      avgDuration: "N/A",
      mostActive: mostActiveName,
      new: data.filter((_, idx) => listeningStatus[data[idx].id] ?? true).length,
    }
    return stats
  }, [data, listeningStatus])

  const handleDownload = (audioUrl: string | undefined, fileName: string) => {
    if (!audioUrl) return
    const link = document.createElement("a")
    link.href = audioUrl
    link.download = fileName || "voice-note.m4a"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <React.Fragment>
      {/* Statistics Section */}
      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-lg border bg-card p-4">
          <p className="text-xs font-medium text-muted-foreground">Total Voice Notes</p>
          <p className="mt-2 text-2xl font-bold">{statistics.total}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-xs font-medium text-muted-foreground">New Notes</p>
          <p className="mt-2 text-2xl font-bold text-blue-600">{statistics.new}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-xs font-medium text-muted-foreground">Avg Duration</p>
          <p className="mt-2 text-2xl font-bold">{statistics.avgDuration}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-xs font-medium text-muted-foreground">Most Active User</p>
          <p className="mt-2 truncate text-sm font-mono">{statistics.mostActive}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <SearchInput
          value={globalFilter}
          placeholder="voice notes"
          onChange={(e) => setGlobalFilter(e.target.value)}
        />
        <Select value={statusFilter} onValueChange={(value: "all" | "new" | "listened") => setStatusFilter(value)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="listened">Listened</SelectItem>
          </SelectContent>
        </Select>
        <Select value={dateRange} onValueChange={(value: "week" | "month" | "all" | "today") => setDateRange(value)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Date range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Dates</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">Last 7 Days</SelectItem>
            <SelectItem value="month">Last Month</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="overflow-hidden border">
        <Table>
          <TableHeader className="bg-muted sticky top-0 z-10">
            <TableRow>
              <TableHead className="font-nunito">File</TableHead>
              <TableHead className="font-nunito">Recorded By</TableHead>
              <TableHead className="font-nunito">Recorded At</TableHead>
              <TableHead className="font-nunito">Status</TableHead>
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
                const isListened = listeningStatus[row.id] ?? false

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
                        {row.userName || row.userId}
                      </p>
                    </TableCell>
                    <TableCell>
                      <p className="text-muted-foreground px-1.5 font-lato">
                        {recordedLabel}
                      </p>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={isListened ? "secondary" : "default"}
                        className={isListened ? "" : "bg-blue-600"}
                      >
                        {isListened ? "Listened" : "New"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {row.audioUrl ? (
                          <audio
                            controls
                            preload="metadata"
                            src={row.audioUrl}
                            aria-label={`Play voice note ${row.id}`}
                            className="h-8 w-44 shrink-0"
                            style={{ maxWidth: "176px" }}
                            onPlay={() =>
                              setListeningStatus((prev) => ({
                                ...prev,
                                [row.id]: true,
                              }))
                            }
                          />
                        ) : (
                          <span className="text-xs text-muted-foreground italic w-44 shrink-0 inline-block">Loading audio…</span>
                        )}

                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8"
                            onClick={() =>
                              handleDownload(row.audioUrl, fileKeyLabel(row.fileKey))
                            }
                            disabled={!row.audioUrl}
                            title="Download audio"
                          >
                            <IconDownload className="size-4" />
                          </Button>

                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="size-8"
                                onClick={() => setSelectedNote(row)}
                                title="Add notes"
                              >
                                <IconCheck className="size-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Add Notes to Voice Record</DialogTitle>
                                <DialogDescription>
                                  Add internal notes for case reference or follow-up.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <p className="text-sm font-medium text-muted-foreground">
                                    Record ID: <span className="font-mono">{row.id}</span>
                                  </p>
                                </div>
                                <Textarea
                                  placeholder="e.g., Relevant to case #123, Follow-up needed..."
                                  value={notes[row.id] || ""}
                                  onChange={(e) =>
                                    setNotes((prev) => ({
                                      ...prev,
                                      [row.id]: e.target.value,
                                    }))
                                  }
                                  className="h-24"
                                />
                                <Button
                                  className="w-full bg-[#EF4136] hover:bg-[#EF4136]/80"
                                  onClick={() => {
                                    // In a real app, this would save to the backend
                                    console.log(
                                      `Saved note for ${row.id}:`,
                                      notes[row.id],
                                    )
                                  }}
                                >
                                  Save Notes
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No voice notes found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </React.Fragment>
  )
}
