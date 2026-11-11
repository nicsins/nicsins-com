# Next version only — not built in this preview

Nic asked for a later pass of Dragon & Panda cyberpunk eye candy: for example a panda riding a drone that flies across the screen and lands inside the games / Play preview window.

Suggested hook (do not implement here):

- `src/components/wheels/PreviewWindow.vue` after a Play-category preview (`site.category === 'play'` or `site.id` of neon-plaza / burning-man) finishes opening.
- Keep it out of the hero (style guide: text never sits on busy art) and honor `prefers-reduced-motion` (skip the flight, show a static lander or nothing).
- Do not autoplay over the music dock; if it has sound, it must respect the same mute flag (`ns-music-muted`).

Best local asset files found on the box (not copied into this preview):

- `/workspace/cbm-art/panda_bamboo_boost.webp` (+ `_preview.gif`, `_contact.png`) — 15-frame panda boost sheet
- `/workspace/cbm-art/dragon_wingman.webp` (+ preview/contact) — 20-frame dragon flap/bank/fire sheet
- `/workspace/cbm-art/src/panda_boost.jpg`, `dragon_fly.jpg`, `dragon_fire.jpg`
- `/workspace/cbm-main/assets/panda.png`, `panda_hd.png`, `dragon.png`, `dragon_hd.png` (and copies under `/workspace/cbm/`, `/workspace/cbm-lookdev/`)
- `/workspace/games/cbm/` and `/workspace/games/_src/cyberpunk-burning-man` (live game sources)
- `/workspace/rsb-art/dragon-dock.jpg`, `dragon-dock-tall.jpg`, `dragon-bomber.jpg`, `clips/dragon-dock-01.mp4`, `clips/dragon-winning-01.mp4`, `refs/dragon-sprite.png`, `refs/red-panda.png`
