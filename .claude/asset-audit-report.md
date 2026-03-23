# Game Asset Audit Report
Generated: 2026-03-11

## Summary
- Games audited: 21
- Games with all assets adequate: 6
- Games needing improvement: 15

## Asset Status Legend
- **OG Image**: og:image meta tag pointing to og-image.jpg
- **Background**: Background image (bg-opt.png/jpg) used in CSS or canvas
- **Sprites**: Image-based sprites loaded for gameplay elements
- **Canvas-only**: Elements drawn with fillRect/arc primitives that could benefit from image sprites

---

## Per-Game Status

### flappy-bird
- OG Image: OK (og-image.jpg exists, meta points to it)
- Background: OK (assets/bg-opt.jpg loaded in JS canvas)
- Sprites: bird-opt.png, pipe-opt.png, ground-opt.png all loaded
- Current assets: `bg-opt.jpg`, `bird-opt.png`, `ground-opt.png`, `pipe-opt.png`
- Recommendations:
  - Bird sprite (bird-opt.png) could be upgraded to a more detailed/polished sprite
  - Pipe sprite is used as a repeating tile; a more textured pipe image would improve visuals
  - Coins are drawn with canvas arc() primitives - could use a coin sprite
  - Star particles are canvas-only - low priority

### snake-game
- OG Image: OK
- Background: OK (CSS background-image references)
- Sprites: snake-head-opt.png, food-opt.png, body-opt.png loaded
- Current assets: `body-opt.png`, `food-opt.png`, `snake-head-opt.png`
- Recommendations:
  - Snake body segments use a mix of drawImage and fillRect fallback - body sprite is small/simple
  - Food items beyond apple use canvas gradient circles - additional food type sprites would help
  - Power-up items drawn as canvas primitives could use dedicated sprites
  - Overall sprites are functional but simple; AI-generated stylized versions would look better

### puzzle-2048
- OG Image: OK
- Background: OK (assets/bg-opt.jpg, CSS references)
- Sprites: N/A (DOM-based game, no canvas sprites needed)
- Current assets: `bg-opt.jpg`
- Recommendations:
  - DOM-based tile game; no sprite needs
  - Background image is adequate
  - **No improvements needed** - game renders via DOM elements with CSS styling

### block-puzzle
- OG Image: OK
- Background: OK (assets/bg-opt.jpg loaded in JS)
- Sprites: None - blocks drawn entirely with fillRect canvas primitives
- Current assets: `bg-opt.jpg`
- Recommendations:
  - **HIGH PRIORITY**: All tetromino blocks are drawn with plain fillRect - textured block sprites would significantly improve visual appeal
  - Ghost piece, next preview, and hold preview all use canvas primitives
  - Line clear effects are primitive-based
  - Recommend: Generate a sprite sheet for 7 tetromino block textures (I, O, T, S, Z, J, L)

### idle-clicker
- OG Image: OK
- Background: OK (assets/bg-opt.png, dungeon-bg-opt.jpg)
- Sprites: N/A (DOM-based with emoji rendering for monsters)
- Current assets: `bg-opt.png`, `dungeon-bg-opt.jpg`
- Recommendations:
  - **HIGH PRIORITY**: All monsters rendered as emoji (unicode characters) in DOM
  - Monster art extended via JS files (monster-art-ext.js, monster-art-ext2.js) but likely still emoji-based
  - AI-generated monster sprites would dramatically improve the dungeon RPG feel
  - Equipment items are emoji-based - could use item icon sprites
  - Pet system uses emoji (cat, dog, eagle, dragon, unicorn) - custom pet art would enhance engagement

### stack-tower
- OG Image: OK
- Background: OK (assets/bg-opt.jpg loaded in JS canvas)
- Sprites: None - blocks drawn with fillRect canvas primitives
- Current assets: `bg-opt.jpg`
- Recommendations:
  - **MEDIUM PRIORITY**: Tower blocks are plain colored rectangles via fillRect
  - Blocks could use textured/patterned sprites for each skin/theme
  - Falling pieces and cut-off pieces are all primitives
  - Particle effects are canvas squares - acceptable as particles

### road-shooter
- OG Image: OK
- Background: N/A (3D rendered via Three.js)
- Sprites: N/A (all entities rendered as 3D geometry via Three.js)
- Current assets: NO ASSETS DIRECTORY
- Recommendations:
  - Uses Three.js for full 3D rendering (207+ THREE.* calls in renderer3d.js)
  - Characters, enemies, bosses all rendered as 3D primitives (boxes, spheres, cylinders)
  - **MEDIUM PRIORITY**: 3D models are basic geometric shapes - could add texture maps for characters/enemies
  - Menu screens and UI are canvas-drawn - menu background image could be added
  - No assets/ directory exists at all - creating one with textures would help

### minesweeper
- OG Image: OK
- Background: N/A (CSS-only styling, no background image)
- Sprites: mine-opt.png, flag-opt.png loaded
- Current assets: `flag-opt.png`, `mine-opt.png`
- Recommendations:
  - Mine and flag sprites exist and are used
  - **No background image** - a subtle grid/pattern background could enhance the feel
  - Cell numbers are text-rendered - acceptable for minesweeper
  - Overall adequate; low priority for improvements

### emoji-merge
- OG Image: OK
- Background: OK (assets/bg-opt.jpg, CSS references)
- Sprites: N/A (DOM-based game using emoji characters for game pieces)
- Current assets: `bg-opt.jpg`
- Recommendations:
  - **HIGH PRIORITY**: Game pieces are emoji characters rendered in DOM
  - Evolution chains (egg to dragon, seed to world tree, etc.) use emoji
  - Custom-drawn evolution sprites would make the game much more visually distinctive
  - Merge animations are CSS-based - adequate
  - Background is adequate

### typing-speed
- OG Image: OK
- Background: OK (assets/bg-opt.png, CSS references)
- Sprites: N/A (DOM-based text game)
- Current assets: `bg-opt.png`
- Recommendations:
  - **No improvements needed** - purely text-based game, no graphical sprites needed
  - Background image is adequate

### word-guess
- OG Image: OK
- Background: OK (assets/bg-opt.jpg, CSS references)
- Sprites: N/A (DOM-based word game)
- Current assets: `bg-opt.jpg`
- Recommendations:
  - **No improvements needed** - Wordle-style game using DOM tiles with CSS styling
  - Background image is adequate

### word-scramble
- OG Image: OK
- Background: OK (assets/bg-opt.jpg, CSS references)
- Sprites: N/A (DOM-based word game)
- Current assets: `bg-opt.jpg`
- Recommendations:
  - **No improvements needed** - word puzzle game using DOM elements
  - Background image is adequate

### number-puzzle
- OG Image: OK
- Background: OK (assets/bg-opt.jpg, CSS reference)
- Sprites: N/A (DOM-based sliding tile puzzle)
- Current assets: `bg-opt.jpg`
- Recommendations:
  - **No improvements needed** - DOM-based number tile game
  - Background image is adequate

### brick-breaker
- OG Image: OK
- Background: OK (assets/bg-opt.jpg loaded in JS canvas)
- Sprites: paddle-opt.png, ball-opt.png loaded; bricks drawn with fillRect
- Current assets: `ball-opt.png`, `bg-opt.jpg`, `paddle-opt.png`
- Recommendations:
  - **MEDIUM PRIORITY**: Bricks are drawn entirely with fillRect canvas primitives
  - Textured brick sprites (cracked, metallic, glowing, etc.) would enhance the breakout experience
  - Power-up items drawn as fillRect rectangles with text - could use icon sprites
  - Paddle and ball sprites exist and are used
  - Particle effects are canvas circles - acceptable

### pong-game
- OG Image: OK
- Background: OK (assets/bg-opt.jpg loaded in JS canvas)
- Sprites: paddle-opt.png, ball-opt.png loaded
- Current assets: `ball-opt.png`, `bg-opt.jpg`, `paddle-opt.png`
- Recommendations:
  - Paddle and ball have sprites and are used with drawImage
  - Trail effects are canvas primitives - acceptable for neon aesthetic
  - **Low priority** - core assets are covered; the neon minimalist style works well

### color-memory
- OG Image: OK
- Background: OK (assets/bg-opt.png, CSS reference)
- Sprites: N/A (DOM-based Simon Says game)
- Current assets: `bg-opt.png`
- Recommendations:
  - **No improvements needed** - CSS-styled colored buttons, no graphical sprites needed
  - Background image is adequate

### memory-card
- OG Image: OK
- Background: N/A (no bg-opt file, CSS-only background)
- Sprites: card-back-opt.png used for card flip animation
- Current assets: `card-back.png`, `card-back-opt.png`
- Recommendations:
  - **MEDIUM PRIORITY**: Card faces use emoji characters - custom card face illustrations would look more polished
  - Card back image exists
  - Multiple themes use different emoji sets - could have themed card face sprites
  - No background image - adding one would improve visual depth

### maze-runner
- OG Image: OK
- Background: OK (assets/bg-opt.png, CSS reference)
- Sprites: player-opt.png, goal-opt.png loaded and used
- Current assets: `bg-opt.png`, `goal.png`, `goal-opt.png`, `player.png`, `player-opt.png`
- Recommendations:
  - Player and goal sprites exist and are used
  - **MEDIUM PRIORITY**: Walls are drawn with fillRect primitives - wall textures could add atmosphere
  - Enemy characters (added in recent sessions) may be canvas-drawn - enemy sprites could help
  - Keys and bonus items are likely canvas-drawn circles - item sprites would help
  - Has both raw and optimized versions of sprites (good practice)

### reaction-test
- OG Image: OK
- Background: OK (assets/bg-opt.png, CSS references)
- Sprites: target-opt.png loaded
- Current assets: `bg-opt.png`, `target.png`, `target-opt.png`
- Recommendations:
  - Target sprite exists
  - **No major improvements needed** - simple test game, visual complexity not required
  - Background image is adequate

### sky-runner
- OG Image: OK
- Background: OK (assets/space-bg-opt.jpg, bg-opt.png loaded in JS)
- Sprites: ship-opt.png loaded and used with drawImage
- Current assets: `bg-opt.png`, `ship.png`, `ship-opt.png`, `space-bg-opt.jpg`
- Recommendations:
  - **MEDIUM PRIORITY**: Obstacles (meteors, enemy ships, black holes, pipes, lasers) are ALL drawn with canvas primitives (arc, fillRect, custom draw functions)
  - 6 distinct obstacle types drawn procedurally - sprite images for each would improve visual quality
  - Ship sprite exists but obstacle variety would benefit most from AI sprites
  - Enemy ship function draws a simple triangle shape
  - Meteor function draws rough circles with craters
  - Black hole draws concentric circles

### zigzag-runner
- OG Image: OK
- Background: OK (assets/bg-opt.png, CSS reference)
- Sprites: NONE - entire game rendered with canvas primitives
- Current assets: `bg-opt.png`
- Recommendations:
  - **HIGH PRIORITY**: Player character drawn entirely with canvas primitives (circles/rectangles)
  - Path tiles drawn with fillRect
  - Coins drawn with arc() circles
  - Trail effects are canvas particles
  - A player character sprite and coin sprite would significantly improve visual polish
  - Path could use a textured tile image

---

## Priority Summary

### HIGH PRIORITY (biggest visual impact from AI sprites)
1. **idle-clicker** - All monsters, pets, and equipment are emoji-based. Monster/pet sprites would transform the RPG feel.
2. **emoji-merge** - Game pieces are emoji characters. Custom evolution sprites would differentiate the game.
3. **block-puzzle** - All tetromino blocks are plain fillRect. Textured block sprites needed.
4. **zigzag-runner** - Entire game is canvas primitives. Player sprite and coin sprite essential.

### MEDIUM PRIORITY (noticeable improvement)
5. **sky-runner** - 6 obstacle types drawn as canvas primitives. Obstacle sprites would add variety.
6. **brick-breaker** - Bricks and power-ups are fillRect primitives. Textured bricks and power-up icons needed.
7. **stack-tower** - Tower blocks are plain rectangles. Textured block sprites per theme.
8. **maze-runner** - Walls are primitives, enemies may lack sprites. Wall textures and enemy sprites.
9. **memory-card** - Card faces are emoji. Custom card face illustrations per theme.
10. **road-shooter** - 3D primitives only. Texture maps for 3D models would improve quality.

### LOW PRIORITY (adequate or design-appropriate)
11. **flappy-bird** - Has sprites but could be upgraded to higher quality.
12. **snake-game** - Has sprites; additional food/power-up sprites could help.
13. **minesweeper** - Has mine/flag sprites, missing background image.
14. **pong-game** - Has sprites; neon minimalist style works.
15. **reaction-test** - Has target sprite; simple game needs no more.

### NO IMPROVEMENTS NEEDED (DOM-based, no sprite rendering)
16. **puzzle-2048** - DOM tiles with CSS
17. **typing-speed** - Text-only game
18. **word-guess** - DOM tiles with CSS
19. **word-scramble** - DOM elements
20. **number-puzzle** - DOM tiles with CSS
21. **color-memory** - DOM buttons with CSS

---

## Recommended Nano Banana Generation Queue

### Batch 1: Monster/Character Sprites (idle-clicker)
- Slime monster sprite (green, cute RPG style)
- Skeleton warrior sprite
- Dragon boss sprite
- 5+ dungeon monster variety sprites
- Cat/Dog/Eagle/Dragon/Unicorn pet sprites
- Equipment icons (sword, shield, armor, ring, staff)

### Batch 2: Game Piece Sprites
- Tetromino block textures x7 colors (block-puzzle)
- Emoji evolution chain sprites x4 chains (emoji-merge)
- Zigzag runner player character sprite
- Zigzag runner coin sprite

### Batch 3: Obstacle/Environment Sprites
- Sky-runner: meteor, enemy ship, black hole, pipe, laser sprites
- Brick-breaker: 5+ brick texture variants (normal, cracked, metal, glow)
- Brick-breaker: power-up item icons (expand, shrink, multi-ball, laser)
- Stack-tower: textured block sprites per theme
- Memory-card: custom card face illustrations

### Batch 4: Quality Upgrades
- Flappy-bird: higher quality bird, pipe, ground sprites
- Snake-game: improved food/power-up sprites
- Maze-runner: wall texture, enemy sprites, key/bonus item sprites
- Minesweeper: subtle background pattern
- Road-shooter: 3D texture maps (if supported by Three.js setup)

---

## OG Image Status
All 21 games have og-image.jpg files present and og:image meta tags correctly pointing to them. No OG image issues found.
