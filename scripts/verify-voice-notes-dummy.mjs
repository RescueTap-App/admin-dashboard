import assert from "node:assert/strict"
import { readFileSync } from "node:fs"

const readSource = (path) => {
  try {
    return readFileSync(path, "utf8")
  } catch {
    return ""
  }
}

const typeSource = readSource("src/types/voice-notes.types.ts")
const apiSource = readSource("src/redux/features/voice-notes-api.ts")
const hookSource = readSource("src/hooks/use-voice-notes.ts")
const listSource = readSource("src/components/shared/voice-notes/index.tsx")
const adminPageSource = readSource(
  "src/app/(admin-dashboard)/dashboard/voice-notes/page.tsx",
)
const orgPageSource = readSource(
  "src/app/(organization)/org/voice-notes/page.tsx",
)
const tableSource = readSource(
  "src/components/shared/voice-notes/table.tsx",
)

assert.match(typeSource, /fileKey:\s*string/)
assert.match(typeSource, /userId:\s*string/)
assert.doesNotMatch(typeSource, /Unknown user/)
assert.doesNotMatch(typeSource, /Emergency recording/)
assert.match(apiSource, /\/voicerecord\/user\/\$\{userId\}/)
assert.match(apiSource, /\/voicerecord\/signed-url\/\$\{id\}/)
assert.match(hookSource, /fetchSignedUrl|getVoiceNoteSignedUrl|signed-url/)
assert.match(listSource, /useVoiceNotes/)
assert.match(listSource, /loggedInUserId/)
assert.doesNotMatch(adminPageSource, /dummyVoiceNotes/)
assert.doesNotMatch(orgPageSource, /dummyVoiceNotes/)
assert.match(tableSource, /<audio/)
assert.match(tableSource, /controls/)
assert.match(tableSource, /preload="metadata"/)
assert.match(tableSource, /src=\{row\.audioUrl\}/)

console.log("verify-voice-notes-dummy: ok")
