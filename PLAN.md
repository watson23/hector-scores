# Hector Scores — Premium Dark UI Redesign

## Design System

### Color Palette
- **Backgrounds:** Slate tones (slate-950, slate-900, slate-800, slate-700) — richer than plain gray
- **Primary accent:** Emerald green (emerald-500/600) — natural golf color, premium feel
- **Secondary accent:** Amber/Gold (amber-400/500) — winners, highlights, trophies
- **Text hierarchy:** White → slate-300 → slate-400 → slate-500
- **Score colors:** Red-400 (eagle/birdie), emerald-400 (par), sky-400 (bogey), sky-600 (double+)
- **Danger:** Rose-500 for delete/remove actions

### Typography
- **Font:** Inter (Google Fonts) — clean, modern, excellent readability on mobile
- **Scale:** text-xs / text-sm / text-base / text-lg / text-xl / text-2xl
- **Weights:** font-normal (body), font-medium (labels), font-semibold (headings), font-bold (scores)

### Border Radius
- **Cards:** rounded-2xl (consistent)
- **Buttons:** rounded-xl
- **Inputs:** rounded-xl
- **Pills/toggles:** rounded-full
- **Table containers:** rounded-2xl

### Spacing
- Page padding: px-4 py-6 (mobile-optimized)
- Card padding: p-4
- Between sections: space-y-4 or space-y-6

---

## Component Redesigns

### 1. tailwind.config.js
- Extend theme with custom colors if needed
- Add Inter font family

### 2. index.html
- Add Google Fonts link for Inter (weight 400, 500, 600, 700)

### 3. index.css
- Set font-family: Inter on body
- Add smooth scrolling
- Style scrollbar for dark theme

### 4. StartScreen.tsx — Setup Screen
**Layout:** Full-screen dark slate-950 background, centered content

- **Header:** Eagle icon (slightly larger, w-20 h-20) + "Hector Scores" in text-2xl font-bold text-white with a subtle text-emerald-400 tagline below like "Golf Scorecard"
- **Form sections:** Each in a subtle slate-900 card with rounded-2xl, p-4, space-y-3
  - **Labels:** text-sm font-medium text-slate-300 uppercase tracking-wide
  - **Select inputs:** bg-slate-800 border-slate-700 text-white rounded-xl, focus:ring-emerald-500
  - **Text inputs:** Same dark style as selects
- **Player addition:** Clean row layout — input fields with Add button (emerald-600, rounded-xl)
- **Players list:** slate-800/900 cards with player name in white, handicap in slate-400, remove as a subtle icon/text
- **Start Round button:** Large, full-width, bg-emerald-600 hover:bg-emerald-500, rounded-xl, py-3, font-semibold, prominent
- **Round History button:** Subtle — bg-slate-800 border border-slate-700, text-slate-300

### 5. App.tsx — Playing View (Main Scoring Screen)
**Layout:** Clean top bar + hole info + score inputs + navigation + scorecard

- **Top bar:** Compact row with round name (text-lg font-semibold text-white) and action buttons (Save/New) as small icon-like buttons (slate-800, rounded-xl)
- **Hole indicator:** Prominent centered display
  - Large "HOLE 5" text (text-2xl font-bold text-white)
  - Par and HCP as pills below: "Par 4" in an emerald-900/emerald-400 pill, "HCP 7" in a slate-700 pill
  - Course name as subtle text-sm text-slate-400
- **Navigation:** Previous/Next as large, easy-to-tap buttons flanking the hole indicator
  - Chevron arrows (← →) in slate-700 circles, active:bg-slate-600
  - Hole progress dots or "5 / 18" indicator
- **Score inputs:** Below hole info, each player as a dark card
- **Scorecard:** Below everything, separated by a subtle divider

### 6. ScoreInput.tsx — Score Entry Card
**Complete dark redesign — this is the most-used component on the course**

- **Card:** bg-slate-800 rounded-2xl p-4, no border (uses background contrast)
- **Top row:** Player name (text-white font-semibold) + HCP badge (text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full)
- **Strokes indicator:** If strokes > 0, small emerald pill "+1 stroke" (bg-emerald-900 text-emerald-400 text-xs rounded-full)
- **Score buttons:** Grid layout for easy mobile tapping
  - 3x3 grid of numbers 1-9: Each button is w-12 h-12 (large tap target), bg-slate-700 hover:bg-slate-600, text-white font-semibold, rounded-xl
  - Clear button (-): Same size, bg-slate-900 border border-slate-600, text-slate-400
  - 10+ input: bg-slate-700 rounded-xl, same height as buttons, w-16, text-center
- **Score display:** Below buttons — Gross and Net as clean text
  - "Gross: 5" text-slate-300 | "Net: 4" text-emerald-400 font-medium

### 7. Scorecard.tsx — Leaderboard & Score Table
**Dark-themed throughout**

- **Toggle:** Pill-shaped, bg-slate-800, with active tab in emerald-600 (rounded-full)
- **Leaderboard:**
  - bg-slate-800 rounded-2xl overflow-hidden
  - Each row: flex layout, slight bottom border (border-slate-700)
  - Rank number: text-slate-500 for regular, text-amber-400 for #1
  - Player name: text-white
  - Score: font-bold, text-white (text-amber-400 for winner)
  - Winner row: subtle left border-2 border-amber-400 or bg-gradient highlight
- **Score table:**
  - Container: bg-slate-800 rounded-2xl (NOT white)
  - Header row: bg-slate-700 text-slate-300 text-xs uppercase
  - Par row: bg-slate-750→bg-slate-700/50 text-slate-400
  - Player rows: border-t border-slate-700
  - Score cell colors (on dark bg):
    - Eagle/Birdie: text-red-400 font-bold
    - Par: text-emerald-400
    - Bogey: text-sky-400
    - Double+: text-sky-600
  - Handicap stroke dot: Small amber-400 dot
  - Total column: font-bold text-white
  - ±Par: Colored accordingly
- **Course info footer:** text-xs text-slate-500

### 8. RoundHistory.tsx — History Browser
**Consistent dark card design**

- **Header:** "Round History" text-xl font-bold text-white, Back button as subtle slate-800 rounded-xl
- **Round cards:** bg-slate-800 rounded-2xl
  - Round name: text-white font-semibold
  - Date + course: text-slate-400 text-sm
  - Meta: text-slate-500 text-xs
  - Winner: amber-400 trophy icon + name
  - Quick scores: Compact pills showing each player's score
  - Expand chevron: text-slate-500
- **Expanded detail:** Same dark table styling as Scorecard
- **Action buttons:**
  - Continue: bg-emerald-600 rounded-xl
  - Delete: text-rose-400 (subtle), confirm state: bg-rose-600

---

## Implementation Order
1. Config & foundations (tailwind.config.js, index.html, index.css)
2. StartScreen.tsx redesign
3. ScoreInput.tsx redesign
4. App.tsx playing view redesign
5. Scorecard.tsx redesign
6. RoundHistory.tsx redesign
7. Final review & polish
