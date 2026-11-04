# nicsins.com

Astro static site. `npm install && npm run build` → `dist/`.

- Content/links: `src/data/content.js` (Featured = only link-check 200s)
- Components: `src/components/` (ResultsStrip, FeaturedLive, ClientServices, OpenSource, InDevelopment)
- Styling hooks (Game Art Director): `src/styles/tokens.css` (GAD tokens + `.ns-*` components), `src/styles/theme.css` (layout helpers)
- SEO hooks (Beacon): `src/data/site.js`, `src/seo/Seo.astro` (meta/OG + `<slot/>` and `head` slot), `src/seo/JsonLd.astro`, `src/pages/sitemap.xml.js`, `src/pages/robots.txt.js`

Deploy (preview only): build, copy `dist` to `.vercel/output/static`, `vercel deploy --prebuilt`.
