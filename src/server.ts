/**
 * Cloudflare Workers entry. Wraps TanStack Start so the existing Grok PWA
 * middleware (manifest, ?install=1 tutorial, OG / extensions.js head tags)
 * still runs after Nitro is removed. That middleware used to be auto-registered
 * via `nitro({ serverDir: "./server" })`.
 *
 * Bindings/secrets are copied onto process.env so the existing env() helpers
 * and DATABASE_URL checks keep working without rewriting every call site.
 */
import start, { createServerEntry } from "@tanstack/react-start/server-entry";
import grokPwaMiddleware from "../server/middleware/grok-pwa";

type WorkerEnv = Record<string, unknown>;

function applyBindings(workerEnv: WorkerEnv | undefined) {
  if (!workerEnv || typeof process === "undefined") return;
  for (const [key, value] of Object.entries(workerEnv)) {
    if (typeof value !== "string") continue;
    if (!process.env[key]) process.env[key] = value;
  }
}

export default createServerEntry({
  async fetch(request, ...rest) {
    const maybeEnv = rest[0];
    if (maybeEnv && typeof maybeEnv === "object") {
      applyBindings(maybeEnv as WorkerEnv);
    }

    const url = new URL(request.url);
    const result = await grokPwaMiddleware(
      { url, req: { method: request.method, headers: request.headers } },
      () => start.fetch(request, ...rest),
    );
    return result as Response;
  },
});
