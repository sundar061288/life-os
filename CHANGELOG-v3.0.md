# Life OS v3.0 — Tesseract speaks, and reacts to itself 🔮🔊

**Replace:** `index.html`, `sw.js` (cache `life-os-v3-0-0`) · icons unchanged

---

## 🔮 The tesseract now speaks the time/situation greeting

The greeting engine from v2.8–v2.9 was already fully built — resolved name, time-of-day bands, fifteen situational lines driven by your real data (streaks, P1 count, scroll time, etc.). What wasn't happening was **hearing it reliably**, which is what this round fixes at the root.

The cause: browsers block `speechSynthesis.speak()` until the page has had a genuine tap/click/key in that session. The boot greeting fired on a timer with no gesture behind it, so it was silently dropped — not broken, blocked. All speech now runs through one shared engine that **queues audio if unlocked hasn't happened yet, and plays it on the very first tap anywhere** — including the tap that dismisses the orb. You'll hear:

> *"Good morning, Boss. Ship v3.0 due at 9:00."*
> *"Welcome back, Boss — 9 days in a row, you're building something."*
> *"Still up, Boss? The tasks will keep until morning."*

Exactly the kind of situational lines you asked for last round — now actually audible.

## 🔊 Female, energetic voice

The Web Speech API has no standard gender field, so voice selection is a name-matching heuristic — Zira, Samantha, Aria, Jenny, anything containing "female," scored and ranked against the available system voices. "Energetic" is delivered as a faster rate (1.08×) and higher pitch (1.16×), the full extent of what this API can vary. **Settings → Neural Interface** now has a voice dropdown to override the guess if your device's voices don't match the heuristic, plus a **Test voice** button.

## 🌊 Speaking moves from inside to outside

This is new this round, and it's the part with real visual engineering in it. While the orb talks:

- **The whole structure breathes outward** — roughly double the pulse amplitude of listening/thinking mode, so speaking is unmistakably the most physically active state
- **Rings spawn at the centre and expand outward**, fading as they grow past the structure's edge — literally energy moving from inside to outside, timed to the voice
- Rings fire on real speech peaks (word-boundary events) **when the browser's TTS engine supports them** — and independently on a steady ~350ms heartbeat regardless, so the effect never depends on a feature some system voices don't implement

This applies to **both** orbs — the boot greeting and the voice-conversation orb — since they share the same rendering engine.

## ◈ Tesseract replaces the sphere as default

A real 4D hypercube, not a re-skinned sphere: **16 vertices**, one for every combination of (±1,±1,±1,±1), connected to the 4 neighbours that differ in exactly one coordinate — **32 edges** exactly, verified in tests. Two independent 4D rotation planes turn it continuously; projecting 4D → 3D → 2D each frame is what makes the inner and outer cubes visibly swap places as it spins — the signature tesseract look, distinct from the sphere's silhouette.

It's the default everywhere now. **Settings → Neural Interface → Orb shape** switches back to the sphere if you ever want it — nothing was deleted, both classes share the same reactive interface.

## 🔋 Energy logging: three buttons, not a slider

Both places you log hourly energy — the inline card in the Hourly panel, and the popup that appears when you tap a grey cell on the dashboard's day ribbon — now show **Low 😴 / Medium 🙂 / High ⚡** instead of a 1–10 range slider.

Under the hood they still store a plain number (3 / 6 / 9), so nothing downstream had to change — peak-hour analysis, the day ribbon colouring, insights, all keep working exactly as before. **Logs you made before this update aren't lost or shown blank** — an old value like 7 buckets correctly into "Medium" when you go back to edit it.

## 🔧 Also fixed: the persona picker

While extending the Settings orb-shape toggle, I found its CSS (`.mode-b`, `.mode-row`) had been accidentally deleted back in v2.4's cloud-sync removal — so the persona picker (Butler / Sidekick / Deadpan / Narrator) has been rendering as unstyled divs for several versions. Restored.

---

## 🚀 Deploy

1. Copy `index.html` + `sw.js` into `Documents\life-os-pwa`, overwriting
2. Upload, pull to refresh **2–3 times**
3. Badge reads **v3.0**

## 🔍 Verify

1. Open the app — the tesseract appears (not the sphere), rotates, greets you by name/Boss with a time-appropriate line
2. Tap anywhere — you should **hear** it, even if the greeting text finished typing before you tapped
3. While it's talking, watch the shape — it should visibly pulse outward and throw off expanding rings
4. Settings → Neural Interface → try the **voice dropdown** + **Test voice**, and toggle **Orb shape** to see the sphere
5. Hourly panel and the day-ribbon tap prompt both show **Low / Medium / High** buttons, no slider

## 🧪 Test coverage

**56 checks, all passing** — tesseract geometry (16 vertices, exactly 32 edges, edge-adjacency rule), the speaking-wave lifecycle (spawn on a level jump, move outward frame to frame, heartbeat fallback without relying on onboundary, cleanup so waves don't accumulate forever), the voice engine's gesture-unlock queue and female-voice scoring, the greeting actually reaching the TTS engine with the resolved name, both energy-button locations including legacy-value bucketing, the sidebar fix from last round (still holding), the restored persona CSS, and a broad regression pass across eight panels.

One honest note on process: the sandbox environment reset partway through this build, which is why this round shipped as one consolidated test file rather than the incremental per-feature suites from earlier versions. Coverage is equivalent for everything touched this round; it isn't a re-run of the full historical regression set.

## ↩️ Rollback

Re-upload your previous `index.html` + `sw.js`. Your data is untouched — energy values already stored as 3/6/9 are ordinary numbers and remain fully readable by the old slider-based UI too.
