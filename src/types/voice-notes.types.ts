/** Row shape used by the admin/org voice-notes table UI. */
export type VoiceNoteListItem = {
  id: string
  userName: string
  recordedAt: string
  durationLabel: string
  relatedTo: string
  status: "available" | "processing" | "unavailable"
  audioUrl: string
}

/**
 * API record returned by `GET /voicerecord/user/:userId`
 * (and related voicerecord endpoints). Fields mirror the mobile app.
 */
export type VoiceRecordApiItem = {
  _id: string
  fileKey?: string
  createdAt?: string
  updatedAt?: string
  userId?: string
  userName?: string
  date?: string
  time?: string
  duration?: string | number
  url?: string
  fileName?: string
}

function formatDurationLabel(duration: string | number | undefined): string {
  if (duration == null || duration === "") return "—"
  if (typeof duration === "string") {
    // Already formatted (e.g. "0:02" or "00:02")
    if (duration.includes(":")) return duration
    const asNumber = Number(duration)
    if (!Number.isFinite(asNumber)) return duration
    duration = asNumber
  }
  const total = Math.max(0, Math.floor(duration))
  const mins = Math.floor(total / 60)
  const secs = total % 60
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

/** Map a backend voice-record document into the table row model. */
export function mapVoiceRecordToListItem(
  record: VoiceRecordApiItem,
): VoiceNoteListItem {
  const recordedAt = record.createdAt || record.date || ""
  const hasUrl = Boolean(record.url)

  return {
    id: record._id,
    userName: record.userName?.trim() || "Unknown user",
    recordedAt: recordedAt || new Date(0).toISOString(),
    durationLabel: formatDurationLabel(record.duration),
    relatedTo: "Emergency recording",
    status: hasUrl ? "available" : "processing",
    audioUrl: record.url || "",
  }
}
