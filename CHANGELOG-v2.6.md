# Life OS v2.6 — Focus keeps running ⏱ + emoji pass 🎨

**Replace:** `index.html`, `sw.js` (cache `life-os-v2-6-0`) · icons unchanged from v2.5

---

## 🐛 The focus timer bug — what was actually wrong

Your diagnosis was right, and here's the mechanism.

The timer ran on `setInterval(…, 1000)` and **subtracted one second per tick**. Browsers deliberately throttle background tabs to roughly **one tick per minute** to save battery. So a 25-minute session left running in a background tab advanced by about 25 *seconds* in ten minutes — then appeared to "resume" the instant you came back and normal ticking returned.

It was never pausing. It was **losing time it could never get back**, which is worse — every session you worked through in another tab was undercounted, and so were your deep-work minutes.

## ✅ The fix — wall-clock, not tick-counting

The timer now records **when the session ends** and derives the remaining seconds from `Date.now()` on every tick. Throttling becomes irrelevant: one tick a minute or sixty, the maths gives the same answer.

Four things follow from that:

1. **Background tabs count fully.** Ten minutes away is ten minutes off the clock. Verified in tests by simulating a tab that fires no ticks at all for ten minutes.
2. **Instant resync.** On `visibilitychange`, window focus, and `pageshow`, the clock recomputes immediately — no catch-up animation.
3. **Survives a reload.** The finish time is saved, so if the browser unloads the page (common on mobile), reopening restores the session with the correct time left and the task name. An already-expired session isn't restored.
4. **Deep-work minutes are credited on real elapsed time**, not tick count, so your Time Audit stops undercounting.

## ⏱ Two related changes

**Closing the overlay no longer stops the session.** It used to call `pauseFocus()` — so tapping outside quietly killed your Pomodoro. Now it just hides, with a toast confirming the session is still running.

**A running-focus chip** sits in the header showing `⏱ 14:32`, counting down wherever you are in the app. Tap it to reopen the timer. It disappears when the session ends.

**Completion reaches you in the background** — browser notification, chime and vibration, not just an in-app toast you'd never see.

## 🎨 Emoji pass

Emojis added across the interface:

- **Every panel header** — 🏠 Home, ✅ Tasks, 🎯 Goals, 🔁 Habits, 🌱 Garden, 📝 Journal, ⏳ Hour Log, 📱 Screen Time, 😴 Sleep, ⭐ Rewards, 📊 Time Audit, ⚙️ Settings, and the rest
- **Dashboard cards** — ⚡ Right now, 🧭 Priority Matrix, 🔴 P1 · Must do today, 🎞️ Your day so far, 🪞 Reality check, 📈 This week, 🕒 Today's Timeline
- **Nudges** — 🔥 Streak Protection, 🧠 Deep Work Nudge, 🌿 Energy Care, 🎯 Priority
- **Settings and panels** — 🔔 Focus & Reminders, 🎨 Accent & Preview, 🏆 Badges, 🛡️ Doomscroll shield, 🔋 Your energy by hour, 💧 What waters it, 🌙 Close the day, ✨ the Find bar

Headers are tagged once and marked, so re-rendering a panel never stacks duplicates — tested.

## 🚀 Deploy

1. Copy `index.html` + `sw.js` into `Documents\life-os-pwa`, overwriting
2. Upload both, wait ~60 s
3. Pull to refresh **2–3 times**
4. Badge reads **v2.6**

## 🔍 Verify the fix yourself

1. Start a focus session, note the time remaining
2. Switch to another browser tab and work there for **5 minutes**
3. Come back — it should show **5 minutes less**, not 5 seconds less
4. While it runs, close the overlay: the ⏱ chip stays in the header, still counting
5. Reload the page mid-session: it comes back with the right time and a "resumed" toast

## 🧪 Test coverage

**217 checks across six suites, all passing.** Suite 7 is new (35 checks) and covers the timer specifically — it freezes the clock to simulate a throttled tab firing zero ticks, then verifies the countdown, deep-work credit, resync, background completion with notification, reload restore, expired-session handling, and that pause still holds time without draining.

One regression caught and fixed during this build: the emoji pass renamed "Your energy by hour", which broke the v2.2 code that injected the confidence badge by matching that exact string. Caught by the existing suite, fixed, re-verified.

## ↩️ Rollback

Re-upload v2.5's `index.html` + `sw.js`. Your data is untouched. Note that any focus session running at the moment you roll back will be forgotten, since v2.5 has no concept of a persisted session.
