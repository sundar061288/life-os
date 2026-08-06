# Life OS v2.4 — Cloud sync removed

**Replace in `Documents\life-os-pwa`:** `index.html`, `sw.js` (cache `life-os-v2-4-0`)
**Delete:** `sync-worker.js` — no longer used. If you deployed the Cloudflare Worker, you can delete that Worker and its KV namespace too.

Everything else from v2.1 → v2.3 stays exactly as it was. The app is now fully local: no server, no vault key, no account, no network calls of any kind.

---

## What came out

| Removed | Was |
|---|---|
| Cloud Vault identity | Vault key `VAULT-######`, device registry |
| Change tracking | `updatedAt` stamping, tombstones, hash snapshots |
| Sync engine | 3 backends, bi-directional merge, offline queue, auto-sync |
| Sync & Devices panel | The whole panel, plus its entry in the Review hub |
| Header cloud chip | The ☁ status pill next to the clock |
| Cloud backup | The "☁️ Cloud backup" button |

That's roughly **17,000 characters** of sync machinery gone. A full sweep confirms zero remaining references to `SYNC`, `vaultId`, `cloudSync`, `renderSync`, `mergeCollection`, tombstones or device registration.

## What was kept, and why

**Local snapshot backups survived** — they were tangled up in the sync code but were never actually a cloud feature. Three rolling on-device snapshots, now living in **Settings → Local Backups** with Save / Restore / Delete. Nothing leaves your browser.

One change was needed: restore used to merge by `updatedAt` timestamps, which came from the sync layer. It now does a **union merge** — items already on your device are kept, anything missing from the snapshot is added back. Simpler, and right for a restore, where you're recovering things rather than resolving a conflict between two devices.

**Export / Import is untouched** and remains your way to move data between devices — export a JSON file, import it on the other one.

## Knock-on changes

Four places referenced the vault and had to be reworded rather than deleted:

1. **Settings card** — "Cross-platform (v2.1)" is now **"Focus & Reminders (v2.1)"**; the vault key row is gone, Doomscroll rescue and the hourly reminder are unchanged
2. **Install guide** — dropped the "same vault key keeps both in sync" line; the desktop step now points at Export instead
3. **Demo mode** — shipped in v2.3 with four safeguards, one of which was *parks it on a separate vault key, pauses cloud sync*. That safeguard is retired because there's no longer a cloud to protect. **The other three still hold:** typed `DEMO` confirmation, automatic export before anything changes, and one-tap restore with the red banner
4. **Review hub** — with Sync gone, the hub was left listing Settings twice. Fixed: Time Audit / Expenses / Settings, with Feedback under More

## Deploy

1. Copy `index.html` + `sw.js` into `Documents\life-os-pwa`, overwriting
2. Upload both, wait ~60 s
3. Pull to refresh **2–3 times**
4. Badge must read **v2.4**

Your data is untouched. Old sync keys (`vaultId`, `syncCfg`, `tombstones`, `syncSnap`) are simply ignored and orphaned in localStorage — harmless, a few hundred bytes. Clear All Data would remove them, but there's no reason to.

## Verify

1. Badge reads **v2.4**
2. Header shows the **🛡 rescue chip** and the clock — **no ☁ chip**
3. Hubs → **Review** contains Time Audit, Expenses, Settings — **no Sync**
4. Settings → **Local Backups** → Save a snapshot → it appears with a Restore button
5. Settings → **Focus & Reminders (v2.1)** — rescue toggle, threshold, hourly reminder all still work
6. Airplane mode: everything works, nothing tries to reach a network

## Test coverage

**142 checks across four suites, all passing.**

| Suite | Checks | Covers |
|---|---|---|
| 1 | 27 | hubs, Right Now, Find, ribbon, garden, wind-down, week story, panel coverage |
| 2 | 16 | ribbon colouring, reality-check maths, garden growth and wilt |
| 4 | 46 | domains removal, accents, sim time, install, levels, habit reminders, **no cloud globals leaked** |
| 5 | 53 | all five v2.3 phases, demo safeguards, **local snapshot save/restore/delete** |

New assertions this round check that `PANELS_DEF` no longer contains `sync`, that `SYNC` / `cloudSync` / `renderSync` are undefined, and that the Settings panel contains no "cloud" or "vault" text anywhere.

**Suite 3 was retired.** Its 57 checks simulated two devices syncing through an in-memory backend — conflicts, deletions, offline queueing. With sync gone, so is what it tested. It's kept as `test3-RETIRED-cloudsync.js.bak` should you ever want sync back.

## Rollback

1. **Re-upload v2.3's `index.html` + `sw.js`** — two minutes, data unaffected, and your old vault key is still in localStorage so sync would resume where it left off
2. The v2.1 layer header now reads `LIFE OS v2.1 — FOCUS LAYER`; the sync code was cut rather than commented out, so restoring it means going back to the v2.3 file

As always: **Settings → Export Data** before deploying.
