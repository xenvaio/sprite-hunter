# 🎮 Sprite Hunter

**A browser-based reading game for kids — built around Fortnite Sprites**

Live at **[spritehunter.xenva.io](https://spritehunter.xenva.io)**

---

## What It Is

Sprite Hunter is a short-session reading game designed for two brothers — Mason (8) and Carter (5) — built around the Fortnite Sprites mechanic from Chapter 7: Season 3.

In Fortnite, players roam the map searching for Sprites — glowing magical creatures — and capture them to unlock rare loot. Sprite Hunter uses the same loop as the reading mechanic: a Sprite appears on screen trying to flee, a word appears beneath it, and the player types the word correctly to capture it. The Sprite celebrates, joins the collection, and a rarer one appears next.

The game looks and feels like a real Fortnite UI — dark aesthetic, glowing rarity system, ambient audio, and a session-end collection reveal. It is not supposed to feel like a school app. That distinction is intentional and central to whether it works.

---

## Why It Was Built

Mason has ADHD/ASD and fell behind in reading during Kindergarten and Year 1. His gap is primarily sight word recognition — he has strong vocabulary and spoken language but doesn't yet automatically recognise words on sight. He is highly capable at Fortnite and deeply invested in gaming, but asks his dad to read on-screen text for him.

When asked how he felt about reading difficulties, he brushed it off. When asked to co-design a game, he stayed up late completing the design brief.

The goal was to build something that targets his specific literacy gap while feeling indistinguishable from the games he already loves — so the act of playing is the act of learning, without the two feeling separate.

Carter (5, Kindergarten) plays a beginner version of the same game using the same mechanic, simpler words, and friendlier Sprites. Both boys contribute captures to one shared collection in co-op mode — they win together, never against each other.

---

## How It Works

### The Core Mechanic

1. A Sprite appears on screen — glowing, floating, trying to flee
2. A word appears beneath it in large Orbitron font
3. The player types the word correctly to capture the Sprite
4. Wrong attempt: Sprite darts away slightly, a warm prompt appears ("So close — try again!"), no penalty
5. Correct: capture animation plays, Sprite joins the shared collection, XP bar fills
6. After 10 Sprites: session-end collection reveal showing all captures with rarity glows

### Rarity System

Word difficulty maps directly to Sprite rarity — the player never sees this mapping:

| Rarity | Glow | Example Sprites | Word Tier |
|--------|------|-----------------|-----------|
| Common | White/silver | Air, Water | Year 1 sight words |
| Uncommon | Green | Fire, Earth | Year 1–2 sight words |
| Rare | Blue | Ghost, Duck, Punk | Year 2 sight words |
| Epic | Purple | Demon, King | Year 2–3 words |
| Legendary | Gold + cosmic | Zero Point | Extended vocabulary |

The Zero Point Sprite — Fortnite's cosmological lore element, a black hole at the centre of the game universe — is the legendary unlock. It bridges Mason's Fortnite interest and his separately identified interest in space and black holes.

### Co-op Mode

Two player profiles (Mason and Carter) take turns. Mason's words are harder, Carter's are simpler. Neither player sees the other's difficulty tier. All captured Sprites go into one shared collection. They win together.

### Design Constraints

Every design decision was informed by input from Mason's occupational therapist (Ashleigh) and teacher (Megan):

- **No timers** — visible countdowns are anxiety-inducing for Mason's profile
- **No failure states** — wrong attempts feel like "not yet", not "wrong"
- **No red, no X, no buzzer** — failure feedback must be warm and positive
- **Session overview shown at start** — he engages better when he knows what the session looks like
- **Bounded choice** — choice and control within clear limits, not open-ended
- **10-minute session cap** — confirmed attention window
- **Speech on every prompt** — all guidance text is spoken aloud via Web Speech API because the target users cannot reliably read it yet
- **Microsoft Catherine (en-AU)** — Australian English female voice, warm and age-appropriate

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript (strict) |
| Build | Vite |
| Styling | Tailwind CSS 4 |
| Audio | Web Audio API + Web Speech API |
| Persistence | localStorage (collection levels) |
| Hosting | Cloudflare Pages |
| Domain | spritehunter.xenva.io |

No backend. No accounts. No data collection. All state is local.

---

## Project Structure

```
src/
├── components/
│   ├── SessionStart.tsx       # Hunt variant selection + tap-to-begin
│   ├── SpriteDisplay.tsx      # Animated Sprite with rarity glow
│   ├── WordPrompt.tsx         # Word display + type input
│   ├── HUD.tsx                # Counter, XP bar, player indicator
│   ├── CaptureAnimation.tsx   # Burst particle effect on capture
│   ├── SessionEnd.tsx         # Collection reveal screen
│   └── ParticleBackground.tsx # Ambient particle field
├── game/
│   ├── sessionEngine.ts       # Session state, word selection
│   ├── coopEngine.ts          # Turn management, shared collection
│   └── rarityEngine.ts        # Sprite rarity logic, tier mapping
├── audio/
│   └── audioEngine.ts         # All sound events + speech synthesis
├── data/
│   ├── words.json             # Tiered word list — replaceable
│   ├── sprites.json           # Sprite definitions: name, rarity, visual config
│   └── config.json            # Player profiles, tier assignments, session length
└── styles/
    └── globals.css            # Tailwind base + custom CSS variables
```

---

## Running Locally

```bash
git clone https://github.com/xenvaio/sprite-hunter
cd sprite-hunter
npm install
npm run dev
```

Open `http://localhost:5173` in Chrome. Tap the pulsing button to unlock audio — browser autoplay policy requires a user gesture before speech and music can start.

**Note:** Web Speech API availability varies by device. Microsoft Catherine (en-AU) is the primary voice with Google UK English Female as fallback. On iOS Safari, a system voice will be used.

---

## Word List

The starter word list is based on the Australian Year 1–2 sight word curriculum. It is designed to be replaced without any code changes — edit `src/data/words.json` and the game adapts automatically.

The word list will be calibrated by Mason's tutor once formal sessions begin, aligned to his confirmed reading level and the specific gap areas identified by his teacher.

---

## What's Next

- [ ] Word list calibration aligned to tutor and teacher input
- [ ] Carter beginner mode tuning based on joint co-design session
- [ ] Adaptive difficulty — word list adjusts based on session performance
- [ ] Storm Surge mode — reviewed with OT before implementing
- [ ] Sprite design competition entry (Epic Games — Chapter 7 Season 3)

---

## Deployment

Sprite Hunter is deployed via Cloudflare Pages. Every push to the `main` branch on GitHub automatically triggers a new deployment. No manual steps required — changes are live at [spritehunter.xenva.io](https://spritehunter.xenva.io) within ~90 seconds of a push.

---

## Acknowledgements

Built with input from Mason's occupational therapist Ashleigh, his teacher Megan, and most importantly — Mason himself, who completed the co-design brief even after discovering it wasn't the UEFN Fortnite Creative map he thought it was going to be. He stayed engaged anyway. That's the whole point.

*The game doesn't need to be perfect. It needs to feel like it was built for him. That's already what's happening.*

---

*Built by a dad. Designed by his kids.*
