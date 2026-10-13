# Voice Notes Admin UI — Design

> **Status:** Approved for dummy playback  
> **Date:** 2026-07-30  
> **Surfaces:** Org admin `/org/voice-notes` · Super admin `/dashboard/voice-notes`  
> **Backlog:** 6.1

## Goal

Voice Notes list pages that match existing dashboard Card + table patterns. The super-admin page uses manually editable dummy records with remote audio URLs until backend list/play endpoints exist. The org-admin page remains empty.

## Layout

- Shared list component reused by both dashboards
- Card header: title + subtitle (same tone as Users List / Visitors)
- SearchInput (client filter ready)
- Table columns: User, Recorded At, Duration, Related To, Status, Actions
- Empty: “No voice notes yet”
- Super-admin rows use native HTML audio controls for play, pause, seeking, volume, and duration
- Org-admin remains empty until its API integration is implemented

## Dummy data

- `src/data/voice-notes.ts` exports a typed `VoiceNoteListItem[]`
- Each item includes a remote `audioUrl`, matching the shape expected from the future server
- Developers can manually append records to the array
- Only `/dashboard/voice-notes` imports and passes the dummy array

## Nav

- Org: under Emergencies → Voice Notes
- Super-admin: new “Emergencies” group (or Media) with Voice Notes — use Emergencies-style group with Mic/Alert icon for consistency

## Out of scope

- Upload, S3 integration, server fetching, and `sendVoiceNotesEmail` settings UI
