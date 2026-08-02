# Life OS — Architecture Plan for the Full Web + Mobile Product

*(For after your one-month personal validation. This is the "build it properly" plan.)*

## The core principle: one brain, two faces

The mistake most people make is building the web app and the mobile app twice. You build **one data engine** and **two interfaces** on top of it.

```
                    ┌──────────────────────────┐
                    │   SHARED CORE (one copy) │
                    │  · data model            │
                    │  · tracking engine       │
                    │  · scoring / analytics   │
                    │  · sync layer            │
                    └────────────┬─────────────┘
                     ┌───────────┴───────────┐
          ┌──────────▼─────────┐   ┌─────────▼──────────┐
          │  WEB — Console     │   │  MOBILE — Capture  │
          │  Analyse & plan    │   │  Log & act         │
          │  Big screen, mouse │   │  Thumb, 10 seconds │
          └────────────────────┘   └────────────────────┘
```

**The split that makes this work:** mobile is for **capture and nudging** (you're out in the world, one thumb, 10 seconds). Web is for **analysis and planning** (you're sitting down, big screen, thinking). Same data, opposite jobs. Never try to show the web dashboard on the phone.

## What goes where

| | **Web console (detailed)** | **Mobile (minimal)** |
|---|---|---|
| **Primary job** | Understand + decide | Log + get nudged |
| Dashboard | Multi-panel grid, 12-month heatmaps, correlation charts, side-by-side comparisons | One screen: nudge card, 4 quick buttons, today's number, star strip |
| Time analysis | Full audit: hour-by-hour heatmap, category drill-down, week-over-week deltas, energy-vs-output correlation | Today's distraction total + one 7-day sparkline |
| Tasks | Kanban board, bulk edit, drag priority, project grouping | Flat P1 list, tap to complete |
| Screen time | Trend over months, app-level breakdown, yearly cost model, goal-cost tradeoff | Today's entry form + one number |
| Planning | Full week grid, goal cascade tree, decision journal with outcome scoring | "What's my P1 today" |
| Reviews | Weekly/monthly/quarterly review workflows, export reports | Nightly 4-question journal |
| Notifications | — | Check-in popups, hourly log prompts, streak protection |

**Design rule for mobile:** if a screen needs more than one thumb-scroll to be useful, it belongs on web.

## Recommended technology stack

| Layer | Choice | Why |
|---|---|---|
| Shared core | **TypeScript** package (data model, scoring, sync) | Written once, imported by both apps |
| Web | **React + Vite + Tailwind + Recharts** | Fast, best-in-class charting for the console |
| Mobile | **React Native (Expo)** | Shares TypeScript logic with web; real native app; Expo handles builds without a Mac for Android |
| Local DB (both) | **SQLite** (expo-sqlite / wa-sqlite on web) | Removes the 5 MB browser ceiling entirely — gigabytes available, real queries |
| Backend | **Supabase** (Postgres + Auth + Realtime + Edge Functions) | Free tier is generous; row-level security; you already know the model |
| Sync | Offline-first, last-write-wins per day-record | App keeps working with no internet; syncs when it returns |
| AI coach | Supabase **Edge Function** proxying Anthropic API | Key stays server-side, never in the app |

**Why not Capacitor now?** Capacitor was the right answer for wrapping your existing HTML quickly. For a properly built product, **React Native gives you true native performance, real background tasks, and — critically — Android's `UsageStatsManager`**, which is the only way to read social media / OTT time automatically.

## The automatic screen-time feature (your core purpose)

This is the single strongest reason to go native:

- **Android:** `UsageStatsManager` with the `PACKAGE_USAGE_STATS` permission returns per-app foreground time. The user grants it once in system settings. You get Instagram: 94 min, YouTube: 63 min — automatically, every day, no typing. **This is fully achievable.**
- **iOS:** Apple does not expose this. The closest is the *Screen Time API* (`DeviceActivity` / `FamilyControls`), which can enforce limits and report *categories* but not hand you a clean per-app number, and requires a special entitlement. **Plan for manual entry on iOS permanently**, automatic on Android.

Build Android first. That asymmetry is worth designing around, not fighting.

## Migration path (your data survives)

The v6 export JSON is deliberately the same shape as the future schema. When you build the real app: import your one month of JSON on first launch, and every day you logged carries forward. Nothing you record now is wasted.

## Phased build (realistic solo timeline)

| Phase | Weeks | Output |
|---|---|---|
| 0 · Validate | 4 | v6 daily use + friction journal *(you are here)* |
| 1 · Core | 2–3 | TypeScript data model + scoring engine, ported from v6, with tests |
| 2 · Mobile MVP | 4 | Expo app: capture, check-ins, notifications, SQLite, **Android auto screen time** |
| 3 · Sync | 2 | Supabase schema, auth, offline sync |
| 4 · Web console | 3–4 | React dashboard, deep analytics, planning workflows |
| 5 · Polish + ship | 3 | Play Store internal → closed test (14 days) → production |

**~4 months of evenings.** Web console deliberately comes *after* mobile — mobile is where the data comes from, and there's nothing to analyse until it's flowing.

## Cost at each stage

- Phases 1–4: **₹0** (all free tiers, Expo builds free for Android)
- Play Store: **₹2,100 once**
- App Store: **₹8,300/year** + Mac access — only if iOS demand is real
- Supabase: free until ~50 users, then ~₹2,000/month

## What to decide at the end of your month

1. Did you log screen time most days? → **yes** = automatic tracking is worth going native for
2. Did the check-in popups help or annoy? → tune frequency before rebuilding
3. Which panels did you never open? → delete them, don't port them
4. Did you want the big picture on a laptop? → that's your web console requirement, confirmed by evidence

Build the second version from your own usage data, not from what sounds good today.
