"use client"

import VoiceNotesList from "@/components/shared/voice-notes"
import { RootState } from "@/lib/store"
import { useSelector } from "react-redux"

export default function Page() {
  const { user } = useSelector((state: RootState) => state.auth)
  const organizationId = user?._id

  return (
    <VoiceNotesList
      description="Voice recordings linked to your organization's emergencies and alerts."
      organizationId={organizationId}
    />
  )
}
