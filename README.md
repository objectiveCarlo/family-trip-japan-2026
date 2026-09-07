# 🇯🇵 Japan Trip 2026

Group trip itinerary for 9 pax — **September 26 to October 5, 2026**.

Manila → Kamakura → Enoshima → Tokyo → Narita → Manila

**Flights (Cebu Pacific)**
- ✈️ **5J 5054** · MNL dep 6:50am → NRT arr 12:25pm · Sep 26
- ✈️ **5J 5057** · NRT dep 7:15pm → MNL arr 11:35pm · Oct 5

## 🌐 View the itinerary

👉 **[Open the trip page](https://objectiveCarlo.github.io/family-trip-japan-2026/)**

> Replace `your-username` with your actual GitHub username after deploying.

---

## 📋 What's inside

- **Decisions & deadlines** — accommodation choices, visa reminders, PokéPark ticket drop date, Suica cards
- **Full day-by-day itinerary** — all 9 days with activities, transport notes, and hotel info

---

## 🚀 Deploy to GitHub Pages

1. Push this repo to GitHub
2. Go to **Settings → Pages**
3. Under *Branch*, select `main` and folder `/root`
4. Click **Save** — your site will be live in a minute

---

## ✏️ Editing the itinerary

Everything is in a single file: `index.html`

Open it in any text editor. Each `<tr class="data-row" data-day="N">` is one day; per-day detail (the click-to-open modal) lives in the `DETAILS` object inside the `<script>` block, and the little SVG stickers are the `ART` object above it.

---

## ✅ Tests

Playwright end-to-end tests live in `tests/`. They need **Node.js** (`brew install node`).

```sh
nvm use                           # Node LTS (see .nvmrc)
npm install                       # first time
npx playwright install chromium   # first time — grabs the browser
npm test                          # run the suite (35 tests)
npm run report                    # open the last HTML report
```

The config serves `index.html` with `python3 -m http.server` on port 4173, so nothing else needs to be running. CI runs the same suite on every push/PR to `main` (`.github/workflows/playwright.yml`).

---

## 📌 Key dates to remember

| What | When |
|------|------|
| Kamakura Airbnb — Koshigoe | ✅ Booked |
| Tokyo Airbnb — Horikiri, Katsushika | ✅ Booked |
| Shibuya Sky sunset slot | **Book ~Sep 18** (14-day window) |
| Ate Lyn & Tita Ana visa | ✅ Done |
| PokéPark KANTO tickets — Oct 1 | ✅ Booked |
| Trip departs | Sep 26 · 6:50am MNL (5J 5054) |
| Fly home | Oct 5 · 7:15pm NRT (5J 5057) |