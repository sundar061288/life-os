# Life OS v10 — Voice Segmentation Fixed + Automatic Intent Routing

**2 files changed:** `index.html`, `sw.js` · still ₹0

> ⚠️ **First: your screenshot shows v7.** The header badge reads v7, the button says "Sort it out", and the review screen appears — v8 and v9 were never deployed. Upload the new `index.html` + `sw.js` and everything below (plus zero-touch capture, Insights, onboarding, Expenses) arrives at once.

---

## 1 · Why your 3 tasks became 1

The splitter only broke text on **line breaks**. When you type or dictate continuously, there are none — your whole paragraph arrived as one line, so it became one task.

**Now it splits on how people actually speak:**

- **Spoken item markers** — "task 1", "task 2", "task number 3", "item 2", "point three"
- **Ordinals** — "first… second… thirdly…"
- **Connectors** — "and then", "after that", "also I need to", "one more thing"
- **Numbered/bulleted lists** — "1) … 2) …"
- **Sentence boundaries**, with a guard so a trailing "remind me at 5:30" attaches to the task before it instead of becoming its own item
- **Voice junk removed** — "task number to sorry" (your self-correction), filler openers, dangling "so"/"and", and meta lines like "I am going to list three tasks"

**Your exact input now produces:**

| # | Task | Due | Reminder |
|---|---|---|---|
| 1 | Appointment | 18:00 | 17:30 |
| 2 | Pick my daughter from Veena class | 21:00 | 20:45 |
| 3 | Turn off computer | 22:00 | — |

Note item 2: you said *"remind me at 8:45"* with no am/pm. A literal reading gives 08:45 — twelve hours *before* the task. The parser now infers that a reminder sits shortly **before** its task and corrects it to **20:45**.

## 2 · Automatic intent routing — the user never chooses

Exactly the six destinations you described. All six verified by test:

| You say | Goes to |
|---|---|
| "I have an idea for Alpha Trader" | 💡 **Ideas** (AI Memory) |
| "Remind me to renew passport" | ✓ **Tasks** |
| "Today I feel tired" | ✍️ **Journal** (today's entry) |
| "I spent 700 rupees" | 💰 **Expenses** |
| "My daughter likes drawing" | 🧠 **Memory** |
| "Doctor appointment next Tuesday" | ✓ **Task with next Tuesday's date** |

**How it decides, in order:** an amount + a spending verb → expense · explicit idea phrasing → idea · aspiration phrasing → goal · a feeling with nothing to do in it → journal · a fact about a person with no action verb → memory · everything else → task. The action-verb check is what keeps *"remind me to renew passport"* a task rather than a memory.

**How much is possible?** The local engine handles the patterns above reliably and free. It will miss unusual phrasing — that's the ceiling of rules. Adding your own API key (Settings → AI Assistant) raises it to near-human understanding for a few paise per capture. Both paths write to the same six destinations, and you can always correct the type in the review list, which now offers all six.

## 3 · New: Expenses panel 💰

Because "I spent 700 rupees" needed somewhere to land. Today's and this month's totals, a 7-day chart, and automatic categories — Food, Groceries, Transport, Health, Bills, Education, Shopping — recognising Indian services (swiggy, zomato, blinkit, zepto, petrol, EMI, recharge). Understands "₹700", "700 rupees", "Rs 1,250", and bare numbers when the sentence is clearly about spending. Add by voice from the panel too.

---

## Deploy
Upload `index.html` + `sw.js` (cache `life-os-v10-0`) → pull-to-refresh 2–3 times. Confirm the header badge reads **v10**.

## Verify
1. Quick Capture → paste your original three-task paragraph → **three separate tasks** with correct times
2. Say each of the six examples above → check each lands in its own panel
3. More → **Expenses** → say "spent 450 on groceries"
4. Header should read **v10**, and the Capture button should say **✨ Capture** (not "Sort it out")
