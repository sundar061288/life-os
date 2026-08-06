# Deploy v2.1 into `Documents\life-os-pwa`

This is the same folder and the same branch you're already running. Nothing here touches the other Life OS copy.

---

## Confirmed before building

Your `index` (271 KB, 03-08-2026 17:32) was the starting point. Verified line by line:

- **4,156 lines** in your v10 file
- **4,153 present unchanged** in v2.1
- **3 changed**, and only these three:
  1. `<span class="ver">v10</span>` → `v2.1`
  2. `PANELS_DEF` — added `'garden'` and `'sync'`
  3. the `renderPanel` map — added `garden:renderGarden, sync:renderSync`

Everything else in v11 and v2.1 is appended **below** your existing code as two clearly-marked blocks. Your capture engine, segmentation, six-way intent routing, Expenses, Insights and onboarding are the exact lines you deployed on 03-08.

---

## What changes in the folder

| File | Action | Note |
|---|---|---|
| `index.html` | **Replace** | 271 KB → 348 KB |
| `sw.js` | **Replace** | cache `life-os-v10-1` → `life-os-v2-1-0` |
| `manifest.json` | Leave alone | unchanged |
| `icon-180 / 192 / 512.png` | Leave alone | unchanged |
| `CHANGELOG-v2.1.md` | Add | reference only, never uploaded |
| `sync-worker.js` | Add | only if you want cloud sync; deployed to Cloudflare, **not** to your site |

Your old changelogs (v6.3 → v10) can stay where they are.

⚠️ `sync-worker.js` does **not** go on GitHub Pages or Netlify. It's Cloudflare-only, and optional — the app works fully without it.

---

## Steps

1. Copy the new `index.html` and `sw.js` into `Documents\life-os-pwa`, overwriting the two old files. Keep a copy of the old `index.html` first if you want a fallback.
2. Upload **both** files:
   - **GitHub:** github.com/sundar061288/life-os → Add file → Upload files → drag `index.html` and `sw.js` → **Commit changes**
   - **Netlify:** app.netlify.com → your site → Deploys → drag the folder onto the drop area
3. Wait ~60 seconds.
4. On your phone: **pull down to refresh 2–3 times.** The service worker caches aggressively; one refresh usually isn't enough.
5. **Badge must read `v2.1`.** If it still says v10 (or v7), the upload didn't land or the cache hasn't turned over — refresh again before assuming anything is broken.

Nothing you have logged is lost. Replacing the app files never touches localStorage.

---

## First-run check

| Look for | Where |
|---|---|
| Badge reads **v2.1** | header, top left |
| **☁ chip** next to the clock | header |
| Bottom bar reads **Today · Do · Find · Grow · Hubs** | phone only |
| **Right Now** card with your top task | home screen |
| 24-hour **Day Ribbon**, tap a grey block | home screen |
| **Hubs** → six cards, each with its own More | bottom bar |
| **Garden** with your current streak | Grow hub |
| **Sync & Devices** with your vault key | ☁ chip |
| Energy-by-hour chart | Habits panel |
| Cross-platform block, both toggles | Settings, bottom |

---

## If something looks wrong

- **Badge still says v10** → the upload didn't land. Check the file actually changed in GitHub (the commit should show ~348 KB), then hard-refresh.
- **Old layout, new badge** → service worker still serving the old shell. Close every tab of the app, reopen, pull to refresh twice.
- **Blank panel** → tell me which one and what the header badge says; that combination tells me exactly where it broke.

---

## Rolling back

Two options, both clean:

1. Re-upload your saved v10 `index.html` and `sw.js`. Your data survives — it's in localStorage, not the file.
2. Or open the new `index.html` and delete everything from the line `LIFE OS v11 — COMPANION LAYER` down to just above `init();`. That returns the app to v10 behaviour with the three line-edits still in place and harmless.

Before either, take a backup from **Sync & Devices → Export file** so you have your data as JSON regardless.
