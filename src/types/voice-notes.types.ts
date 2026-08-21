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

/**
 * API record from `GET /voicerecord/organization/:organizationId`.
 * Includes the recording user object attached by the backend.
 */
export type OrgVoiceRecordApiItem = {
  _id: string
  userId: string
  fileKey: string
  createdAt: string
  updatedAt: string
  __v?: number
  url?: string
  /** User object attached by the org endpoint */
  user?: {
    _id: string
    firstName?: string
    lastName?: string
    email?: string
  }
}

/** Row model for the voice-notes table — only real API fields + resolved playback URL. */
export type VoiceNoteListItem = {
  id: string
  userId: string
  /** Full name from the attached user object (org endpoint only) */
  userName?: string
  fileKey: string
  recordedAt: string
  /** Set after `GET /voicerecord/signed-url/:id` (or if list already returned `url`). */
  audioUrl?: string
}

export function mapVoiceRecordToListItem(
  record: VoiceRecordApiItem | OrgVoiceRecordApiItem,
): VoiceNoteListItem {
  const orgRecord = record as OrgVoiceRecordApiItem
  const userName = orgRecord.user
    ? [orgRecord.user.firstName, orgRecord.user.lastName].filter(Boolean).join(" ") || orgRecord.user.email
    : undefined
  return {
    id: record._id,
    userId: record.userId,
    userName,
    fileKey: record.fileKey,
    recordedAt: record.createdAt,
    audioUrl: record.url || undefined,
  }
}

/** Extract a playable URL from the signed-url endpoint response. */
export function extractSignedUrl(response: unknown): string | undefined {
  console.debug("[VoiceNotes] signed-url raw response:", response)

  if (!response) return undefined

  // Direct string
  if (typeof response === "string" && response.trim()) return response.trim()

  if (typeof response !== "object") return undefined

  const obj = response as Record<string, unknown>

  // Common key names the backend might use
  const candidates = [
    obj.url,
    obj.signedUrl,
    obj.signed_url,
    obj.signedURL,
    obj.data,
    obj.link,
    obj.audioUrl,
    obj.fileUrl,
  ]

  for (const value of candidates) {
    if (typeof value === "string" && value.trim()) return value.trim()
    if (value && typeof value === "object") {
      const nested = value as Record<string, unknown>
      for (const key of ["url", "signedUrl", "signed_url", "signedURL", "link", "audioUrl"] as const) {
        if (typeof nested[key] === "string" && (nested[key] as string).trim()) {
          return (nested[key] as string).trim()
        }
      }
    }
  }

  // Last resort: look through all string values in the object
  for (const value of Object.values(obj)) {
    if (typeof value === "string" && value.startsWith("http") && value.includes("s3")) {
      return value.trim()
    }
  }

  console.warn("[VoiceNotes] Could not extract URL from signed-url response:", response)
  return undefined
}

/** Last path segment of an S3/file key for display (no invented labels). */
export function fileKeyLabel(fileKey: string): string {
  if (!fileKey) return ""
  const parts = fileKey.split("/")
  return parts[parts.length - 1] || fileKey
}
