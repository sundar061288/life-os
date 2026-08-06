# Life OS v2.5 — Trimmed down

**Replace:** `index.html`, `sw.js` (cache `life-os-v2-5-0`), `icon-180.png`, `icon-192.png`, `icon-512.png`
**Delete:** `sync-worker.js` if it's still in the folder

---

## Removed

**Whole sections gone** — panel, nav entry, hub listing and render code:

| Removed | Note |
|---|---|
| AI Coach · AI Memory · AI Assistant settings card | All AI-facing UI |
| Knowledge Graph | |
| Burnout | The "energy care" nudge now points at Sleep instead |
| Expenses | |
| Week Story | Also out of the Find bar |
| Data tools (demo data + download app file) | |
| Local Backups | Export / Import in Settings is untouched |
| Install guide button in Settings | The install banner still appears on mobile |
| High / Medium / Low energy button | Gone from the header |

**Version numbers stripped** from every heading — "Focus & Reminders", "Accent & Preview", "About Life OS". The badge now reads **v2.5** and that's the only place a version appears.

## Changed

**Icon is now a plant** — a white two-leaf sprout on the indigo-violet tile, at 180/192/512. The header logo is a 🌱 in place of the L.

**Clock is 12-hour** — `03:55:18 AM`, top right.

**Dashboard order** is now what you asked for: **tasks first** (Right Now, then your P1 list), **then the garden**, then the day ribbon and reality check.

**Insights is gated.** Hidden entirely until you have **7 days of data**. At that point it appears in the Grow hub and a one-line summary shows on the dashboard — sharpest hour, average scroll time, tasks finished — with a link into the full panel. Right now you're below the threshold, so you won't see it yet. That's intended.

## Priority Matrix — how it fills

You asked, so here it is: **it sorts by each task's category, not by its P1/P2/P3 priority.**

| Quadrant | Fills from |
|---|---|
| DO NOW | Trading, Deep Work |
| SCHEDULE | Learning, Body, Mind |
| DELEGATE | Admin |
| DONE TODAY | Anything completed |

So a task only lands in a quadrant if its category matches — set the category when you add it, or the task won't appear in the matrix at all. I've added that explanation as a line inside the card so you don't have to remember it. Its "Full →" link used to go to Goals, which was wrong; it now opens Tasks.

## One decision you should know about

Removing Expenses and AI Memory left the voice capture with **three destinations that no longer exist** — "I spent 700 rupees" routed to Expenses, "my daughter likes drawing" routed to Memory. Left alone, those captures would have saved into panels you can't open: silently lost.

They now route to the **Journal** instead, so nothing disappears. The capture review dropdown offers Task / Goal / Journal only. If you'd rather they became tasks, that's a one-line change.

## Deploy

1. Copy `index.html`, `sw.js` and the three `icon-*.png` files into `Documents\life-os-pwa`, overwriting
2. Upload all five, wait ~60 s
3. Pull to refresh **2–3 times**
4. Badge reads **v2.5**, logo is a sprout

For the icon to change on your phone home screen you may need to remove and re-add the app — Android caches the old one aggressively.

## Verify

1. Header: 🌱 logo, **v2.5**, 12-hour clock, **no energy button**
2. Dashboard: Right Now → P1 tasks → **garden** → ribbon
3. Priority Matrix shows the category explanation
4. Hubs: no AI Coach, Memory, Graph, Burnout, Expenses, Week Story
5. Settings: no AI card, no version numbers, no Data tools / Local Backups / Install guide
6. Grow hub has Garden + Rewards only — Insights appears after a week of logging

## Test coverage

**182 checks across five suites, all passing.** Suite 6 is new (44 checks) and covers every removal, the plant logo, 12-hour clock, dashboard ordering, the insights gate at both ends of the 7-day threshold, and that capture reroutes rather than loses data.

## Rollback

Re-upload v2.4's `index.html`, `sw.js` and icons. Your data is untouched — removing a panel never deletes what it stored, so your expenses, AI memories and burnout scores are all still in localStorage if you ever restore those panels.
