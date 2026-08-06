# Life OS v2.2 — Full AI Studio parity, minus Life Domains

**Replace in `Documents\life-os-pwa`:** `index.html`, `sw.js` (cache `life-os-v2-2-0`) · `sync-worker.js` unchanged from v2.1 · still ₹0

v2.1 brought across the four big pieces — cloud vault sync, doomscroll rescue, the peak-hour scheduler, hourly reminders. Going back through the source you re-shared, six smaller things were still missing from `theme.ts`, `RewardsView.tsx`, `HabitsView.tsx`, `SettingsView.tsx` and `PwaInstallBanner.tsx`. Those are now in, and Life Domains is out.

---

## Removed: Life Domains

Gone completely, not hidden:

- the **Life Domains panel** and its seven score sliders (`renderDomains`, `updateDomain`)
- the **domain ring** on the dashboard
- `S.domains` state, its localStorage key, its entry in the clear-data list
- its nav entries, CSS and hub listing

**What survives, deliberately:** the `domain` field on goals (your own text — Trading, Wellness) and on events. Those are user data, not the removed feature.

**One thing had to be rewired.** The Knowledge Graph read `S.domains.trading.score` for its Trading and P&L nodes. Rather than delete those nodes, they now compute from the **average progress of your actual goals** in that domain — a real number instead of a slider you had to drag yourself. Better data, no manual upkeep.

## 1 · Accent palette

`theme.ts` had a second theme layer we never had. Six accents — **Royal Indigo, Emerald Green, Warm Amber, Rose Crimson, Electric Violet, Cyberpunk Cyan** — in Settings → Appearance. It overrides the primary/secondary CSS variables, so every button, chart and highlight follows. Independent of dark/light/auto, which stays layer one.

## 2 · Preview a different time of day

The AI Studio "simulated time override", wired into the parts of our app that actually care about the clock: the **ambient wash**, the **greeting**, and **Right Now's reasoning**. Set a time in Settings, an amber bar appears at the bottom so you never forget it's on, and tapping it resets. Nothing is logged while previewing.

## 3 · Real install prompt

v2.1 only had an instructions modal. v2.2 captures `beforeinstallprompt`, so on Android Chrome you get an actual **Install** button on the home screen — one tap, real install, no menu-hunting. On iOS (where the browser gives no such event) it falls back to the Safari steps. The banner hides once installed, and dismissing it is remembered.

## 4 · Levels, badges, voice encouragement

From `RewardsView.tsx`, rescaled to our star economy (1 star per 3 honest check-ins, not 100 per level):

- **Seven level titles** — Initiate Seeker → Focus Novice → Task Warrior → Momentum Master → Zenith Achiever → Apex Performer → Grand Champion
- **Six badges**, each computed from real data: Task Warrior (10 done), Streak Titan (7-day streak), Deep Focused (25 stars), Level 5 Elite, Full Bloom (garden flowering), Scroll Escapee (used a rescue)
- **🔊 Say it out loud** — speech synthesis reads your level, stars, streak, tasks completed and your next task

## 5 · Smart habit reminders

The peak-hour engine now *acts* instead of just advising. Toggle it on and each habit gets a notification at its own learned hour — morning habits at your best morning hour, evening ones at your wind-down hour — and **only if it's still unticked** when that hour arrives. Each habit has a **Test** button next to its suggested time.

## 6 · Rescue + voice test buttons

Settings → Appearance: **Test rescue** fires the doomscroll intervention on demand (matching AI Studio's "Launch Rescue Intervention Test"), and **Test voice** plays the encouragement.

---

## Deploy

1. Copy `index.html` and `sw.js` into `Documents\life-os-pwa`, overwriting
2. Upload both (GitHub → Upload files → Commit, or drag onto Netlify)
3. Pull to refresh **2–3 times**
4. Badge must read **v2.2**

`sync-worker.js` is unchanged — if you already deployed it, leave it alone. Your data is untouched.

## Verify

1. Settings → **Appearance (v2.2)** → tap Emerald Green; the whole app shifts
2. Same card → set the time to 05:30 → background goes amber-dawn, amber bar at the bottom → tap it to reset
3. Grow → **Rewards** → level title, progress bar, six badges, **🔊 Say it out loud**
4. **Habits** → each suggested time has a **Test** button; toggle *Remind me at these times*
5. Settings → **Test rescue** → the intervention modal
6. Menu has **no Life Domains** anywhere, and the dashboard no longer shows the seven-domain ring

## Test coverage

**144 automated checks** across four suites, all passing:

| Suite | Covers |
|---|---|
| 1 (27) | hubs, Right Now, Find, ribbon, garden, wind-down, week story, panel coverage |
| 2 (16) | ribbon colouring, reality-check maths, garden growth and wilt, canvas render |
| 3 (57) | two simulated devices syncing, both backend contracts — conflicts, deletions, offline queue, error handling |
| 4 (44) | Life Domains fully removed, accents, sim time, install prompt, levels/badges/voice, habit reminders |

The conflict test was rewritten this round after it proved flaky: it had been setting `updatedAt` by hand, which the change-stamper correctly overwrites. It now tests the merge rule directly with explicit timestamps, *and* runs a real timed edit-sync-edit-sync sequence across two devices. Stable over repeated runs.
