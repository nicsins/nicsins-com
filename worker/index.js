// nicsins.com production Worker: static Astro assets + host canonicalization.
// - www.nicsins.com -> 308 https://nicsins.com (path + query kept)
// - HSTS on nicsins.com (matches the old Vercel header)
// - workers.dev / preview hosts get X-Robots-Tag: noindex so only the apex is indexed
const APEX = 'nicsins.com';
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.hostname === 'www.' + APEX) {
      url.hostname = APEX;
      url.protocol = 'https:';
      return new Response(null, { status: 308, headers: { Location: url.toString(), 'Strict-Transport-Security': 'max-age=63072000' } });
    }
    const res = await env.ASSETS.fetch(request);
    const out = new Response(res.body, res);
    if (url.hostname === APEX) {
      out.headers.set('Strict-Transport-Security', 'max-age=63072000');
    } else {
      out.headers.set('X-Robots-Tag', 'noindex');
    }
    return out;
  },
};
