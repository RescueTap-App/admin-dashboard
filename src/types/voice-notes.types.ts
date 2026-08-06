/**
 * API record from `GET /voicerecord/user/:userId`.
 * Matches the live backend payload — do not invent missing fields.
 */
export type VoiceRecordApiItem = {
  _id: string
  userId: string
  fileKey: string
  createdAt: string
  updatedAt: string
  __v?: number
  /** Present only if the backend includes a playable URL on the list response. */
  url?: string
}

/** Row model for the voice-notes table — only real API fields + resolved playback URL. */
export type VoiceNoteListItem = {
  id: string
  userId: string
  fileKey: string
  recordedAt: string
  /** Set after `GET /voicerecord/signed-url/:id` (or if list already returned `url`). */
  audioUrl?: string
}

export function mapVoiceRecordToListItem(
  record: VoiceRecordApiItem,
): VoiceNoteListItem {
  return {
    id: record._id,
    userId: record.userId,
    fileKey: record.fileKey,
    recordedAt: record.createdAt,
    audioUrl: record.url || undefined,
  }
}

/** Extract a playable URL from the signed-url endpoint response. */
export function extractSignedUrl(response: unknown): string | undefined {
  if (!response) return undefined
  if (typeof response === "string" && response.trim()) return response.trim()
  if (typeof response !== "object") return undefined

  const obj = response as Record<string, unknown>
  const candidates = [obj.url, obj.signedUrl, obj.signed_url, obj.data]

  for (const value of candidates) {
    if (typeof value === "string" && value.trim()) return value.trim()
    if (value && typeof value === "object") {
      const nested = value as Record<string, unknown>
      for (const key of ["url", "signedUrl", "signed_url"] as const) {
        if (typeof nested[key] === "string" && nested[key].trim()) {
          return (nested[key] as string).trim()
        }
      }
    }
  }

  return undefined
}

/** Last path segment of an S3/file key for display (no invented labels). */
export function fileKeyLabel(fileKey: string): string {
  if (!fileKey) return ""
  const parts = fileKey.split("/")
  return parts[parts.length - 1] || fileKey
}
