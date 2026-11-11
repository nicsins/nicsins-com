import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';
import { site } from './src/data/site.js';
// Static output. `site` drives canonical URLs, sitemap.xml and robots.txt.
export default defineConfig({
  site: site.url,
  output: 'static',
  trailingSlash: 'ignore',
  integrations: [vue()],
});
