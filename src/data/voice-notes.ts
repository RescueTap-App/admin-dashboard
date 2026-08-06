import type { VoiceNoteListItem } from "@/types/voice-notes.types"

/**
 * Temporary super-admin records.
 *
 * Add more objects to this array while the voice-notes API is unavailable.
 * Replace this import at the page level when server data is ready.
 */
export const dummyVoiceNotes: VoiceNoteListItem[] = [
  {
    id: "voice-note-demo-1",
    userName: "Demo User",
    recordedAt: "2026-07-30T09:35:00.000Z",
    durationLabel: "0:02",
    relatedTo: "Emergency #RT-1042",
    status: "available",
    audioUrl:
      "https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3",
  },
]
