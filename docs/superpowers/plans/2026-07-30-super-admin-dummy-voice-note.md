# Super-Admin Dummy Voice Note Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Show manually editable dummy voice-note records with working remote audio playback on the super-admin page only.

**Architecture:** A typed data module exports dummy rows whose `audioUrl` shape can later be returned by the server. The super-admin route passes those rows into the existing shared list; the org-admin route continues using the empty default. Native HTML audio controls provide play, pause, seek, volume, and duration without custom playback state.

**Tech Stack:** Next.js 15, React 19, TypeScript, native HTML audio.

## Global Constraints

- Dummy records appear only on `/dashboard/voice-notes`.
- Audio sources are remote URLs.
- `src/data/voice-notes.ts` remains a plain array that developers can edit manually.
- Do not add a playback dependency.
- Do not commit changes unless the user explicitly requests a commit.

---

### Task 1: Define and verify the dummy-data contract

**Files:**
- Create: `scripts/verify-voice-notes-dummy.mjs`
- Create: `src/data/voice-notes.ts`
- Modify: `src/types/voice-notes.types.ts`

**Interfaces:**
- Produces: `VoiceNoteListItem.audioUrl: string`
- Produces: `dummyVoiceNotes: VoiceNoteListItem[]`

- [ ] **Step 1: Write the failing verification**

Create a Node verification script that asserts:
- the type contains `audioUrl: string`
- the data file exports `dummyVoiceNotes`
- at least one dummy row contains an HTTPS `audioUrl`
- only the super-admin page imports `dummyVoiceNotes`

- [ ] **Step 2: Run verification and confirm RED**

Run: `node scripts/verify-voice-notes-dummy.mjs`

Expected: FAIL because `src/data/voice-notes.ts` and `audioUrl` do not exist.

- [ ] **Step 3: Implement the typed data**

Add `audioUrl: string` to `VoiceNoteListItem`. Export a typed array from `src/data/voice-notes.ts` with one available row and a stable public HTTPS MP3 URL.

- [ ] **Step 4: Re-run verification**

Run: `node scripts/verify-voice-notes-dummy.mjs`

Expected: it still fails because the super-admin page and audio UI are not wired yet.

### Task 2: Wire native playback into the shared table

**Files:**
- Modify: `src/app/(admin-dashboard)/dashboard/voice-notes/page.tsx`
- Verify unchanged data behavior: `src/app/(organization)/org/voice-notes/page.tsx`
- Modify: `src/components/shared/voice-notes/table.tsx`

**Interfaces:**
- Consumes: `dummyVoiceNotes: VoiceNoteListItem[]`
- Consumes: `VoiceNoteListItem.audioUrl`
- Produces: an `<audio controls preload="metadata">` player for available rows

- [ ] **Step 1: Pass dummy data from the super-admin page**

Import `dummyVoiceNotes` and render `<VoiceNotesList data={dummyVoiceNotes} ... />`. Leave the org page without a `data` prop.

- [ ] **Step 2: Replace the disabled action**

Render native audio controls using `row.audioUrl`, an accessible label, and `preload="metadata"`.

- [ ] **Step 3: Verify GREEN**

Run: `node scripts/verify-voice-notes-dummy.mjs`

Expected: `verify-voice-notes-dummy: ok`.

- [ ] **Step 4: Run static checks**

Run: `npx tsc --noEmit`

Expected: exit code 0. Check edited files with IDE diagnostics and resolve newly introduced errors.
