# Life OS — Step-by-Step Setup

## Short answer first

**It is plug and play. There is no .exe, no installer, no configuration file to edit.**

Life OS is a *website that behaves like an app*. You put 6 files on the internet (free, 2 minutes), open the link on your phone once, tap "Add to Home screen" — and from then on it has its own icon and opens full-screen with no browser bars. Exactly like a Play Store app, except free and instant.

You never open or edit any of these files. All settings are inside the app itself.

---

## What each file does (do not rename or move them)

| File | Role |
|---|---|
| **index.html** | **This is the entire app.** Every panel, all the code, the whole design — one file. |
| **manifest.json** | Tells your phone the app's name, icon and colours so it can install to the home screen. |
| **sw.js** | The "service worker" — caches the app so it works with no internet. |
| **icon-192.png**, **icon-512.png** | App icon on Android. |
| **icon-180.png** | App icon on iPhone. |

**Rule: all 6 files must sit together in the same folder, and `index.html` must keep that exact name.** That's the only technical requirement in the whole process.

---

## ROUTE A — Netlify Drop (recommended · 2 minutes · free forever)

Do this once from a **computer**, then use the phone.

**Step 1.** Download `life-os-pwa.zip` and unzip it. You now have a folder with 6 files inside.

**Step 2.** Open **https://app.netlify.com/drop** in any browser.

**Step 3.** Drag the **folder** onto the dashed box on that page. (Drag the folder, not the zip file.)

**Step 4.** Wait about 20 seconds. Netlify gives you a live link like
`https://calm-mango-4a7b2c.netlify.app`
Copy it. Bookmark it. That link is now your app.

**Step 5.** On your **Android phone**, open that link in **Chrome**.

**Step 6.** Tap the **⋮ menu (top right) → Add to Home screen** (may say *Install app*). Confirm.

**Step 7.** Close Chrome. Tap the new **Life OS** icon on your home screen. It opens full-screen — no address bar. That's the app installed.

**Step 8.** On first launch choose **✨ Start Fresh** (not sample data — you want your own numbers).

**Step 9.** Go to **More → Settings** and set these four things:
- **Profile:** your name (it personalises the greeting and the AI coach)
- **Check-in Prompts:** interval (start with 45 min) and active hours (e.g. 6 to 22)
- **Notifications:** tap to turn ON, then tap *Allow* in the phone's permission popup
- **Focus Defaults:** work/break minutes if 25/5 doesn't suit you

Setup finished. Nothing else to configure, ever.

> Netlify free accounts keep the site alive indefinitely. If you sign up (free), you can also rename the link to something like `sundar-lifeos.netlify.app`.

---

## ROUTE B — GitHub Pages (permanent, nicer URL · 5 minutes · free)

Use this if you want a link you fully control and can update later.

1. Sign up at **github.com** (free)
2. **New repository** → name: `life-os` → **Public** → Create
3. On the empty repo page click **uploading an existing file** → drag in all **6 files** (the files themselves, not the folder) → **Commit changes**
4. **Settings** tab → **Pages** (left sidebar) → Source: *Deploy from a branch* → Branch: **main**, folder: **/ (root)** → **Save**
5. Wait 1–2 minutes, refresh. Your link appears: `https://YOURNAME.github.io/life-os/`
6. Then follow **Steps 5–9** from Route A.

To update the app later, upload a new `index.html` over the old one — your data is untouched because data lives on your phone, not in the file.

---

## iPhone install (same links, one difference)

Open the link in **Safari** — it must be Safari, not Chrome.
**Share button (□↑) → Add to Home Screen → Add.**

Everything works the same. The only difference: notifications require iOS 16.4 or newer, and only work *after* you've added it to the home screen. The in-app check-in popups work regardless whenever the app is open.

---

## ⚠️ The one mistake to avoid

**Don't test by opening `index.html` directly from your files, then switch to a web link later.** Your data will not follow — the browser treats a local file and a website as two different places. Whatever you set up first is where your data lives.

**Go straight to Route A or B from day one.** If you already logged data somewhere else, use **Settings → Export Data** there and **Import** it in the new place.

---

## Where your data lives, in plain terms

Inside your phone's browser storage for that one link. Not on Netlify's servers, not on GitHub, not with me. Hosting only delivers the app file — your logs never leave the phone.

That means:
- ✅ Fully private, works offline, no account
- ⚠️ Clearing Chrome's site data, or uninstalling, deletes it

**So: every Sunday, Settings → Export Data.** It saves one JSON file — drop it in Google Drive. That is your entire backup, restorable via Import on any phone.

---

## Daily use, once installed

| When | What |
|---|---|
| Morning | Open app, glance at the nudge card at the top |
| Through the day | Answer the check-in popups honestly — 3 in a row = ⭐ |
| Any time you switch tasks | **Log** tab → tap the hour → activity + energy (10 seconds) |
| Night | **Screen** tab → copy today's numbers from Digital Wellbeing / Screen Time |
| Sunday | Export backup + read More → Time Audit and Weekly |

Keep friction notes in **More → Journal** all month. That becomes the v7 build list.
