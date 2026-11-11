"""Smoke: first click starts the instrumental bed; mute honors ns-music-muted; no play before gesture."""
from playwright.sync_api import sync_playwright
import json, sys

ORIGIN = sys.argv[1] if len(sys.argv) > 1 else "http://127.0.0.1:4173"
FIRST_ID = "b2d1b08d-886d-497e-b34d-315d46152e09"
FIRST_TITLE = "Half-Tension"

def audio_state(page):
    return page.evaluate("""() => {
      const el = document.querySelector('audio');
      if (!el) return { present: false };
      return {
        present: true,
        paused: el.paused,
        muted: el.muted,
        src: el.currentSrc || el.src || '',
        dataSrc: el.getAttribute('data-src') || '',
        currentTime: el.currentTime || 0,
        readyState: el.readyState,
        error: el.error ? (el.error.message || String(el.error.code)) : null,
      };
    }""")

def dock_title(page):
    return page.locator('.mp__title').inner_text()

results = []
ok = True

with sync_playwright() as p:
    browser = p.chromium.launch(channel="chrome", args=["--autoplay-policy=document-user-activation-required"])
    # --- A: no play before click ---
    ctx = browser.new_context(viewport={"width": 1280, "height": 800})
    page = ctx.new_page()
    page.goto(ORIGIN + "/", wait_until="domcontentloaded")
    page.wait_for_selector("audio", state="attached", timeout=15000)
    page.wait_for_timeout(1200)
    before = audio_state(page)
    results.append(("before-click", before))
    if before.get("paused") is not True:
        ok = False
        results.append(("FAIL", "audio was not paused before click"))

    # Real Playwright click on the heading (counts as a user gesture).
    page.wait_for_timeout(400)
    loc = page.locator("h1").first
    if loc.count():
        loc.click(position={"x": 10, "y": 10})
    else:
        page.mouse.click(200, 200)
    page.wait_for_timeout(3000)
    after = audio_state(page)
    title = dock_title(page)
    results.append(("after-click", after, title))
    playing = (after.get("paused") is False) and (FIRST_ID in (after.get("src") or "") or FIRST_ID in (after.get("dataSrc") or ""))
    if not playing:
        ok = False
        results.append(("FAIL", "first click did not start Half-Tension", after, title))
    else:
        results.append(("PASS", "first click started Half-Tension", title))
    ctx.close()

    # --- B: muted should not start ---
    ctx = browser.new_context(viewport={"width": 1280, "height": 800})
    page = ctx.new_page()
    page.add_init_script("try { localStorage.setItem('ns-music-muted', '1') } catch(e) {}")
    page.goto(ORIGIN + "/", wait_until="domcontentloaded")
    page.wait_for_selector("audio", state="attached", timeout=15000)
    page.wait_for_timeout(400)
    loc = page.locator("h1").first
    if loc.count():
        loc.click(position={"x": 10, "y": 10})
    else:
        page.mouse.click(200, 200)
    page.wait_for_timeout(1500)
    muted_state = audio_state(page)
    results.append(("muted-click", muted_state))
    if muted_state.get("paused") is not True:
        ok = False
        results.append(("FAIL", "muted session started playback", muted_state))
    else:
        results.append(("PASS", "muted session did not start playback"))
    ctx.close()
    browser.close()

print(json.dumps({"ok": ok, "origin": ORIGIN, "results": results}, indent=2, default=str))
sys.exit(0 if ok else 1)
