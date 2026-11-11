# nicsins.com — Cloudflare Workers preview and cutover

Status: **preview only**. Nic approved building the Cloudflare preview on Wednesday, Nov 11, 2026, 10:21 AM CT (America/Chicago). Live DNS, the nicsins.com domain and routes, and the Vercel project must not change until Nic gives a **separate go**.

Nothing in this branch deploys a custom domain. `wrangler.jsonc` has `workers_dev: true` and no `routes`.

---

## What this site actually is

Public GitHub repo: `nicsins/nicsins-com` (TypeScript, Vite, TanStack Start).

It is not a static brochure. The homepage, `/sites` and `/creator-of-all` are server-rendered HTML. Static discovery files live in `public/`. The contact form posts from the browser to FormSubmit (`https://formsubmit.co/ajax/…`) and does not hit our server.

### Server part

- **TanStack Start + Vite.** On Vercel this was the Nitro plugin with `preset: "vercel"`. On Workers the official path is `@cloudflare/vite-plugin` plus Wrangler. Nitro has been removed on this branch.
- **Grok PWA middleware** (`server/middleware/grok-pwa.ts`): serves `/__grok/manifest.webmanifest`, the `/?install=1&platform=ios` install tutorial, and injects OG tags plus `https://grok.com/grok-app-builder/extensions.js` into HTML. Nitro used to auto-register this via `serverDir: "./server"`. The Worker entry `src/server.ts` wraps the TanStack handler so that still happens.
- **No app API routes today.** `/api/auth/*` is 404 HTML on live Vercel (the Better Auth route file was never added). Public pages do not call `getSql()`.
- **Auth / Better Auth** is still in the repo as platform scaffolding (`src/lib/auth/*`). It stays, but the current public site does not use it.

### Migrations / database

- Only file: `migrations/auth/0001_auth.sql` (Better Auth tables). It lives under `migrations/auth/`, so the PGLite auto-apply glob (`migrations/*.sql`) does **not** run it unless someone copies it up when turning sign-in on.
- **Provider:** Neon Postgres when `DATABASE_URL` is set. Local / preview without that URL uses in-memory PGLite (WASM). Build-time `npm run db:migrate` (`scripts/migrate.mjs`) talks to Neon from **Node** with `pg` and skips when `DATABASE_URL` is unset.
- **Workers runtime** cannot open TCP sockets, so `src/lib/db.ts` and `src/lib/auth/server.ts` now use `@neondatabase/serverless` (HTTP / fetch) against the same Neon database. No D1 or KV was added; we do not need them for the current site.
- Migrations are **not** applied inside the Worker. Run `npm run db:migrate` in Node (CI or a laptop) if Neon is in use.

### Vercel-specific pieces (removed or replaced on this branch)

| Piece | What it did | Workers replacement |
|---|---|---|
| `vercel.json` | Only `installCommand`: `npm install --omit=dev --no-audit --no-fund` | Deleted. Workers builds include devDependencies (`wrangler`, the Vite plugin). |
| `nitro` + `preset: "vercel"` in `vite.config.ts` | SSR adapter, auto-registered `server/` middleware | `@cloudflare/vite-plugin` + `src/server.ts` |
| `.vercel/` | Local Vercel output | Ignored; not used |
| `pg` Pool in the server runtime | Neon over TCP | `@neondatabase/serverless` (HTTP). `pg` stays for the Node migrate script. |
| Vercel `Server` / `x-vercel-*` / default cache headers | Hosting chrome | Cloudflare / Workers headers will differ. Behavior of the pages stays the same. |
| Vercel HSTS (`strict-transport-security: max-age=63072000`) | Set on live HTTPS responses | After cutover, set the same on the Cloudflare zone if it is not already inherited. Not set on the workers.dev preview. |

---

## Local preview (no Cloudflare account needed)

```sh
npm install
npm run build
npm run preview          # vite preview → 127.0.0.1:8081, Workers runtime
npm run smoke:cf         # compares 127.0.0.1:8081 to https://nicsins.com
```

Or, after a build:

```sh
npx wrangler dev --port 8081
```

`npm run dev` still binds `0.0.0.0:8080` (the existing preview contract) and now also runs in the Workers runtime.

---

## Deploy command (workers.dev preview only)

Needs a Workers-scoped API token in `CLOUDFLARE_API_TOKEN`. Do **not** run `wrangler login` on the box (OAuth cannot complete here). Do **not** add a custom domain or route.

```sh
export CLOUDFLARE_API_TOKEN=…   # token only, never commit it
npm run deploy                  # npm run build && wrangler deploy
```

That publishes `https://nicsins-com.<account-subdomain>.workers.dev`.

Then smoke the preview (still no DNS change):

```sh
SMOKE_LOCAL_BASE=https://nicsins-com.<account-subdomain>.workers.dev npm run smoke:cf
```

### Token scope for preview

Account permission: **Workers Scripts — Edit**. Do **not** put Zone DNS Edit on this token until the later cutover, so a preview deploy cannot move the domain by accident.

If the account has more than one Cloudflare account id, set `CLOUDFLARE_ACCOUNT_ID` (or add `account_id` in a local, uncommitted wrangler override). It is not in `wrangler.jsonc` on purpose.

---

## Env and secrets Nic must supply

Names only. Never paste values into chat, git, or logs. Copy `.dev.vars.example` to `.dev.vars` for local Wrangler. In production, use `npx wrangler secret put <NAME>` for secrets and `[vars]` / the dashboard for non-secrets.

### Required to deploy the preview

| Name | Where | Notes |
|---|---|---|
| `CLOUDFLARE_API_TOKEN` | Your shell, not the Worker | Workers Scripts Edit. Lets `wrangler deploy` reach the account. |

The **current public site** (pages, robots, sitemap, llms.txt, security.txt, contact form via FormSubmit) needs **no Worker secrets**. It will render on workers.dev without Neon or auth.

### Build-time flags (must be set during `npm run build`, Vite inlines `VITE_*`)

| Name | Needed now? | Notes |
|---|---|---|
| `VITE_AUTH_ENABLED` | Only to match a deliberate auth on/off choice | If set to `"false"`, sign-in stays off (dev-user path). If unset, the client treats auth as on, but `/api/auth/*` is still a 404 unless that route is added. Live Vercel currently 404s `/api/auth/*`. |
| `VITE_PUBLIC_HOSTNAME` | Already set | `wrangler.jsonc` vars already set this to `nicsins.com` so OG image URLs stay canonical on workers.dev and localhost. Override only if you want a different public host. |
| `VITE_STUN_URLS` | No | Only for the unused multiplayer helper. |
| `VITE_GROK_EXTENSIONS` | No | Set to `0` only if you want to strip the Grok extensions script. Live has the script. |
| `VITE_PROJECT_ID` / `VITE_OG_SERVICE_URL` | No | Platform OG / banner helpers. |

### Only if you turn Neon / Better Auth on (not required to match today’s public site)

| Name | Secret? | Notes |
|---|---|---|
| `DATABASE_URL` | Yes | Neon connection string. Worker uses HTTP via `@neondatabase/serverless`. After setting it, run `npm run db:migrate` from Node once. |
| `BETTER_AUTH_SECRET` | Yes | Session signing. |
| `BETTER_AUTH_URL` | No | Public origin, e.g. the workers.dev URL now, later `https://nicsins.com`. |
| `GROK_AUTH_ISSUER` | No | Auth broker origin. |
| `GROK_AUTH_CLIENT_ID` | No | Per-app broker client. |
| `GROK_AUTH_CLIENT_SECRET` | Yes | Per-app broker secret. |
| `GROK_PROJECT_ID` | No | Marks a deployed app vs workspace preview. |
| `GROK_GATE_ORIGIN` | No | Gate identity origin. |
| `GROK_CONNECTORS_URL` | No | Connector data API. |
| `GROK_CONNECTOR_ACCESS_TOKEN` | Yes | Connector access. |
| `XAI_API_KEY` | Yes | Not used by the current pages. Mentioned only because the app-builder template documents it. |

Set secrets like this (value is prompted; it will not echo):

```sh
npx wrangler secret put DATABASE_URL
npx wrangler secret put BETTER_AUTH_SECRET
npx wrangler secret put GROK_AUTH_CLIENT_SECRET
```

---

## DNS cutover (do not do this until Nic says go)

Today:

- Registrar / NS already at Cloudflare (paul / rosalie).
- Apex `nicsins.com` A records point at Vercel anycast `216.150.1.1` and `216.150.16.1`.
- `www.nicsins.com` already 308s to `https://nicsins.com/`. Keep the apex as the canonical host.

When Nic says go, in this order:

1. Confirm the workers.dev preview passed `npm run smoke:cf` and a quick click-through (home, sites, creator-of-all, contact form, robots, llms.txt, security.txt, install page).
2. In the Cloudflare dashboard: Workers → `nicsins-com` → Domains & Routes → **Add custom domain** `nicsins.com`. Let Cloudflare attach it to this zone. Do not add a second colliding A record by hand.
3. Keep `www` redirecting to the apex the way it does now (existing rule or record). Do not invent a second site on `www`.
4. **Leave the Vercel project running for 48 hours** as fallback. Do not delete it, do not change its env, do not switch its domains off until that window is green.
5. After 48 hours of healthy traffic (and not before), remove the domain from the Vercel project.

Optional, after cutover, if the zone does not already send it: set HSTS to `max-age=63072000` so it matches today’s Vercel header. Kiln’s extra header / JSON-LD / canonical proposals are **not** part of this move; keep behavior identical first.

---

## Rollback (first 48 hours)

1. In Cloudflare, remove the `nicsins.com` custom domain / Worker route from `nicsins-com`.
2. Restore the apex A records to Vercel anycast, proxied or DNS-only to match whatever they were before the cutover:
   - `216.150.1.1`
   - `216.150.16.1`
3. Confirm `https://nicsins.com/` is `server: Vercel` again and re-run the smoke test with `SMOKE_LOCAL_BASE=https://nicsins.com` skipped — just curl `/`, `/robots.txt`, `/llms.txt`.
4. Leave this `cloudflare-workers` branch in place. Do not delete the Worker; it can stay on workers.dev.

If only the Worker is wrong and DNS is still on Vercel, there is nothing to roll back on the domain. Just fix the Worker and redeploy to workers.dev.

---

## What is intentionally not 1:1

- Response `Server`, `x-vercel-*`, `age`, and default `cache-control` headers. Hashed `/assets/*` get a one-year cache via `public/_headers` (better than Vercel’s `max-age=0`); HTML stays dynamically rendered.
- HSTS and other zone-level HTTPS headers on workers.dev. They return at cutover via the Cloudflare zone.
- HTML asset hashes (`/assets/styles-….css` etc.) will not match a Vercel build of a different output, even when the visible page does.
- The Neon runtime driver is HTTP instead of TCP. SQL results stay JSON-safe (bigint → number). Only matters once `DATABASE_URL` is set.
- `vite dev` now runs in the Workers runtime, so Node-only APIs that used to work in local dev (filesystem writes, `child_process`, native addons) will fail the same way they would in production.

---

## Commands cheat sheet

```sh
npm run build          # Vite production build; migrate no-ops without DATABASE_URL
npm run preview        # Local Workers runtime on 127.0.0.1:8081
npm run smoke:cf       # Diff key routes against https://nicsins.com
npm run cf-typegen     # Refresh worker-configuration.d.ts
npm run deploy         # Build + wrangler deploy to workers.dev (token required)
```
