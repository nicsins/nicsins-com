// SITEMAP HOOK (Beacon): add routes to `routes`.
import { site } from '../data/site.js';
const routes = ['/'];
export function GET() {
  const urls = routes.map((r) => `<url><loc>${new URL(r, site.url).href}</loc></url>`).join('');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`, { headers: { 'Content-Type': 'application/xml' } });
}
