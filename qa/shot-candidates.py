#!/usr/bin/env python3
"""Desktop + mobile screenshots of every candidate site, plus load notes."""
from __future__ import annotations

import json
import sys
import time
from pathlib import Path

from playwright.sync_api import TimeoutError as PwTimeout
from playwright.sync_api import sync_playwright

OUT = Path(__file__).resolve().parent / "candidates"
OUT.mkdir(parents=True, exist_ok=True)

SITES = [
    ("neon-plaza", "https://dragon-and-panda.vercel.app"),
    ("burning-man", "https://cyberpunk-burning-man.vercel.app"),
    ("plaza-earlier", "https://dawn-able-terra-terra.vercel.app"),
    ("ro-sham-bo", "https://ro-sham-bo.vercel.app"),
    ("ro-sham-bo-sigma", "https://ro-sham-bo-sigma.vercel.app"),
    ("grokzilla", "https://grokzilla.shop"),
    ("micro-pay", "https://x402-micro-pay.com"),
    ("harbinger", "https://www.x403-harbinger.com"),
    ("gateway", "https://x402-gateway.vercel.app"),
    ("action-center", "https://x402-admin-action-center.vercel.app"),
    ("aetherscribe", "https://aetherscribe.vercel.app"),
    ("nicje", "https://x402-micro-pay.com/nicje"),
    ("contextzilla", "https://contextzilla.vercel.app"),
    ("omega-utopia", "https://omega-utopia.vercel.app"),
    ("lil-buddy", "https://lil-buddy.vercel.app"),
    ("case-converter", "https://case-converter.vercel.app"),
    ("markdown-to-text", "https://markdown-to-text.vercel.app"),
    ("hmac", "https://x402-hmac-util.vercel.app"),
    ("kwizzle", "https://keith-kwizz-sovereign-forge.vercel.app"),
    ("x402-mcp", "https://x402-mcp.onrender.com"),
    ("godlyforge", "https://godlyforge.vercel.app"),
    ("a2a-oracle", "https://a2a-x402-oracle.vercel.app"),
    ("x402-oracle", "https://x402orcle.vercel.app"),
    ("alpha-sentinel", "https://alpha-sentinel-mcp.vercel.app"),
    ("mn-compliance", "https://mn-compliance-webapp.vercel.app"),
    ("swarmscribe", "https://swarmscribe-qma2.vercel.app"),
    ("crediting-swarm", "https://x402-crediting-swarm.vercel.app"),
    ("daw-ivader", "https://daw-ivader.vercel.app"),
    ("vibe-forge", "https://vibe-forge-ide-ochre.vercel.app"),
    ("jocky", "https://jocky-ai.vercel.app"),
    ("art-builder", "https://art-product-builder.vercel.app"),
    ("zero-breach", "https://zero-breach-guide.vercel.app"),
]

VIEWPORTS = {
    "desktop": {"width": 1280, "height": 800},
    "mobile": {"width": 390, "height": 844},
}


def shot_one(browser, sid, url, viewport_name, size):
    rec = {
        "id": sid,
        "url": url,
        "viewport": viewport_name,
        "ok": False,
        "status": None,
        "final_url": None,
        "title": None,
        "error": None,
        "console_errors": [],
        "path": str(OUT / f"{sid}-{viewport_name}.png"),
        "notes": [],
    }
    context = browser.new_context(
        viewport=size,
        device_scale_factor=1,
        ignore_https_errors=True,
        user_agent=(
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
            "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            if viewport_name == "desktop"
            else "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) "
            "AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"
        ),
    )
    page = context.new_page()
    errors = []

    def on_console(msg):
        if msg.type == "error":
            errors.append(msg.text[:300])

    page.on("console", on_console)
    try:
        response = page.goto(url, wait_until="domcontentloaded", timeout=20000)
        rec["status"] = response.status if response else None
        rec["final_url"] = page.url
        try:
            page.wait_for_load_state("networkidle", timeout=8000)
        except PwTimeout:
            rec["notes"].append("networkidle timeout")
        page.wait_for_timeout(1200)
        rec["title"] = page.title()
        body = ""
        try:
            body = page.inner_text("body")[:2000]
        except Exception:
            pass
        low = (body or "").lower()
        for needle, note in [
            ("deployment not found", "vercel deployment not found"),
            ("404: not found", "404 not found"),
            ("this page could not be found", "next 404"),
            ("application error", "application error"),
            ("internal server error", "500"),
            ("work in progress", "says work in progress"),
            ("coming soon", "says coming soon"),
            ("lorem ipsum", "lorem ipsum placeholder"),
            ("todo:", "todo placeholder"),
            ("placeholder", "mentions placeholder"),
        ]:
            if needle in low:
                rec["notes"].append(note)
        page.screenshot(path=rec["path"], full_page=False)
        rec["ok"] = True
        rec["console_errors"] = errors[:8]
    except Exception as e:
        rec["error"] = f"{type(e).__name__}: {e}"[:500]
        rec["console_errors"] = errors[:8]
        try:
            page.screenshot(path=rec["path"], full_page=False)
        except Exception:
            pass
    finally:
        context.close()
    return rec


def main():
    results = []
    started = time.time()
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, channel="chrome", args=["--disable-dev-shm-usage"])
        try:
            for sid, url in SITES:
                for vp, size in VIEWPORTS.items():
                    rec = shot_one(browser, sid, url, vp, size)
                    results.append(rec)
                    flag = "OK" if rec["ok"] else "FAIL"
                    print(f"{flag} {sid:18} {vp:7} status={rec['status']} {rec['title'] or rec['error'] or ''}", flush=True)
        finally:
            browser.close()
    manifest = {
        "generated": time.strftime("%Y-%m-%dT%H:%M:%S"),
        "elapsed_s": round(time.time() - started, 1),
        "results": results,
    }
    (OUT / "manifest.json").write_text(json.dumps(manifest, indent=2))
    print("DONE", len(results), "shots in", manifest["elapsed_s"], "s")


if __name__ == "__main__":
    sys.exit(main() or 0)
