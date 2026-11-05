import { prepareZXingModule } from "@yudiel/react-qr-scanner"
import { ZXING_WASM_VERSION } from "barcode-detector/ponyfill"

/**
 * The QR scanner decodes with a ~1 MB WebAssembly module. Left alone, it is
 * downloaded from the jsDelivr CDN on the first scan attempt, so the first
 * scan after every page load waits for that download.
 *
 * `preloadQrDecoder()` downloads and compiles it ahead of time from our own
 * server. `scripts/copy-zxing-wasm.mjs` places the file at a path named after
 * the exact zxing version barcode-detector bundles (the .wasm must match that
 * bundled JS byte-for-byte), so an upgrade can never load a mismatched file:
 * the new version's path simply doesn't exist yet and we fall back to the CDN.
 */
const SELF_HOSTED_WASM = `/vendor/zxing/${ZXING_WASM_VERSION}/zxing_reader.wasm`

let preload: Promise<void> | null = null

export function preloadQrDecoder(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve()
  preload ??= (async () => {
    let selfHosted = false
    try {
      const res = await fetch(SELF_HOSTED_WASM, { method: "HEAD" })
      selfHosted = res.ok
    } catch {
      selfHosted = false
    }

    try {
      if (selfHosted) {
        await prepareZXingModule({
          overrides: {
            locateFile: (path: string, prefix: string) =>
              path.endsWith(".wasm") ? SELF_HOSTED_WASM : prefix + path,
          },
          fireImmediately: true,
        })
      } else {
        // Default overrides → library's CDN location (always the matching version).
        await prepareZXingModule({ fireImmediately: true })
      }
    } catch (error) {
      // Not fatal: the scanner will try to load the decoder again on first use.
      console.warn("QR decoder preload failed:", error)
      preload = null
    }
  })()
  return preload
}
