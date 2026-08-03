# Life OS v6.3 — Keyboard Fix + Sleep Log + Editable Presets

**2 files changed:** `index.html`, `sw.js`

---

## 1 · The keyboard bug — my fault, from v6.1

**What happened:** you tap a text field, the keyboard starts to appear, then instantly disappears and you can't type.

**Cause:** in v6.1 I added a viewport listener to fix the rotation problem. But phones fire a viewport resize event *when the keyboard opens* — the visible area shrinks. My handler couldn't tell the difference between "the user rotated the phone" and "the keyboard appeared", so it re-rendered the panel, destroyed the input element you had just tapped, and the keyboard closed with it. Every text field in the app was affected.

**Fixed:**
- The handler now only reacts to a genuine **width or orientation change**. Height-only changes (keyboard, browser chrome) are ignored completely.
- It never re-renders while a field is focused, even during a real rotation.
- The check-in and hourly popups no longer interrupt you mid-typing — they wait until you're done.
- Tapped fields now scroll into view above the keyboard.
- Added a regression test that types into a field, simulates the keyboard opening, and fails if the text or focus is lost.

**Related bug found while testing:** on the new Sleep panel, tapping a quality button wiped the times you'd already entered. Same root cause (unnecessary re-render). Now updates in place.

---

## 2 · Sleep Log & Audit — new panel

Found under **More → Sleep**, or the sidebar under Intelligence.

- **Log on waking:** bed time, wake time, hours (auto-calculated from the times, including past-midnight), quality 1–5 with emoji, and an optional note
- **14-day chart** colour-coded against your target, with average hours, average quality, and accumulated **sleep debt**
- **Sleep → Energy correlation:** once you have a few nights logged alongside your energy check-ins, it computes the actual relationship — for example *"On 7h+ nights your average energy is 7.4/10; on short nights it drops to 5.1/10 — a 45% difference."* This is your own data, not a generic claim
- Configurable target hours
- Sleep is now included in the AI Coach's context and in exports

Sleep is the strongest predictor of next-day energy, so this feeds the correlation engine better than almost anything else you log.

---

## 3 · Focus activities are now yours to edit

You were right that the list was built around my assumptions about your day. The dropdown in Focus Mode now has two extra options at the bottom:

- **＋ Add new activity…** — type any name, it's saved permanently
- **✎ Rename / delete…** — pick an item by number, then either type a new name or type `DELETE` to remove it

The defaults are now generic (Deep Focus Session, Priority Work Block, Study / Learning, Admin & Email, Reading, Exercise / Training, Planning & Review, Creative Work) rather than trading-specific. Your custom list is saved and included in backups. Focus Mode also now defaults to your top P1 task if you have one.

---

## 4 · Urban-life routines — six presets instead of three

The Daily Planner previously assumed a trader's day. Now you pick the routine that matches your life:

| Preset | Built for |
|---|---|
| **Office** | Standard workday — commute, deep work blocks, batched meetings, family evening |
| **WFH** | Work from home — no commute, hard stop boundary, step-outside reminder |
| **Trading** | Your original routine — sadhana, market analysis, execution, review |
| **Student** | Study blocks, classes, revision, 8h sleep target |
| **Busy** | Compressed high-pressure day |
| **Survival** | Crisis mode — one priority only |

Your choice is remembered between sessions.

**Task categories expanded** for normal life: Work/Office, Admin/Errands, Health/Fitness, Family/Social, Home/Chores, Finance — alongside the existing Deep Work, Trading, Learning, Mind and Personal.

**Tap-to-fill activity chips** added to both hourly loggers so you rarely need to type: Office work, Meeting, Emails, Commute, Deep work, Study, Exercise, Cooking, Family time, Household chores, Errands, Social media, Watching videos, Rest, Reading. Your six most recent entries appear first, so the list learns your actual routine.

---

## Deploy

**GitHub:** upload `index.html` and `sw.js` → Commit. Netlify redeploys in about a minute.
**Netlify Drop:** unzip `life-os-pwa.zip`, drag the folder onto your Deploys tab.

Then **pull-to-refresh 2–3 times** on your phone (cache is now `life-os-v6-3`).

---

## Verify

1. Open any panel with a text box → tap it → **keyboard stays up and you can type**
2. Tasks, Journal, Screen Time, Sleep, Goals — test typing in each
3. More → **Sleep** → enter bed 23:00, wake 06:30 → tap a quality face → **times are still there** → Save → shows 7.5h
4. Tap **Focus** → open the dropdown → you'll see ＋ Add and ✎ Rename/delete at the bottom
5. **Daily Planner** → six routine tabs across the top; tap Office, then Student — the blocks change
6. **Log** tab → tap an hour → grey preset chips appear below the text box; tapping one fills it in
