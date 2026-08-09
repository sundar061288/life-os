# Life OS v2.7 — Neural Interface 🧠

**Replace:** `index.html`, `sw.js` (cache `life-os-v2-7-0`) · icons unchanged

---

## 🌐 The orb

A rotating dot-brain, drawn on canvas: **88 nodes placed on a sphere** using a Fibonacci spiral (so they're evenly spread rather than clumping at the poles), rotated in 3D and projected to 2D every frame. Nodes closer than a set distance are wired together; depth drives the size, brightness and line opacity, so the far side of the sphere recedes and you read it as a solid rotating object rather than a flat scatter.

Two things make it cheap enough for a phone:

- **Edges are computed once**, at build time. They're fixed on the sphere, so per-frame work is only rotate → project → draw.
- **One canvas, no DOM elements per node.** 88 dots as divs would thrash layout; as canvas arcs it's a few hundred draw calls.

It picks up your **accent colour** from the CSS variables, so it turns emerald or cyan with the rest of the app. It also honours `prefers-reduced-motion` — near-still, no typewriter.

## 👋 On open — the greeting

Once a day, the orb fills the screen with:

- **`Good morning, Sundar.`** — greeting word from the clock, name from your Settings profile, typed on
- **A three-line brief** — open tasks with P1 count, the next task with a time on it, and your garden streak
- **Two buttons** — *Show me today* (opens Tasks) and *🎤 Speak* (straight into voice mode)

Tap anywhere to dismiss; it auto-closes after 14 seconds.

The brief is capped at **three lines on purpose**. A longer one becomes something you skip, and a greeting screen you skip is just a delay between you and your tasks.

**Once a day, not every open.** Reloading the app ten times shouldn't mean ten greetings.

## 🎤 Voice mode

The mic button now opens a **smaller orb that reacts to you** — it changes colour and state as it works:

| State | Colour | What's happening |
|---|---|---|
| listening | green | mic open, orb pulsing to your speech confidence, live transcript below |
| thinking | amber | rotating faster while it parses |
| speaking | violet | pulsing in time with the spoken reply |

**Questions get answered out loud**, and nothing is saved:

- *"What's on today?"* → "2 tasks open, 1 priority one. Start with Pre-market scan."
- *"How's my garden streak?"* → "Your garden is at Leafy, 12 day streak."
- *"How much screen time today?"* → "40 minutes of scrolling, against a 45 minute limit."
- *"Start a focus session"* → confirms, then opens the timer

**Everything else goes through the capture parser you already have** — same segmentation, same intent routing, one brain rather than two — then it speaks the confirmation back: *"Saved 2 tasks and 1 journal entry."*

## ⚙️ Settings

**🧠 Neural Interface** — toggle the greeting orb, toggle speech, and buttons to preview the orb or jump into voice mode any time.

## ⚠️ One honest limitation

**Browsers block speech synthesis until you've interacted with the page.** On a cold open the greeting may be silent the first time — the text is always fully readable, and any tap unblocks audio for the session. This is a browser policy, not something the app can work around. Voice replies inside voice mode always work, because opening it *is* a tap.

Speech recognition needs **Chrome or Safari on iOS 16+**. Elsewhere the orb still opens and says so plainly instead of failing silently.

## 🚀 Deploy

1. Copy `index.html` + `sw.js` into `Documents\life-os-pwa`, overwriting
2. Upload both, pull to refresh **2–3 times**
3. Badge reads **v2.7**

## 🔍 Verify

1. Open the app — the orb appears with your name and today's brief
2. Reload — it does *not* reappear (once a day)
3. Settings → Neural Interface → **Preview orb** to see it on demand
4. Tap 🎤 → orb goes green, say *"what's on today"* → spoken answer
5. Say *"remind me to call the office at 4"* → saved, confirmation spoken
6. Settings → Accent → Emerald → preview the orb again: it's green now

## 🧪 Test coverage

**267 checks across seven suites, all passing.** Suite 8 is new (50 checks): sphere geometry, precomputed edges, draw calls, level clamping and decay, the greeting's task maths, once-a-day gating, the off switch, both voice paths, and the state machine.

Two real bugs were caught while building this:

1. **The orb threw on browsers without canvas**, taking the whole boot sequence down with it. It now detects a missing context and degrades to a static screen.
2. `class` declarations don't attach to `window` in a classic script, so the orb wasn't reachable from other layers. Now explicitly exposed.

Two older suites also needed updating — their canvas stubs predated the orb, and one counted speech utterances that the greeting now adds to.

## ↩️ Rollback

Re-upload v2.6's `index.html` + `sw.js`. Or just switch the greeting off in Settings — the app underneath is unchanged.
