import VoiceNotesList from "@/components/shared/voice-notes"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Rescue Tap | Voice Notes",
  description:
    "Rescue Tap instantly let's you share your location send emergency alerts and stay connected with the people who matter most, because safety starts with awareness",
}

export default function Page() {
  return (
    <VoiceNotesList description="Voice recordings from emergencies and alerts across the platform." />
  )
}
