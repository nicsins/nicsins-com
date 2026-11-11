import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const files = {
  "public/robots.txt": ["User-agent: GPTBot", "User-agent: ClaudeBot", "User-agent: PerplexityBot", "User-agent: Google-Extended", "Sitemap: https://nicsins.com/sitemap.xml"],
  "public/sitemap.xml": ["https://nicsins.com/", "https://nicsins.com/sites", "https://nicsins.com/creator-of-all"],
  "public/llms.txt": ["# nicsins", "[Home](https://nicsins.com/)", "[Sites](https://nicsins.com/sites)"],
  "public/.well-known/security.txt": [
    "Contact: mailto:nicsins@gmail.com",
    "Expires: 2027-11-10T23:59:59Z",
    "Canonical: https://nicsins.com/.well-known/security.txt",
  ],
};

let failed = 0;
for (const [rel, needles] of Object.entries(files)) {
  const path = resolve(root, rel);
  if (!existsSync(path)) {
    console.error(`missing ${rel}`);
    failed++;
    continue;
  }
  const body = readFileSync(path, "utf8");
  for (const n of needles) {
    if (!body.includes(n)) {
      console.error(`${rel} missing: ${n}`);
      failed++;
    }
  }
}
if (failed) {
  process.exit(1);
}
console.log("discoverability files ok");
