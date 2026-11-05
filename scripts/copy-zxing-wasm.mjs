// Self-hosts the QR decoder's WebAssembly file so it is served by the app
// instead of being fetched from the jsDelivr CDN at scan time.
//
// IMPORTANT: barcode-detector bundles its own copy of the zxing-wasm JS glue,
// which may be a different version than the separately installed `zxing-wasm`
// package. The .wasm must match that bundled glue exactly, or decoding crashes
// ("WebAssembly.Table.get(): Argument 0 must be convertible to a valid number").
// So we read the expected version + SHA-256 from barcode-detector itself and
// only ever serve a file with that exact hash.
//
// Output: public/vendor/zxing/<version>/zxing_reader.wasm — versioned, so a
// library upgrade can never pair new glue with an old file (the app requests
// the path for the version it runs, and falls back to the CDN if it's missing).
//
// Runs before `npm run dev` / `npm run build` (predev/prebuild).
import { createHash } from "node:crypto"
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const vendorDir = join(root, "public", "vendor", "zxing")
const log = (msg) => console.log(`[copy-zxing-wasm] ${msg}`)

const sha256 = (buf) => createHash("sha256").update(buf).digest("hex")

const { ZXING_WASM_VERSION: version, ZXING_WASM_SHA256: expectedSha } = await import(
  "barcode-detector/ponyfill"
)

const targetDir = join(vendorDir, version)
const target = join(targetDir, "zxing_reader.wasm")

function removeStaleVersions() {
  if (!existsSync(vendorDir)) return
  for (const entry of readdirSync(vendorDir)) {
    if (entry !== version) rmSync(join(vendorDir, entry), { recursive: true, force: true })
  }
}

async function obtainWasm() {
  // 1. Already in place and correct (the committed copy) → nothing to do.
  if (existsSync(target) && sha256(readFileSync(target)) === expectedSha) return null

  // 2. The installed zxing-wasm package, if it happens to be the same build.
  try {
    const local = join(root, "node_modules", "zxing-wasm", "dist", "reader", "zxing_reader.wasm")
    const buf = readFileSync(local)
    if (sha256(buf) === expectedSha) return buf
  } catch {
    // Not installed / not readable.
  }

  // 3. Download the exact version the library would otherwise load at runtime.
  const url = `https://fastly.jsdelivr.net/npm/zxing-wasm@${version}/dist/reader/zxing_reader.wasm`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`GET ${url} → ${res.status}`)
  const buf = Buffer.from(await res.arrayBuffer())
  const got = sha256(buf)
  if (got !== expectedSha) throw new Error(`SHA-256 mismatch for ${url}: ${got}`)
  return buf
}

try {
  removeStaleVersions()
  const buf = await obtainWasm()
  if (buf) {
    mkdirSync(targetDir, { recursive: true })
    writeFileSync(target, buf)
    log(`wrote zxing-wasm@${version} (sha256 ${expectedSha.slice(0, 12)}…)`)
  } else {
    log(`zxing-wasm@${version} already in place`)
  }
} catch (error) {
  // Never serve a wrong file. Without it, the app falls back to the CDN.
  rmSync(targetDir, { recursive: true, force: true })
  console.warn(
    `[copy-zxing-wasm] Could not self-host zxing-wasm@${version}; the scanner will load it from the CDN.\n  ${error.message}`,
  )
}
