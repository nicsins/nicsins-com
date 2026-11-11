# nicsins.com cutover to Cloudflare Workers: state and rollback

Approved by Nic: Wed Nov 11 2026, 12:32 PM CT ("Go live with the new redesign").
Status at 12:40 PM CT: **STAGED, NOT LIVE.** Live traffic is still served by Vercel.

## Production Worker
- Worker: `nicsins-com-next` (account 520113217f6d43c4c91a3909ad47f29f)
- Version: `8c1fb6ce-c4cd-4c15-953d-c2f0066333ce` (production build: indexable, HSTS 63072000, www -> apex 308, 404 noindex)
- Entry `worker/index.js` + static assets `dist/` (`run_worker_first: true`)
- workers.dev copy: https://nicsins-com-next.nicsins.workers.dev (sends `X-Robots-Tag: noindex`; only the apex is indexable)

## DNS BEFORE (zone nicsins.com, id 1c0c026ba1858e47acd2af3dc0f4f939, NS paul/rosalie)
Read over DoH (the Workers token has no DNS read). Proxied flag inferred: the answers are the
real Vercel IPs / a visible CNAME, so the records are **DNS only (grey)**.

| Name | Type | Content | Proxied | TTL |
|---|---|---|---|---|
| nicsins.com | A | 216.150.1.1 | no (grey) | 300 |
| nicsins.com | A | 216.150.16.1 | no (grey) | 300 |
| www.nicsins.com | CNAME | nicsins.com | no (grey) | 300 |
| nicsins.com | MX | 66 route1.mx.cloudflare.net / 91 route3 / 94 route2 | n/a | 300 |
| nicsins.com | TXT | v=spf1 include:_spf.mx.cloudflare.net ~all | n/a | 300 |
| nicsins.com | TXT | google-site-verification=... (2 values in one record) | n/a | 300 |
| _dmarc.nicsins.com | TXT | v=DMARC1; p=reject; sp=reject; adkim=s; aspf=s; rua=mailto:nicsins@gmail.com | n/a | 300 |
| nicsins.com | CAA | issue + issuewild: comodoca.com, digicert.com, letsencrypt.org, pki.goog, ssl.com | n/a | 3600 |

Zone settings: SSL Full (strict), Always Use HTTPS on, min TLS 1.2, zone HSTS off (Worker sets it).
Vercel: apex 200 `server: Vercel` with HSTS 63072000; www 308 -> https://nicsins.com/.

## What was done
1. Production build deployed to `nicsins-com-next` (version above). Smoke on workers.dev: /, /sites,
   /creator-of-all, robots.txt, sitemap.xml, llms.txt, /.well-known/security.txt, og-1200x630.png,
   playlist.json all 200; "Joint Meritorious" and "under 72 hours" present; /nope 404.
   Local `wrangler dev` check: Host www.nicsins.com -> 308 https://nicsins.com/<path>?<query>.
2. Custom Domain attempt (`PUT /accounts/.../workers/domains`, nicsins.com) **refused**:
   error 100117 "Hostname already has externally managed DNS records. Delete them first."
   Deleting them needs **Zone > DNS > Edit** on nicsins.com, which this token does not have. Nothing changed.
3. Worker routes created (inert while the records are grey; no traffic effect):
   - `nicsins.com/*` -> nicsins-com-next (route id 937d2fb07ba04efb8309a55b5494828c)
   - `www.nicsins.com/*` -> nicsins-com-next (route id 02f3a607217f4a27beac7ab74b0d403c)

## To go live (one step, zero downtime)
In Cloudflare dashboard > nicsins.com > DNS, switch these 3 records to **Proxied (orange)** without
changing their content: apex A 216.150.1.1, apex A 216.150.16.1, www CNAME nicsins.com.
(Or give an agent a token with Zone > DNS > Edit for nicsins.com only.)
The routes above then catch every request. Vercel stays the origin underneath, so nothing breaks
if the Worker is removed. Do NOT touch MX/TXT/CAA.

## Rollback (instant, this token can do it)
Delete the two routes; traffic falls straight through to Vercel (origin unchanged):
```sh
export CLOUDFLARE_API_TOKEN="$(tr -d '\n' < ~/.secrets/cloudflare_workers_token)"   # never echo it
Z=1c0c026ba1858e47acd2af3dc0f4f939
for R in 937d2fb07ba04efb8309a55b5494828c 02f3a607217f4a27beac7ab74b0d403c; do
  curl -s -X DELETE "https://api.cloudflare.com/client/v4/zones/$Z/workers/routes/$R" -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN"
done
```
Full rollback (dashboard): set the 3 records back to DNS only (grey). Same contents as the table above.
Bad Worker build only: `wrangler rollback` to a previous version of nicsins-com-next.

## Vercel fallback
Leave the Vercel project and deployment running untouched for at least 48 hours after go-live.
