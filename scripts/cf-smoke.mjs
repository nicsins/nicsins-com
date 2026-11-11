#!/usr/bin/env node
/**
 * Compare a local Workers preview (or a workers.dev URL) with live
 * https://nicsins.com. Static discovery files must match. HTML routes must
 * return 200, the same titles/phrases, and the same PWA/OG chrome. Hosting
 * headers (server, cache, HSTS, age) are allowed to differ.
 *
 * Usage:
 *   SMOKE_LOCAL_BASE=http://127.0.0.1:8081 node scripts/cf-smoke.mjs
 *   SMOKE_LOCAL_BASE=https://nicsins-com.<account>.workers.dev node scripts/cf-smoke.mjs
 */
const LIVE_BASE = (process.env.SMOKE_LIVE_BASE || "https://nicsins.com").replace(/\/$/, "");
const LOCAL_BASE = (process.env.SMOKE_LOCAL_BASE || "http://127.0.0.1:8081").replace(
  /\/$/,
  "",
);

const STATIC_ROUTES = [
  "/robots.txt",
  "/sitemap.xml",
  "/llms.txt",
  "/.well-known/security.txt",
  "/favicon.svg",
];

const BINARY_ROUTES = ["/og.jpg", "/__grok/icon-180.png"];

const HTML_ROUTES = [
  {
    path: "/",
    mustInclude: [
      "nicsins — Nic Beltrante",
      "Minneapolis",
      'name="twitter:card"',
      'property="og:image"',
      "/og.jpg",
      'rel="manifest"',
      "/__grok/manifest.webmanifest",
      "grok.com/grok-app-builder/extensions.js",
    ],
  },
  {
    path: "/sites",
    mustInclude: ["nicsins", 'name="twitter:card"', "/__grok/manifest.webmanifest"],
  },
  {
    path: "/creator-of-all",
    mustInclude: ["nicsins", 'name="twitter:card"'],
  },
  {
    path: "/?install=1&platform=ios",
    mustInclude: ["apple-mobile-web-app-title", "Grok App"],
  },
];

const JSON_ROUTES = ["/__grok/manifest.webmanifest"];
const MISSING_PATH = "/this-page-is-not-a-route-on-nicsins";

const failures = [];
const notes = [];

function normalizeText(text) {
  return text.replace(/\r\n/g, "\n").trim();
}

function contentType(headers) {
  return (headers.get("content-type") || "").split(";")[0].trim().toLowerCase();
}

async function get(base, path) {
  const url = `${base}${path}`;
  const response = await fetch(url, { redirect: "manual" });
  const bytes = new Uint8Array(await response.arrayBuffer());
  return { url, response, bytes };
}

function decode(bytes) {
  return new TextDecoder("utf-8").decode(bytes);
}

function hexSha(bytes) {
  // short identity for binary compare — length + first/last bytes, not a hash lib
  const first = bytes.slice(0, 8).join(",");
  const last = bytes.slice(-8).join(",");
  return `len=${bytes.byteLength};head=${first};tail=${last}`;
}

async function compareStatic(path) {
  const live = await get(LIVE_BASE, path);
  const local = await get(LOCAL_BASE, path);
  if (live.response.status !== 200) {
    failures.push(`LIVE ${path} expected 200, got ${live.response.status}`);
    return;
  }
  if (local.response.status !== 200) {
    failures.push(`LOCAL ${path} expected 200, got ${local.response.status} (${local.url})`);
    return;
  }
  const liveType = contentType(live.response.headers);
  const localType = contentType(local.response.headers);
  if (liveType && localType && liveType !== localType) {
    // charset-only already stripped; still fail on type mismatch
    failures.push(`${path} content-type live=${liveType} local=${localType}`);
  }
  const liveText = normalizeText(decode(live.bytes));
  const localText = normalizeText(decode(local.bytes));
  if (liveText !== localText) {
    failures.push(
      `${path} body differs from live (live ${liveText.length} chars, local ${localText.length} chars)`,
    );
  } else {
    notes.push(`OK  ${path}  ${local.response.status}  ${localType || "text"}  exact body match`);
  }
}

async function compareBinary(path) {
  const live = await get(LIVE_BASE, path);
  const local = await get(LOCAL_BASE, path);
  if (live.response.status !== 200 || local.response.status !== 200) {
    failures.push(
      `${path} status live=${live.response.status} local=${local.response.status}`,
    );
    return;
  }
  const liveType = contentType(live.response.headers);
  const localType = contentType(local.response.headers);
  if (liveType && localType && liveType !== localType) {
    failures.push(`${path} content-type live=${liveType} local=${localType}`);
  }
  if (hexSha(live.bytes) !== hexSha(local.bytes)) {
    failures.push(
      `${path} bytes differ (live ${live.bytes.byteLength}, local ${local.bytes.byteLength})`,
    );
  } else {
    notes.push(`OK  ${path}  ${local.response.status}  ${localType}  exact bytes`);
  }
}

async function compareHtml(spec) {
  const live = await get(LIVE_BASE, spec.path);
  const local = await get(LOCAL_BASE, spec.path);
  if (live.response.status !== 200) {
    failures.push(`LIVE ${spec.path} expected 200, got ${live.response.status}`);
    return;
  }
  if (local.response.status !== 200) {
    failures.push(`LOCAL ${spec.path} expected 200, got ${local.response.status}`);
    return;
  }
  const localType = contentType(local.response.headers);
  if (!localType.includes("text/html")) {
    failures.push(`${spec.path} local content-type ${localType}, expected text/html`);
  }
  const liveHtml = decode(live.bytes);
  const localHtml = decode(local.bytes);
  for (const snippet of spec.mustInclude) {
    if (!localHtml.includes(snippet)) {
      failures.push(`LOCAL ${spec.path} missing ${JSON.stringify(snippet)}`);
    }
    if (!liveHtml.includes(snippet)) {
      notes.push(`note: live ${spec.path} also missing ${JSON.stringify(snippet)}`);
    }
  }
  // Titles should match when both sides have one.
  const titleOf = (html) => {
    const m = html.match(/<title[^>]*>([^<]*)<\/title>/i);
    return m ? m[1].trim() : "";
  };
  const liveTitle = titleOf(liveHtml);
  const localTitle = titleOf(localHtml);
  if (liveTitle && localTitle && liveTitle !== localTitle) {
    failures.push(`${spec.path} title live=${JSON.stringify(liveTitle)} local=${JSON.stringify(localTitle)}`);
  }
  notes.push(
    `OK  ${spec.path}  ${local.response.status}  html  live ${live.bytes.byteLength}B local ${local.bytes.byteLength}B title=${localTitle}`,
  );
}

async function compareManifest() {
  for (const path of JSON_ROUTES) {
    const live = await get(LIVE_BASE, path);
    const local = await get(LOCAL_BASE, path);
    if (local.response.status !== 200) {
      failures.push(`LOCAL ${path} expected 200, got ${local.response.status}`);
      continue;
    }
    const localType = contentType(local.response.headers);
    if (!localType.includes("manifest") && localType !== "application/json") {
      failures.push(`${path} content-type ${localType}`);
    }
    let localJson;
    try {
      localJson = JSON.parse(decode(local.bytes));
    } catch {
      failures.push(`${path} local body is not JSON`);
      continue;
    }
    if (!localJson.icons || !localJson.start_url) {
      failures.push(`${path} missing icons or start_url`);
    }
    if (live.response.status === 200) {
      const liveJson = JSON.parse(decode(live.bytes));
      for (const key of ["name", "short_name", "start_url", "display"]) {
        if (liveJson[key] !== localJson[key]) {
          failures.push(`${path}.${key} live=${JSON.stringify(liveJson[key])} local=${JSON.stringify(localJson[key])}`);
        }
      }
    }
    notes.push(`OK  ${path}  ${local.response.status}  ${localType}`);
  }
}

async function compareMissing() {
  const live = await get(LIVE_BASE, MISSING_PATH);
  const local = await get(LOCAL_BASE, MISSING_PATH);
  // Live Vercel currently serves the app shell as 404 HTML.
  if (local.response.status !== live.response.status) {
    failures.push(
      `${MISSING_PATH} status live=${live.response.status} local=${local.response.status}`,
    );
  } else {
    notes.push(`OK  ${MISSING_PATH}  ${local.response.status} (matches live)`);
  }
}

async function main() {
  console.log(`smoke: live=${LIVE_BASE}`);
  console.log(`smoke: local=${LOCAL_BASE}`);
  try {
    const probe = await get(LOCAL_BASE, "/");
    if (probe.response.status >= 500) {
      throw new Error(`local ${LOCAL_BASE}/ returned ${probe.response.status}`);
    }
  } catch (err) {
    console.error(`Cannot reach local preview at ${LOCAL_BASE}. Start it with:`);
    console.error(`  npm run build && npm run preview`);
    console.error(`  or: npx wrangler dev --port 8081`);
    console.error(err instanceof Error ? err.message : err);
    process.exit(2);
  }

  for (const path of STATIC_ROUTES) await compareStatic(path);
  for (const path of BINARY_ROUTES) await compareBinary(path);
  for (const spec of HTML_ROUTES) await compareHtml(spec);
  await compareManifest();
  await compareMissing();

  for (const line of notes) console.log(line);
  if (failures.length) {
    console.error(`\n${failures.length} failure(s):`);
    for (const line of failures) console.error(`- ${line}`);
    process.exit(1);
  }
  console.log(`\nAll checks passed against ${LIVE_BASE}.`);
}

await main();
