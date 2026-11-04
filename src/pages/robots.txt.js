// ROBOTS HOOK (Beacon): follows site.indexable.
import { site } from '../data/site.js';
export function GET() {
  const body = site.indexable ? `User-agent: *\nAllow: /\nSitemap: ${site.url}/sitemap.xml\n` : `User-agent: *\nDisallow: /\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain' } });
}
