# Life OS v2.9 — Sidebar fix 🔧 + situational greetings 🎯

**Replace:** `index.html`, `sw.js` (cache `life-os-v2-9-0`) · icons unchanged

⚠️ **Your screenshot didn't come through** — the attachment wasn't in the message I received. I found and fixed the bug from your description anyway, and it reproduces exactly what you described: tap ☰, get a blurred screen with nothing usable. If what you saw was something else, tell me and I'll look again.

---

## 🔧 The sidebar bug — my fault, from v2.7

When I added the ambient time-of-day wash, I gave it `z-index: 0` and then lifted the app's wrappers above it:

```css
body::before { … z-index: 0 }                        /* the wash */
#top, #shell, #bnav { position: relative; z-index: 1 }  /* lift content above it */
```

That second line is the bug. `z-index: 1` on `#shell` **creates a stacking context**, and every descendant is then confined inside it — no matter how high its own `z-index` goes. The mobile sidebar lives inside `#shell` at `z-index: 350`; the dark blurred backdrop is a direct child of `<body>` at `z-index: 340`.

Ordinarily 350 beats 340. But 350 was trapped inside a context whose own value was 1, so the whole drawer rendered **beneath** the backdrop. You got the blur, the sidebar was there, and it was painted behind an opaque-ish overlay you couldn't see through. Tapping the blur closed it — which is why it looked like nothing was happening rather than obviously broken.

**The fix is one character.** The wash moves to `z-index: -1`, which paints it behind all content while still sitting above the page background — so no wrapper needs a `z-index` at all, and the stacking context disappears:

```css
body::before { … z-index: -1 }
#top, #shell, #bnav { position: relative }   /* no z-index */
```

Tests now assert the drawer's z-index exceeds the backdrop's *and* that no wrapper carries a trapping `z-index` — so this can't silently come back the next time something needs layering.

## 👔 Boss is now the default

v2.8 rotated all twenty titles equally, so "Boss" appeared about 5% of the time. It's now the house default at **70%**, with the other nineteen as seasoning — frequent enough to stay fresh, rare enough that Boss reads as your name rather than one of a list.

**A name in Settings still wins outright.** Set one and you'll never see an honorific.

## 🎯 Situational greetings

You asked for greetings driven by what you actually do in the app, not the clock. Fifteen situations now read the app's own record, ranked by priority — the highest match leads, and each has 2–3 phrasings picked at random:

| Situation | Example |
|---|---|
| First ever | *Right then, Boss. Let's set this up.* |
| Back after days away | *Boss. 8 days. I kept everything exactly where you left it.* |
| 30+ day streak | *34 days unbroken, Sundar. That's not discipline any more, that's just who you are.* |
| Week streak | *9 days straight, Boss. The machine is running.* |
| Streak broken | *The garden's gone dry, Boss. One log today and it's back.* |
| After midnight | *Still up, Boss? The tasks will keep until morning.* |
| Over the scroll limit | *80 minutes gone to the scroll today, Boss. Shall we get something back?* |
| 3+ focus sessions | *4 sprints deep, Sundar. You're in the zone — mind if I stay out of the way?* |
| 3+ P1s open | *3 P1s waiting, Boss. Start with: Pre-market scan.* |
| Board cleared | *Nothing left on the list, Boss. That's a rare sight.* |
| One task left | *Just the one, Boss. Ship v2.9 and you're clear.* |
| Already wound down | *Day's already closed off, Boss. This is bonus time.* |

If the same situation is still top two opens running, the second-ranked one speaks instead — a 40-day streak shouldn't produce the same sentence 40 times.

**Trade-off worth stating plainly:** situational lines take precedence over the persona voice, so when one matches, all four personas say the same thing. Persona now governs the **clock-based fallback** — what you hear when nothing notable is going on. I'd rather the greeting be specific than in-character; if you'd prefer persona-flavoured variants of all fifteen situations, that's a bigger writing job and I'll do it on request.

## 🚀 Deploy

1. Copy `index.html` + `sw.js` into `Documents\life-os-pwa`, overwriting
2. Upload, pull to refresh **2–3 times**
3. Badge reads **v2.9**

## 🔍 Verify

1. Tap **☰** — the sidebar slides in over a dimmed background, fully usable. Tap the dim area to close
2. Clear your name in Settings → next greeting calls you **Boss**
3. Add three P1 tasks, reopen → the greeting counts them and names the first
4. Complete everything → *"Board's clear, Boss."*

## 🧪 Test coverage

**365 checks across nine suites, all passing.** Suite 10 is new (30 checks): the stacking fix asserted from the CSS itself, drawer open/close behaviour, the 70% Boss share measured over 400 draws, and each situation firing on its own state — plus 40 consecutive greeting rolls checked for unfilled `{tokens}`.

Three v2.8 assertions were rewritten rather than deleted, since v2.9 legitimately changed their contract: the honorific bag is no longer an equal-share rotation, and personas no longer differ once a situation matches.
