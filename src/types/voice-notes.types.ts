export type VoiceNoteListItem = {
  id: string
  userName: string
  recordedAt: string
  durationLabel: string
  relatedTo: string
  status: "available" | "processing" | "unavailable"
  audioUrl: string
}
