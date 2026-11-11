#!/usr/bin/env python3
import json, time
from pathlib import Path
from urllib.parse import urljoin
from playwright.sync_api import sync_playwright, TimeoutError as PwTimeout

BASE = "https://nicsins-com-next.nicsins.workers.dev"
OUT = Path("/workspace/nicsins-com-next/qa/preview")
OUT.mkdir(parents=True, exist_ok=True)

# Pages + a representative set of asset paths
PATHS = [
    "/", "/sites", "/sites/", "/creator-of-all", "/about",  # /about may 404 — that's ok to record
    "/robots.txt", "/sitemap.xml", "/llms.txt", "/.well-known/security.txt",
    "/favicon.svg", "/og-1200x630.png", "/hero-a-network.webp",
    "/sites.json", "/playlist.json",
    "/covers/grokzilla.jpg", "/music/bajo-oscuro.mp3",
    "/cards/place.jpg", "/windows/grokzilla.shop.jpg",
    "/404", "/no-such-page",
]

PAGES = [
    ("home", "/"),
    ("sites", "/sites"),
    ("about", "/#about"),
    ("creator", "/creator-of-all"),
]

def main():
    results = []
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, channel="chrome", args=["--disable-dev-shm-usage"])
        context = browser.new_context(viewport={"width": 1280, "height": 800}, ignore_https_errors=True)
        page = context.new_page()
        for path in PATHS:
            url = urljoin(BASE, path)
            rec = {"path": path, "url": url, "status": None, "ok": False, "error": None, "ct": None}
            try:
                resp = page.goto(url, wait_until="domcontentloaded", timeout=20000)
                rec["status"] = resp.status if resp else None
                rec["ct"] = resp.headers.get("content-type") if resp else None
                rec["final"] = page.url
                rec["ok"] = rec["status"] is not None and rec["status"] < 400
                if path in ("/404", "/no-such-page", "/about"):
                    rec["expected_404"] = True
                    rec["ok"] = rec["status"] in (404,) or (path == "/about")
            except Exception as e:
                rec["error"] = f"{type(e).__name__}: {e}"[:400]
            results.append(rec)
            print(f"{rec['status'] or 'ERR':>4} {path} {rec.get('ct') or rec.get('error') or ''}", flush=True)

        console = {}
        for name, path in PAGES:
            cons = []
            def on_console(msg, bucket=cons):
                if msg.type in ("error", "warning"):
                    bucket.append({"type": msg.type, "text": msg.text[:300]})
            page.remove_listener("console", on_console) if False else None
            page.on("console", on_console)
            page.set_viewport_size({"width": 1280, "height": 800})
            page.goto(urljoin(BASE, path), wait_until="networkidle", timeout=25000)
            page.wait_for_timeout(1500)
            page.screenshot(path=str(OUT / f"{name}-desktop.png"), full_page=False)
            page.set_viewport_size({"width": 390, "height": 844})
            page.wait_for_timeout(600)
            page.screenshot(path=str(OUT / f"{name}-mobile.png"), full_page=False)
            console[name] = cons
            page.remove_listener("console", on_console)
            print(f"SHOT {name} console={len(cons)}", flush=True)

        browser.close()
    (OUT / "smoke.json").write_text(json.dumps({"base": BASE, "results": results, "console": console}, indent=2))
    print("DONE")

if __name__ == "__main__":
    main()
