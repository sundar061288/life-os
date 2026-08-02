# Life OS v6.1 — Responsive & Layout Fix Release

**3 files changed:** `index.html`, `sw.js`, `manifest.json` · icons unchanged.

---

## Bugs you found, and what caused them

### Bug 1 — Welcome screen said "v4"
Straightforward oversight: the version was updated in the header badge and About panel, but the string inside the first-run overlay was missed.
**Fixed** → now reads "Welcome to Life OS v6".

### Bug 2 — Sidebar eating half the screen, no way to hide it
The mobile layout only activated below **700px** wide. Your phone reports more than that in several situations (landscape, and higher-density devices in some browser modes), so it fell back to the *desktop* layout — sidebar plus top tabs — on a phone screen.

**Two fixes:**
1. **Breakpoint raised to 1024px**, plus an explicit rule for landscape phones (`orientation:landscape and max-height:600px`). Phones now get the mobile layout in *both* orientations, always.
2. **New ☰ button** added to the top-left of the header — you asked for this:
   - **On a phone:** slides the sidebar in as a drawer over the content, with a dark backdrop. Tap any menu item, or the backdrop, and it closes automatically.
   - **On desktop/laptop:** collapses the sidebar entirely so the dashboard gets full width. Your preference is remembered between visits.

### Bug 3 — Top bar cut off / hidden after rotating
Two separate causes, both fixed:

**(a) Status bar overlap.** The app declares `black-translucent` status bar styling, which means the web page draws *underneath* the phone's clock and battery area. The header had no compensation for it, so the system clock sat on top of "Life OS" (visible in your third screenshot).
→ Added `env(safe-area-inset-top)` padding to the header, and left/right insets for notches in landscape. The bottom nav's height now includes the home-indicator inset too, so nothing hides behind it.

**(b) Stale layout after rotation.** When you rotated, the browser switched which layout rules applied, but the JavaScript state didn't re-sync — leaving the sidebar and the bottom bar visible *at the same time*, with content clipped. That's exactly what your third screenshot shows.
→ Added `resize`, `orientationchange`, and `visualViewport` listeners that re-sync layout classes and re-render the active panel, debounced to 180ms.

---

## Other improvements included

- `100dvh` used instead of `100vh` — the AI Coach panel no longer gets cut off by mobile browser chrome
- Top tab bar scrolls horizontally on medium screens instead of being clipped
- Clock hidden on narrow screens; energy badge hidden on landscape phones to save header space
- Extra breakpoint at 400px for small phones; app name hides so the header never wraps
- Landscape phones get a shorter header (42px) and bottom bar (50px) so content still fits
- Tablet range (1025–1320px) gets a narrower sidebar and 2-column grids
- `matchMedia` fallback for older browsers
- **manifest.json:** `orientation` changed from `"portrait"` to `"any"` — the lock was ignored on iOS anyway, and it prevented legitimate landscape use
- **sw.js:** cache name bumped to `life-os-v6-1` — **this is essential**, otherwise phones keep serving the old cached version

---

## How to deploy the update

### If you use GitHub (recommended — Netlify auto-deploys from it)
1. Go to **github.com/sundar061288/life-os**
2. Click **index.html** → pencil icon (✏️ Edit) → select all → paste the new file → **Commit changes**
3. Repeat for **sw.js** and **manifest.json**

*Faster alternative:* **Add file → Upload files**, drag all three in at once, Commit. GitHub overwrites the existing ones.

If Netlify is linked to the repo, it redeploys within a minute. If not, see below.

### If you deployed by dragging to Netlify Drop
1. Unzip `life-os-pwa.zip` — it contains all 6 files, already updated
2. Netlify dashboard → your site → **Deploys** tab
3. Drag the **folder** onto the "drag and drop your site folder here" area
4. Live in ~20 seconds at the same URL

---

## ⚠️ After deploying — force the update on your phone

Service workers serve the cached copy first, so your phone will keep showing the old version until it refreshes. Do this once:

**Android (Chrome):**
1. Open the app from the home-screen icon
2. Pull down to refresh — repeat 2–3 times over about 30 seconds
3. Still old? Chrome → Settings → Site settings → All sites → `sun-life-os.netlify.app` → Clear & reset, then reopen

**iPhone (Safari):**
1. Close the app fully (swipe it away from the app switcher)
2. Reopen — it should fetch the new version
3. Still old? Settings → Safari → Advanced → Website Data → find the site → delete → reopen the link and re-add to home screen

**Confirm it worked:** the header badge shows **v6**, and a **☰ button** appears at the top-left.

> **Your data is safe.** It lives in the browser's storage, separate from the cached app files. Updating the app doesn't touch your logs. Clearing *site data* in the steps above, however, does delete logs — so if you've recorded anything you care about, **Settings → Export Data** first.

---

## Quick verification checklist

- [ ] Header badge reads **v6**; welcome screen (if shown) says v6
- [ ] **☰** button visible top-left
- [ ] Phone portrait: no sidebar, bottom bar shows Home/Tasks/Log/Screen/More
- [ ] Tap ☰ → sidebar slides in over content with dark backdrop
- [ ] Tap a menu item → drawer closes and the panel opens
- [ ] Rotate to landscape → bottom bar stays, no sidebar, header intact
- [ ] Rotate back to portrait → layout correct, nothing clipped
- [ ] Header clock/battery no longer overlaps "Life OS"
- [ ] Laptop: ☰ collapses the sidebar for a full-width dashboard, and it stays collapsed on reload
