# Sprite Hunter — Build Status

**Last updated:** 2026-07-09
**Current phase:** 3 (Audio) — HTML5 Audio migration complete; pre-generated MP3s active with Web Speech API fallback
**Stack:** React 18 + TypeScript strict + Tailwind CSS v4 + Vite 6
**Target:** iPad-first (768x1024), iPhone 14 (390x844), Chrome + Safari, touch-optimised

---

## Phase History

| Phase | Description | Status |
|-------|-------------|--------|
| 0 — Scaffold | Vite + React + TS + Tailwind project | Complete |
| 1 — Core Loop | State machine, word matching, sprite display, HUD, session flow | Complete |
| 2 — Polish | Rarity engine, capture animations, particle backgrounds, XP bar | Complete |
| 2.5 — Visual Overhaul | 7 deliverables (see below) | **In progress** |
| 3 — Audio | Web Audio API oscillators for 6 sound events | Partially started (ambient + swoosh done) |
| 4 — Co-op | Two player profiles, turn alternation, shared collection | Not started |

---

## Phase 2.5 Deliverables (Updated 2026-07-07)

### 1. Photographic Backgrounds — COMPLETE
- **Main screen:** `sprite hunter background.jpg` (Fortnite lobby interior) — darkened with `brightness(0.4) saturate(0.85)` + radial vignette
- **Forest Hunt:** `forest background.jpg` (Fortnite forest sunset with pines/stream) — `brightness(0.45) saturate(0.9)` + vignette + golden canvas particle motes
- **Storm Hunt:** `storm background.jpg` (Fortnite rift/lightning desert) — `brightness(0.5) saturate(1.1)` + vignette + purple/magenta canvas particle motes
- Replaced previous SVG-generated backgrounds with actual Fortnite reference photos
- `LobbyBackground.tsx` uses `sprite hunter background.jpg` directly
- `HuntBackground.tsx` uses variant-specific jpg + canvas particles overlay

### 2. Frosted Glass Card on Hunt Screen — COMPLETE
- Semi-transparent dark card behind sprite + word on hunt screens
- `background: rgba(6, 8, 18, 0.5)`, `backdrop-filter: blur(12px)`
- Subtle border (`rgba(255,255,255,0.06)`) + inset highlight + drop shadow
- Background photos remain visible and atmospheric around the card edges
- Tested on desktop and iPad (768x1024) — readable and visually balanced

### 3. Collection Lobby — COMPLETE
- `src/components/SessionStart.tsx` — Collection grid showing all 20 sprites
- `src/game/collection.ts` — localStorage persistence (`sprite-hunter-collection` key)
- Owned sprites: coloured, floating animation (stable per-sprite delay), show "Lv.{N}"
- Unowned sprites: greyed out (opacity-30 grayscale), show "Not owned"
- Hunt variant buttons pulse (`animate-btn-pulse`)
- Fixed: animation delay now uses stable per-sprite values (`FLOAT_DELAYS` array) instead of `Math.random()` on every render

### 4. Expanded Sprite Roster to 20 — COMPLETE
- `src/components/SpriteSvg.tsx` — 20 hand-crafted SVG sprite renderers
- **Distribution:** Common(4), Uncommon(4), Rare(5), Epic(4), Legendary(3)

### 5. Burnt Peanut Redesign — COMPLETE
- Redesigned to match Fortnite reference image:
  - Golden-brown peanut body with waffle-pattern SVG texture overlay
  - Organic bump texture (irregular circles at varying opacity)
  - Realistic human blue eyes (iris detail, radial lines, specular highlights, pupil)
  - Pink/purple eyelids with upper and lower lid lines
  - Prominent pink lips with highlight and shadow
  - Multicolour propeller cap (purple, yellow, orange, green panels) with black brim
  - Propeller blades (blue, yellow, red)
  - Stubby arms and legs
- The uncanny-valley human face on cartoon body is preserved as the defining characteristic

### 6. Text-to-Speech — PARTIALLY COMPLETE (NEEDS CHROME VERIFICATION)
- `src/audio/speech.ts` — iteration 7 with additions:
  - `gestureReceived` flag gates ALL speech on first `pointerdown`/`keydown`
  - `speakInterrupt(text, rate)` — cancel() + 50ms setTimeout + speak()
  - `speakQueue(text, rate)` — direct speak() without cancel
  - `pendingTimer` tracking prevents race conditions
  - Voice: "Microsoft Catherine" > "Google UK English Female" > lang fallback
  - **New:** `speech.onFirstGesture(cb)` — registers callback for first user gesture
  - **New:** `speech.hasGesture` getter
- **Opening guidance speech (Item 3):** On first tap on main screen, speaks "Sprite Hunters, let's go. Choose your mode — Forest Hunt, or Storm Hunt" via `speech.onFirstGesture()` in SessionStart

### 7. Title Case Display — COMPLETE
- `src/components/WordPrompt.tsx` — `word.replace(/\b\w/g, (c) => c.toUpperCase())`

### 8. Expanded Praise & Encouragement (Item 4) — COMPLETE
- **Praise pool expanded to 10:** "YOU GOT IT!", "SPRITE CAPTURED!", "NAILED IT!", "THAT'S THE ONE!", "LEGENDARY!", "NICE WORK!", "GOT EM!", "YOU'RE ON FIRE!", "UNSTOPPABLE!", "WHAT A CATCH!"
- **Encouragement pool expanded to 5:** "Think about it — you can do it!", "Almost — give it another shot!", "The Sprite is still there — try again!", "So close — one more time!", "You've got this — try again!"
- **No-repeat-until-all-used:** `makeShuffledPicker()` in `sessionEngine.ts` — Fisher-Yates shuffle, pops from shuffled copy, re-shuffles when exhausted

### 9. Ambient Background Audio (Item 5) — COMPLETE
- `src/audio/ambient.ts` — Web Audio API ambient loop system
- Loads `sprite audio.mp3` from public folder
- Starts on first user tap (alongside opening guidance speech)
- Low atmospheric volume (`TARGET_VOLUME = 0.12`)
- Crossfade loop: `onended` callback creates next source with volume dip/restore over 0.8s
- Fades to zero over 1.5s when player selects hunt variant (`ambientAudio.fadeOut()`)
- Restarts when returning to lobby from end screen (`ambientAudio.play()`)
- No autoplay before gesture — fully gesture-gated

### 10. Teaser Sprite Zip (Item 6) — COMPLETE
- `src/components/TeaserSprite.tsx` — rare/epic/legendary sprite zips across screen
- First zip 3 seconds after load, then repeats randomly every 8–15 seconds
- Fast CSS `teaser-zip` animation (1s cubic-bezier across full viewport width)
- Motion blur via `teaser-blur` CSS animation (blur ramps up mid-transit, fades at edges)
- Random direction (left-to-right or right-to-left), random vertical position (15–70%)
- `src/audio/swoosh.ts` — Web Audio API pitch-descending sine tone (800Hz→200Hz, 0.3s, low volume 0.08)
- Sprite is not catchable — purely decorative/aspirational

---

## Complete File Inventory

### Data Files
| File | Purpose |
|------|---------|
| `src/data/config.json` | Player profiles (Mason tier 3, Carter tier 1), session settings, speech config, hunt variants |
| `src/data/sprites.json` | 20 sprite definitions + rarity configs |
| `src/data/words.json` | 5 tier word pools: tier1(20), tier2(18), tier3(16), tier4(14), tier5(12) |

### Game Logic
| File | Purpose |
|------|---------|
| `src/game/types.ts` | Types: Rarity, RarityConfig, SpriteDef, HuntEntry, PlayerConfig, HuntVariant |
| `src/game/rarityEngine.ts` | Rarity config lookup, tier-to-rarity mapping, sprite pool selection |
| `src/game/sessionEngine.ts` | Hunt builder, word matching, XP calc, dart offset, shuffled praise/encouragement pools |
| `src/game/collection.ts` | localStorage persistence: loadCollection, recordCapture, spriteLevel |

### Audio
| File | Purpose |
|------|---------|
| `src/audio/speech.ts` | Web Speech API: gesture gating, interrupt/queue modes, voice selection, onFirstGesture callback |
| `src/audio/ambient.ts` | Web Audio API: ambient music loop, crossfade restart, fade-out on hunt start |
| `src/audio/swoosh.ts` | Web Audio API: synthesised pitch-descending swoosh for teaser sprite |

### Components
| File | Purpose |
|------|---------|
| `src/App.tsx` | Root: reducer state machine, screen routing, ambient audio fade-out on begin |
| `src/components/SessionStart.tsx` | Lobby: collection grid, hunt buttons, opening speech trigger, teaser sprite |
| `src/components/TeaserSprite.tsx` | Rare/legendary sprite zip across lobby screen with swoosh sound |
| `src/components/LobbyBackground.tsx` | Lobby background (darkened Fortnite lobby photo + vignette) |
| `src/components/HuntBackground.tsx` | Hunt backgrounds (photo + canvas particles per variant) |
| `src/components/ParticleBackground.tsx` | End screen ambient drifting motes |
| `src/components/SpriteDisplay.tsx` | Sprite container: rarity aura, float/capture animations, dart offset |
| `src/components/SpriteSvg.tsx` | 20 SVG sprite art renderers + BodyShading component |
| `src/components/WordPrompt.tsx` | Title Case word display + text input |
| `src/components/HUD.tsx` | Top bar: sprite counter, XP bar |
| `src/components/CaptureAnimation.tsx` | Capture burst particles + screen bloom |
| `src/components/SessionEnd.tsx` | End screen: captured sprite gallery, hunt-again button |

### Styles
| File | Purpose |
|------|---------|
| `src/styles/globals.css` | Tailwind v4 @theme tokens, 20 keyframe animations, utility classes |

### Public Assets
| File | Used | Purpose |
|------|------|---------|
| `public/sprite hunter background.jpg` | Yes | Main screen lobby background |
| `public/forest background.jpg` | Yes | Forest Hunt background |
| `public/storm background.jpg` | Yes | Storm Hunt background |
| `public/lobby-bg.png` | No | Superseded by sprite hunter background.jpg |
| `public/sprite audio.mp3` | Yes | Ambient background music loop |

### Config / Build
| File | Purpose |
|------|---------|
| `index.html` | Google Fonts, mobile meta tags, viewport lock |
| `vite.config.ts` | Vite + React + Tailwind plugins, PORT env, fs.strict:false |
| `package.json` | react 18, vite 6, tailwind 4, typescript 5.6 |
| `.claude/launch.json` | Dev server config (cmd.exe wrapper, autoPort:true) |

---

## CSS Animations (globals.css)

| Animation | Duration | Used For |
|-----------|----------|----------|
| ambient-pulse | 5s infinite | Aura breathing, button glow |
| sprite-float | 3.2s infinite | Sprite bobbing |
| glow-breathe | 2.8s infinite | Sprite glow, title glow |
| capture-pop | 1.1s forwards | Sprite shrink on capture |
| prompt-float | 2.2s forwards | Encouragement text |
| praise-pop | 1.4s forwards | Praise text pop |
| reveal-in | 0.7s both | End screen reveals |
| burst-fly | 0.85s forwards | Capture particles |
| capture-flash | 0.7s forwards | Screen bloom |
| cosmic-flash | 1.4s forwards | Zero Point bloom |
| cosmic-veil | 3s forwards | Zero Point vignette |
| orbit-spin | 6s infinite | Epic/Legendary motes |
| xp-pulse | 0.7s out | XP bar pulse |
| rarity-pulse-green | 2.4s infinite | Uncommon aura |
| rarity-shimmer-blue | 3s infinite | Rare aura |
| storm-lightning | 4s infinite | (Legacy — no longer used with photo bg) |
| storm-lightning-2 | 5s infinite | (Legacy — no longer used with photo bg) |
| btn-pulse | 2.4s infinite | Hunt variant buttons |
| teaser-zip | 1s forwards | Teaser sprite fly-across |
| teaser-blur | 1s forwards | Motion blur on teaser sprite |

---

## State Machine (App.tsx reducer)

```
start ──[begin]──> hunt ──[advance past last]──> end
                     │                              │
                     ├──[capture]──> celebrating ───┘
                     │      (auto-advance after captureDurationMs)
                     ├──[dodge]──> dart offset + encouragement
                     └──[timeUp]──> end (10 min silent cap)

end ──[reset]──> start
```

---

## One-Second Test Results (2026-07-07)

### Main Screen (Lobby)
- Fortnite lobby interior photo visible through dark overlay
- 20-sprite collection grid with rarity colours, owned sprites floating
- Pulsing FOREST HUNT / STORM HUNT buttons
- Teaser sprite zips across screen periodically with swoosh
- **Verdict: PASS** — looks like a Fortnite collection lobby

### Forest Hunt
- Photographic Fortnite forest with golden sunset, trees, stream
- Frosted glass card centres sprite + word — readable, atmospheric
- Golden particle motes drift over the photo
- **Verdict: PASS** — immersive game feel

### Storm Hunt
- Photographic Fortnite rift/lightning over desert landscape
- Purple/magenta particles overlay
- Frosted card with sprite + word is clean and readable
- **Verdict: PASS** — dramatic, exciting atmosphere

---

## Phase 3 — Audio (Reworked 2026-07-09)

### `src/audio/audioPlayer.ts` — centralised audio manager (Web Audio)
- **All voice clips play through the Web Audio API on the shared `AudioContext`** (the same one the ambient music uses) — decoded MP3 buffers, NOT HTML5 `<audio>` elements. Mixing `<audio>` with Web Audio makes iOS kill the ambient when a clip ends; one unified system fixes it and removes iOS per-element unlock issues.
- Components never call `speechSynthesis`/`Audio` directly — everything routes through this manager.
- Falls back to Web Speech API (Microsoft Catherine en-AU) if a file is absent/undecodable.
- Dynamic: dropping new MP3s into `public/audio/` picks them up automatically (buffer cache keyed by filename).
- Covers: intro, hunt-start (forest/storm), praise (10), encouragement (5), words, session end (0–10), sprite names, cosmic capture.
- `preload()` warms the buffer cache for sys-intro + hunt clips inside the first gesture.
- `stopAll()` — stops all voice buffer sources, cancels Web Speech, clears pending timers. Called on **hunt start, hunt end, and return to lobby** so no audio bleeds between sessions.
- `visibilitychange` listener flushes everything when the tab is hidden (no queued iOS speech firing on return); playback is guarded while `document.hidden`.
- `unlock()` — resumes the context + unlocks Web Speech synchronously inside the opening tap gesture (iOS requirement).

### Word audio coverage (IMPORTANT for iPhone)
- Words with an MP3 speak reliably on all devices. Words **without** an MP3 fall back to Web Speech, which is **unreliable on iOS** (silent, or fires on backgrounding).
- Only 24 word MP3s exist (all tier 1 + `said/was/they/my`). **Mason plays tiers 2–4**, so ~40 of his words have no MP3 and won't reliably speak on iPhone until recorded.
- Fix path: add `word-<word>.mp3` (lowercase) files to `public/audio/` — no code change needed. (Owner is generating these.)

## Known Bugs / Open Issues

1. **~40 word MP3s missing for tiers 2–4** — iPhone word speech unreliable until added. See above.

2. **Player switching not implemented** — Always uses `players[0]` (Mason). Phase 4 scope.

3. **Legacy storm-lightning CSS animations** — No longer used. Harmless but could be removed.

4. **lobby-bg.png superseded** — Can be removed from public/ (replaced by sprite hunter background.jpg).

---

## Design Pillars (Enforced)

- **A — Never feels like school:** No educational terminology in UI
- **B — Failure does not exist:** Wrong attempts = warm encouragement + playful dart, no red/X/buzzer
- **C — Screen is never still:** Canvas particles, CSS animations, teaser sprite zips
- **D — Rarity is everything:** 5-tier system with distinct visual auras, word difficulty tied to rarity
- **E — Co-op means together:** Phase 4 — not yet implemented

## OT-Informed Design (Enforced)

- No visible timers (10 min cap is hidden)
- No punishment feedback
- Soft audio (speech rate 0.95, volume 0.9; ambient volume 0.12)
- Predictable structure
- Positive prompts only
- No strobing (single soft pulse, never repeated)

---

## Resumption Instructions

### Immediate Priority: Verify Speech in Chrome
1. Start dev server: `npm run dev` in `C:\Claude Stuff\Sprite Hunter`
2. Open `http://localhost:5173` in Chrome
3. Tap screen — should hear opening guidance + ambient music starts
4. Select a hunt variant — ambient fades out, variant announcement speaks
5. Verify: words spoken on appear, praise on capture, encouragement on wrong attempt

### If Speech Works
- Close Phase 2.5
- Begin Phase 3 remaining (capture chime, wrong-attempt thud, XP tick, Zero Point tone, session end fanfare)

### Phase 3 Remaining Scope
Web Audio API oscillators for: sprite appears (chime), capture (sparkle), wrong attempt (soft thud), XP tick, Zero Point (ethereal tone), session end (fanfare). Ambient loop + swoosh already done.

### Phase 4 Scope (Co-op)
Two player profiles on lobby, turn alternation during hunt, shared collection, hidden difficulty tiers per player
