# Life OS v6.4 — Themes + Nightly Journal + Hourly Prompt Controls

**2 files changed:** `index.html`, `sw.js`

---

## 1 · Theme: Dark / Light / Auto

**Two ways to switch:**
- **Header button** (next to ☰) — one tap cycles Dark → Light → Auto. The icon shows the current mode: 🌙 dark, ☀️ light, 🌗 auto.
- **Settings → Appearance** — pick explicitly, with a line confirming which theme is showing right now.

**Auto** follows your phone's system light/dark setting and switches the moment you change it. If your device doesn't report a preference, it falls back to the clock: light from 07:00 to 19:00, dark overnight.

The light theme is a full palette — backgrounds, borders, text, accent colours and shadows were all re-tuned rather than just inverted, so contrast stays readable in sunlight. Your choice is saved and included in backups. The browser's status-bar colour updates with it too.

---

## 2 · Nightly journal prompt

At **22:00** (configurable, 17:00–23:00) the app asks you to write the day's journal — and it opens with a **recap of your actual day** so you're not staring at a blank page: tasks completed, deep focus minutes, stars earned, and distraction time.

Three responses:
- **✍️ Write tonight's journal** — jumps straight to the Journal panel with the cursor in the first field
- **⏱ In 30 min** — asks again later
- **Skip tonight** — silent until tomorrow

It never nags: if you've already written a journal entry that day, the prompt won't appear at all. If notifications are enabled and the app is in the background, you get a system notification too.

*Bug fixed while building this:* journal entries were only stored with a human-readable date label, so "did I already write today?" checks were fragile. Entries now carry a machine-readable date key. Existing entries still work.

---

## 3 · Hourly log prompts — now their own setting

Previously the hourly prompt was tied to the check-in settings. It's now separate, in **Settings → Hourly Log Prompts**, exactly as you described:

- **On/off switch** — one tap if it gets annoying
- **Active window** — defaults to **07:00–22:00**
- **Frequency** — every 1, 2, or 3 hours (default: every hour)

Every hour within your window, the app asks what you did in the hour just gone, with the preset chips so it's two taps rather than typing. It skips any hour you've already logged and never asks twice about the same hour.

Check-in prompts (the "are you on your P1 task?" popup that earns stars) remain a separate setting below it, so you can run one without the other.

**None of the prompts interrupt you while typing** — that guard from v6.3 covers the journal prompt too.

---

## Deploy

**GitHub:** upload `index.html` and `sw.js` → Commit.
**Netlify Drop:** unzip `life-os-pwa.zip`, drag the folder onto your Deploys tab.

Then pull-to-refresh 2–3 times on your phone (cache is now `life-os-v6-4`).

---

## Verify

1. Tap the **🌙 button** in the header → switches to light; tap again → auto; again → dark
2. **Settings → Appearance** → all three options present, current theme named
3. Set your phone to light mode with Auto selected → app follows immediately
4. **Settings → Hourly Log Prompts** → toggle, set 7 to 22, every 1 hour, Save
5. **Settings → Nightly Journal Reminder** → toggle on, set hour, Save
6. After 22:00 with no journal written → the reflection popup appears with your day's recap
7. Write a journal entry → the prompt doesn't return that night
