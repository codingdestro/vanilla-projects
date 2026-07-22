# Review Report — Snake And Ladder

**Date:** 2026-07-22
**Mode:** review
**Score:** 16 / 50
**Verdict:** Needs substantial design work — the interaction has bones but the surface has no voice.

---

## TL;DR

The game logic is functional and the 3D dice animation shows genuine craft, but the design stops at bare functionality. There is no title, no player status, no victory screen (just a raw `alert()`), and no authored visual identity. The board image carries all the visual weight while the interface around it is an afterthought. The experience works as a code sketch, not as a polished game.

**Primary recommendation:** Build a game panel around the board — title, turn indicator, player scores, and a proper victory overlay. Then recolor and typeset to match the board's playful tone.

---

## Heuristic Scores

| # | Heuristic | Score | Key Finding |
|---|---|---|---|
| 1 | First impression | 3 / 10 | No title, no branding, no sense of arrival. The game is a black square and a tiny dice floating in void. |
| 2 | Hierarchy | 3 / 10 | Board dominates correctly, but the active player indicator (a tiny triangle) is nearly invisible. No turn/score display exists. |
| 3 | Color voice | 4 / 10 | Coin gradients differentiate players well, but everything else uses browser defaults. The dice and buttons have no authored color. |
| 4 | Type voice | 2 / 10 | No typography system. No headings, labels, or instructional text anywhere. The only text is dice dots and a raw `alert()`. |
| 5 | Interaction feel | 4 / 10 | 3D dice animation is well-executed. Coin movement has decent transitions. But winning via `alert()` breaks immersion completely. No keyboard access. |
| **Total** | | **16 / 50** | |

---

## Cognitive Load / Risk

**Level: Moderate-High** — The game is playable but the interface demands the player fill in too many gaps.

- **PASS** Board image provides clear game geography
- **PASS** 3D dice rotation is satisfying and well-timed
- **PASS** Coin differentiation (color + gradient) is clear at a glance
- **WATCH** Board click as dice trigger is unintuitive — the dice box should own that interaction
- **WATCH** No turn indicator beyond a tiny triangle on the active coin — easy to lose track
- **WATCH** Snake/ladder teleport has no visual cue — player can't tell what just happened
- **FAIL** Raw `alert()` for game-over destroys immersion and is inaccessible
- **FAIL** No keyboard accessibility — game is mouse/touch only
- **FAIL** No player name, no score, no round tracking — zero game context

### Next Modes

`/design relayout` `/design recolor` `/design typeset` `/design interaction` `/design surface`

---

## What's Working

**3D Dice Animation**
The CSS 3D cube with `preserve-3d` and keyframed rotation is genuinely well-executed. The 1-second roll with face snapping to the correct value feels satisfying. This is the strongest single element in the design.

**Step-by-step Movement**
Moving the coin one cell at a time (450ms intervals) creates anticipation and makes the board traversal legible. Better than an instant teleport to the destination.

**Random Board Themes**
Swapping between two board images on load adds variety. The data structures for snake/ladder positions changing per board show thoughtful implementation.

---

## Priority Issues

### P0 — No Game Identity

The page has no title, no header, no branding. A player arriving sees a black square and a tiny white box. There is nothing that says "Snake and Ladder" or communicates what this is. The `<title>` tag exists but the visible surface betrays it.

**Evidence:** `index.html` has `<title>Snake And Ladder</title>` but zero visible text on the page outside dice dots and button labels. The body contains only `#canva`, `.dice-box`, and `.player-selection` — no heading or branding element.

**FIX:** Add a game panel with a visible title, player turn indicator, and game status. `/design relayout`

---

### P0 — Alert() as Victory Screen

Winning triggers `alert(name + " you won!")` — a raw browser dialog that halts all animation, blocks interaction, and looks like a 1995 error message. It's inaccessible to screen readers in any useful way and completely breaks the visual experience.

**Evidence:** `main.js` line ~112: `alert(this.name + " you won!");` and line ~143: `alert(name + " you won!");` — two separate alert calls for the same condition.

**FIX:** Replace with an in-game victory overlay/modal with winner name, confetti or celebration animation, and a "Play Again" button. `/design interaction` + `/design surface`

---

### P0 — Invisible Turn State

The only indication of whose turn it is is a tiny CSS triangle (`.coin .active`) on the active coin. At 10px border size, this is nearly invisible on the board. There's no text display, no player panel, no history of moves.

**Evidence:** `style.css` `.coin .active` creates a 10px triangle via border trick. `main.js` `setActive()` toggles this class between coins. No other turn-state UI exists.

**FIX:** Add a player status panel showing active player name, color indicator, and last roll result. `/design relayout` + `/design interaction`

---

### P1 — Wrong Interaction Affordance

Clicking the board canvas rolls the dice. This is counterintuitive — the dice box is the natural target, not the playing field. Having both targets (dice box AND board) creates ambiguity.

**Evidence:** `main.js` has two event listeners: `diceBox.addEventListener("mousedown", ...)` and `canva.addEventListener("click", ...)` — both trigger `rollTheDice()`.

**FIX:** Remove board click handler. Make the dice box the single, prominent dice-roll target with clear hover/active states. `/design interaction`

---

### P1 — No Snake/Ladder Visual Feedback

When a coin lands on a snake or ladder cell, it simply teleports to the new position after a 100ms delay. There's no slide animation, no arrow indicator, no audio cue, and no text explaining what happened. The player sees their coin jump with no understanding of why.

**Evidence:** `main.js` `bitean()` method: sets new x/y from data map, calls `this.move()` after 100ms setTimeout, then resolves. No visual indicator of snake vs ladder direction.

**FIX:** Add a directional slide animation (coin slides along the snake/ladder path), a label ("Snake! Down to 12" or "Ladder! Up to 34"), and distinct color coding for snakes (red/warning) vs ladders (green/success). `/design motion` + `/design interaction`

---

### P2 — Void Background

The body has no background color. The game floats on a stark white/transparent canvas with no context. A game should feel like it occupies a space — a tabletop, a room, a themed environment.

**Evidence:** `style.css` `body` has `position: fixed; width: 100%; height: 100%` but no `background` property.

**FIX:** Add a warm, game-appropriate background (dark wood texture, felt green, or a subtle gradient). `/design recolor`

---

### P2 — Player Selection Screen is Unbranded

The player count picker is a blur backdrop with two bare buttons labeled "2 player" and "3 player". No title, no game logo, no instructional text.

**Evidence:** `index.html` `.player-selection` contains only two `<button>` elements with no heading or context.

**FIX:** Add game title/logo, "Select Players" heading, and styled buttons with player color previews. `/design relayout`

---

### P2 — No Keyboard Accessibility

The entire game is mouse/touch only. There are no keyboard handlers, no focus management, no ARIA labels, and no way to play with assistive technology.

**Evidence:** Zero `keydown`/`keyup` listeners, zero `tabindex` attributes, zero `aria-*` attributes across all three files.

**FIX:** Add Space/Enter to roll dice, arrow keys/Tab for player selection navigation, and ARIA live regions for turn/game state announcements. `/design interaction`

---

## Recommendations Summary

| Priority | Mode | What to fix |
|---|---|---|
| 1 | `/design relayout` | Add game panel: title, turn indicator, player scores, action area |
| 2 | `/design recolor` | Build cohesive palette around board aesthetic; colored body background |
| 3 | `/design typeset` | Add typography hierarchy: title, labels, player names, roll results |
| 4 | `/design interaction` | Victory overlay, dice-only interaction, snake/ladder feedback, keyboard |
| 5 | `/design surface` | Game-over screen, restart transitions, state edge cases |
| 6 | `/design motion` | Snake slide, ladder climb, victory celebration animations |

---

*Generated with CommandCode — 2026-07-22*
