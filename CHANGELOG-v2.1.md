# Life OS v2.1 — Cross-Platform

**3 files:** `index.html`, `sw.js` (cache `life-os-v2-1-0`), `sync-worker.js` (optional backend) · still ₹0 · your data is untouched

---

## Yes — I read the zip

`cross-platform-task-manager.zip` is a **React 19 + Vite + TypeScript + Tailwind rewrite** of Life OS with an **Express server** (`server.ts`) behind it: 24 components, `src/lib/{storage,voiceParser,intelligentScheduler,theme}.ts`, and a disk-persisted cloud vault in `.cloud_vaults/`. Your vault `VAULT-211871.json` is in there.

Four things exist in that build that did **not** exist in ours, and those are what v2.1 brings across:

| In the AI Studio build | Now in Life OS v2.1 |
|---|---|
| Cloud Vault + `POST /api/sync/:vaultId` bi-directional merge, device registry, snapshot backups, `SyncCenterModal` | **Sync & Devices** panel + header cloud chip |
| `DoomscrollRescueModal` — countdown, alert tone, star reward | **Doomscroll Rescue** guard |
| `intelligentScheduler.ts` — learns peak hours, suggests habit times | **Energy-by-hour** card in Habits |
| Hourly push notification + audio chime; install modal | **Hourly audit reminder** + **Install guide** |

**One honest structural difference.** That project needs Node running (`tsx server.ts`, then Cloud Run). Ours is a static file on GitHub Pages / Netlify with no server — so I did **not** copy the architecture, I copied the **contract**. The merge logic now runs in the client, and the vault can live in any of three places you choose. Rewriting our app into React/Vite would mean rebuilding 26 working panels to gain nothing a user can see; the sync capability was the actual point.

---

## 1 · Cloud Vault sync

**Sync & Devices** (Review hub, or the ☁ chip in the header).

- **Vault key** — `VAULT-######`, same format as your AI Studio vault. Copy it, enter it on your phone/laptop under *Pair another device*, and both merge into one vault.
- **Device registry** — every device that syncs registers its name, platform and last-active time; you see the list.
- **Bi-directional merge** — item by item, newest `updatedAt` wins. Nothing is overwritten wholesale, so editing on your phone while your laptop is closed is safe.
- **Offline-first** — no network, no problem. The chip shows `n pending`, and the queue flushes the moment you're back online.
- **Auto-sync** — pushes whenever something changes, and at least every 5 minutes. Toggleable.
- **Backups** — 3 rolling local snapshots with one-tap restore, plus a cloud snapshot marker and the existing JSON export.

### Where the vault lives — pick one

| Mode | What it does | Setup |
|---|---|---|
| **This device** | No server at all. Move data with the export file. | Nothing — the default |
| **Same server** | Talks to `/api/sync/…` on whatever host serves the app | Use if you run the AI Studio Node build — its `server.ts` works **unchanged** |
| **Custom URL** | Any endpoint speaking the same API | Paste a URL — e.g. the bundled Worker |

### Deploying `sync-worker.js` (free, ~5 minutes)

1. dash.cloudflare.com → **Workers & Pages** → Create → Worker → Deploy
2. **Edit code** → paste `sync-worker.js` → Deploy
3. **Settings → Bindings → Add → KV namespace**, variable name `VAULTS` (create a namespace `life-os-vaults`)
4. Copy the `https://….workers.dev` URL
5. Life OS → **Sync & Devices** → *Custom URL* → paste → **Save**

Free tier is 100k requests/day. Repeat step 5 with the same vault key on every device.

### One improvement over the original

`server.ts` merges by ID with no deletion tracking — delete a task on your phone and the next sync from your laptop **brings it back**. v2.1 records **tombstones**: deletions carry a timestamp and stick. The bundled Worker honours them; your existing Express server doesn't, and the app still works against it (verified in the test suite both ways) — you just keep that resurrection quirk until you switch backends.

**Security note:** anyone holding the vault key can read that vault. It's a shared secret, not an account. Don't paste it anywhere public.

## 2 · Doomscroll Rescue 🛑

When today's **social + short video** crosses your limit (default 45 min, adjustable in Settings), an interrupt fires: the hours-gone number, a 15-second countdown, an alert tone and vibration, then two ways out — **focus on your top task** (+10 stars) or a **5-minute reclaim sprint** (+15). Either one opens the Pomodoro directly on that task.

It re-fires at each further multiple of the limit, not repeatedly at the same number, and it never interrupts while you're typing or mid wind-down.

## 3 · Energy by hour

Ported from `intelligentScheduler.ts`, with one change. The original scores `energy × volume`, so an hour you log often but always at low energy ranks as a *peak* — 22:00 doomscrolling scored higher than 09:00 deep work in testing. v2.1 scores **relative to a neutral 5/10**, so low-energy hours push down instead of up.

The Habits panel now opens with a 24-hour energy bar chart and a suggested time per habit — morning habits to your best morning hour, evening ones to your wind-down hour, everything else to your peak working hour. Right Now also says *"This is one of your peak hours"* when it is.

## 4 · Hourly reminder + install guide

Settings → Cross-platform: a **notification + chime at the top of each hour** inside your logging window, with a Test button. And an **Install guide** that detects Android / iOS / desktop and gives the right steps, with your vault key shown so the new device joins the same vault.

---

## Deploy

1. Upload `index.html` + `sw.js`
2. Pull-to-refresh **2–3 times**
3. Badge should read **v2.1**
4. Optional: deploy `sync-worker.js` per the steps above

## Verify

1. Header shows a **☁ chip**; tap it → Sync & Devices with your vault key
2. Add a task → chip shows **1 pending** → **Sync now** → *All changes synced*
3. Open the same URL on your phone → Sync & Devices → paste the key → **Pair** → the task appears
4. Screen Time → enter 50 min social → **Doomscroll Rescue** fires
5. Habits → energy chart with suggested times at the top
6. Settings → Cross-platform block with both toggles

## Test coverage

98 automated checks across three suites, including **two simulated devices syncing through an in-memory backend** — run against *both* backend contracts:

- vault key format, device registration, pending counts
- create on A → appears on B; conflicting edits → newest wins on both
- delete on B → propagates to A (Worker) / documented resurrection (server.ts)
- dictionary merges (hourly logs from two devices coexist)
- offline: no request made, change queued, lands after reconnect
- unreachable endpoint → error state, no crash, no data loss
- snapshot save + restore, doomscroll thresholds and off-switch, peak-hour ranking, plus the full v11 dashboard still intact

## What was not changed

Every v11 feature — Right Now, Find, Day Ribbon, Reality Check, Garden, wind-down, Week Story, the six hubs — is untouched and still passing its own tests. v2.1 is a marked block at the end of the script; deleting it returns the app to v11.
