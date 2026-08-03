# Life OS v7 — Voice Input & Natural Language Capture

**2 files changed:** `index.html`, `sw.js`

Your observation is right: people won't type. Typing is where tracking apps die. v7 makes speaking the default way to get anything into the app.

---

## 1 · Voice input everywhere

A **🎤 button** now sits beside every text field: tasks, hourly log, journal (all four fields), weekly review, goals, events, sleep notes, AI memory, and Quick Capture.

- Tap it and speak — words appear in the field as you talk
- Tap again to stop; the button pulses red while listening
- Dictation **appends** to whatever is already there, so you can type a bit and speak the rest
- Journal and Capture use continuous mode — you can pause to think without it cutting off
- Language is set to Indian English (`en-IN`) for better accuracy with local names

Works in Chrome on Android and Safari on iPhone (iOS 16+), over HTTPS. If a browser doesn't support it, the mic buttons simply don't appear rather than breaking anything.

---

## 2 · Quick Capture — speak your whole day at once

A new panel (**🎤 Capture**), reachable three ways: the floating mic button above the bottom bar, the Capture quick-action on the dashboard, or More → Capture. The floating button starts listening immediately.

Speak or paste everything in one go. Life OS parses it into structured entries. **Your exact example now produces:**

| What you said | What it creates |
|---|---|
| *morning need start exercise at 5AM set reminder, set alarm at 4.45am* | Task "Start exercise" · **05:00** · ⏰ reminder **04:45** · Health |
| *morning need to drop kids on school - 9AM* | Task "Drop kids on school" · **09:00** · Family |
| *Morning purchase vegetables in super market* | Task "Purchase vegetables in super market" · **08:00** (from "morning") · Home |
| *Purchase cooking oil in instamart at - 11am* | Task "Purchase cooking oil in instamart" · **11:00** · Home |
| *Evening pick kids on school - 3pm* | Task "Pick kids on school" · **15:00** · Family |
| *evening music class at 5PM* | Task "Music class" · **17:00** · Learning |
| *set an appointment to doctor at 8pm. set reminder at 7:45pm* | Task "Appointment to doctor" · **20:00** · ⏰ reminder **19:45** · Personal |

**What the parser understands:**
- **Times** in any format — `5AM`, `4.45am`, `7:45 pm`, `11am`, `15:30`
- **Vague times** — "morning" → 08:00, "afternoon" → 15:00, "evening" → 18:00, "night" → 21:00 (only when no clock time is given, so "evening ... 3pm" correctly uses 15:00)
- **Separate reminder times** — it distinguishes the task time from the alarm time, so "exercise at 5AM, alarm at 4.45am" gives a 05:00 task with a 04:45 reminder, not the other way round
- **"set reminder" with no time** → defaults to 15 minutes before
- **Category** from context — exercise/gym → Health, kids/school → Family, vegetables/supermarket/instamart → Home, doctor → Personal, music class → Learning, meeting/client → Work, trade/market → Trading, pay/EMI → Finance
- **Priority** — "urgent", "must", "important" → P1; "someday", "later" → P3
- **Type** — lines starting with "my goal is…" become **Goals**; "idea…" or "note down…" become **Ideas** in AI Memory; everything else is a task

**Nothing saves without your approval.** You get an editable review list — fix any text, change the time, adjust priority or type, untick anything wrong — then tap "Add to Life OS".

---

## 3 · Reminders

Tasks now carry a due time (shown as a blue badge in the task list, with ⏰ if a reminder is set) and sort by priority then time.

When a reminder is due, a popup appears with three options: **✓ Done** (completes the task), **⏱ 10 min** snooze, or Dismiss. Your phone vibrates, and if notifications are enabled and the app is backgrounded you also get a system notification.

**Honest limitation:** reminders fire while the app is open or recently backgrounded. A fully closed PWA cannot be woken by the browser — that requires the native Android build, which is exactly what Phase 2 of the roadmap unlocks. For now, keep Life OS open in a tab during the day, or treat reminders as in-app prompts rather than alarm-clock replacements.

---

## Deploy

**GitHub:** upload `index.html` and `sw.js` → Commit.
**Netlify Drop:** unzip `life-os-pwa.zip`, drag the folder onto your Deploys tab.

Then pull-to-refresh 2–3 times (cache is `life-os-v7-0`).

**First run will ask for microphone permission** — tap Allow. On iPhone, Safari asks once per site.

---

## Verify

1. Tap the **floating 🎤 button** above the bottom bar → Capture opens and starts listening
2. Say your whole morning list in one breath → tap **✨ Sort it out**
3. Check the review list — times, reminders and categories should be filled in
4. Untick anything wrong, edit the text, then **Add to Life OS**
5. Tasks tab → items appear with time badges, sorted by priority then time
6. Go to any journal field → tap 🎤 → speak a sentence → it appears
