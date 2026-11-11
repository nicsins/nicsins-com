# nicsins.com (design-integration preview)

Astro static site using the Game Art Director visual system, plus the curated site wheels and a compact music dock.

This branch is a **preview only**. It is meant to be deployed as a new Cloudflare Worker named `nicsins-com-next` on workers.dev, with no custom domains and no routes. Do not deploy it to the existing `nicsins-com` Worker, and do not touch live DNS.

```bash
npm install
npm run build
# Preview worker (no routes, no custom domain):
#   export CLOUDFLARE_API_TOKEN from the workers token file (never echo it)
#   npx wrangler deploy
```

- Visual system: `src/styles/tokens.css`, `src/styles/theme.css`
- Content: `src/data/content.js`, `src/data/about.js`, `src/data/workshop.js`
- Showcase catalog: `public/sites.json` (finished sites only)
- Workshop (collapsed, not the showcase): `src/data/workshop.js`
- Curation evidence: `qa/candidates/` and `qa/CURATION.md`
- SEO hooks: `src/data/site.js` (`indexable` is false on this preview), `src/pages/robots.txt.js`, `src/pages/sitemap.xml.js`
- Discoverability files from main: `public/llms.txt`, `public/.well-known/security.txt`
