# Showcase curation — 11 November 2026, America/Chicago

Every live candidate was opened with Playwright (system Chrome) at 1280×800 and 390×844. Shots and a load manifest are in `qa/candidates/`. A site entered the showcase only if it loaded cleanly, looked refined on both viewports, and presented as a finished product that works end to end. When unsure, it went to the workshop.

`dragonandpanda.com` (branded on the Neon Plaza title screen) did not resolve from this box, so the showcase still links `dragon-and-panda.vercel.app` and is flagged as vercel.app-only.

## Showcase (13)

| Site | Why it stays |
|---|---|
| Neon Plaza | Finished title screen, clear play CTAs, usable on mobile. |
| Burning Man | Finished character-select landing, polished art, stacks cleanly on mobile. |
| Grokzilla Shop | Live custom-domain shop, 41 services, usable on mobile. |
| Micro Pay | Same product family on its custom domain, finished landing (castle desk). |
| Harbinger | Finished custom-domain product, typography and ticker hold on mobile. |
| NICJE | Live pay page on `x402-micro-pay.com/nicje`. Tight on mobile, but a complete payable skill, not a half-built app. |
| Omega Utopia | Finished public desk, typography and status table work on mobile. Still vercel.app-only. |
| Kwizzle | Finished partner landing, nav and type hold on mobile. vercel.app-only. |
| x402 MCP | Finished catalog/landing on onrender.com, usable on mobile. |
| A2A Oracle | Finished product typography and ask/menu. vercel.app-only. |
| x402 Oracle | Finished price list and agent instructions. vercel.app-only. |
| Alpha Sentinel | Finished marketing + pricing. Mobile nav wraps but stays readable. vercel.app-only. |
| Crediting Swarm | Finished product UI with a visible test path and live node status. vercel.app-only. |

## In the workshop (21)

See `src/data/workshop.js` for the `why` on each. Highlights:

- Ro Sham Bo Sigma: “CONTRACT NOT DEPLOYED” and a zero-address placeholder.
- AetherScribe: blank white render.
- HMAC: raw JSON, no UI.
- GodlyForge: unstyled text, Gumroad not connected.
- Jocky: document title still “Create Next App”.
- Action center: stale duplicate of the shop (36 vs 41) on a vercel admin URL.
- Contextzilla: polished on desktop, nav/H1 overflow on mobile, so it failed the mobile bar.
- Zero Breach Guide: already labeled preview.
- Omni-Auction and The crew: no public URL.

## vercel.app-only (no custom domain found; not guessed)

Showcase: Neon Plaza, Burning Man, Omega Utopia, Kwizzle, A2A Oracle, x402 Oracle, Alpha Sentinel, Crediting Swarm.

Workshop entries that only have a vercel.app (or onrender) URL are listed as-is. `x402-mcp.onrender.com` is a real non-Vercel host, not a custom domain of ours.
