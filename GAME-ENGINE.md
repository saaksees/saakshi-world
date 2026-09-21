# Game Engine Documentation

## Phase 3: Core Game Engine - Player Movement

### Overview
A fully functional 2D side-scrolling game engine with responsive player movement, physics, and collision detection. Built with HTML5 Canvas and hand-rolled physics (no external physics libraries).

## Components

### GameCanvas (`src/components/game/GameCanvas.tsx`)
The main game rendering and logic component.

**Features:**
- Responsive canvas that fills container and handles resize
- 60 FPS game loop using `requestAnimationFrame`
- Sky background gradient (navy-panel → navy-deep)
- Ground platform with lavender edge and grid pattern
- Real-time debug info overlay (position, grounded state, controls)

**Game Loop:**
1. Handle input from keyboard controls
2. Update player velocity (horizontal movement, gravity, jump)
3. Apply physics (position updates)
4. Check collisions (platform, canvas bounds)
5. Update animation frames
6. Render scene (background, ground, player)

**Constants:**
- `GRAVITY = 0.5` - Downward acceleration
- `JUMP_FORCE = -12` - Upward velocity on jump
- `MOVE_SPEED = 5` - Horizontal movement speed
- `PLAYER_WIDTH = 32px` - Player bounding box width
- `PLAYER_HEIGHT = 48px` - Player bounding box height
- `GROUND_HEIGHT = 80px` - Platform height from bottom

### PlayerSprite (`src/components/game/PlayerSprite.tsx`)
Renders an original pixel-art explorer character.

**Character Design:**
- Explorer with satchel/notebook on back
- Colors: pink-soft body, lavender satchel, pixel-gold accent
- Square head with navy-deep outline
- Rectangular body and legs
- Small satchel on right shoulder

**Animation States:**
1. **Idle**: Legs straight, standing still
2. **Walk**: 2-frame cycle with alternating leg positions (8 frames per step)
3. **Jump**: Both legs together in jumping pose

**Features:**
- Horizontal flip when facing left
- Smooth walk cycle animation
- Distinct jump pose
- Respects `prefers-reduced-motion` (disables walk animation but keeps movement functional)

## Hooks

### useKeyboardControls (`src/hooks/useKeyboardControls.ts`)
Tracks keyboard input state for game controls.

**Supported Keys:**
- **Left**: Arrow Left, A
- **Right**: Arrow Right, D
- **Jump**: Arrow Up, W, Space
- **Reset**: R (debug key, will be removed in Phase 15)

**Returns:** `KeyState` object with boolean flags for each action

**Features:**
- Prevents Space key from scrolling the page
- Proper key press/release tracking
- Cleanup on unmount

### useCollision (`src/hooks/useCollision.ts`)
Provides collision detection utilities.

**Functions:**

1. `checkAABB(box1, box2)` - Axis-Aligned Bounding Box collision
2. `checkPlatformCollision(player, platform, velocityY)` - Platform landing detection
   - Only triggers when falling (velocityY > 0)
   - Checks if player's feet are at platform top
   - Verifies horizontal overlap
3. `constrainToCanvas(x, y, width, height, canvasWidth, canvasHeight)` - Bounds checking
   - Prevents player from leaving canvas edges
   - Returns constrained position

## Physics System

### Gravity & Velocity
- Gravity constantly accelerates player downward when not grounded
- Jump applies negative velocity (upward force)
- Horizontal velocity is immediate (no acceleration/deceleration)

### Collision Response
- **Platform Landing**: Snap player to platform top, zero vertical velocity, set grounded
- **Canvas Bounds**: Constrain position to prevent escaping viewport
- **No Fall Damage**: Player can jump from any height safely
- **No Death State**: Cannot get stuck or fall through world

### Movement Feel
- **Responsive**: Zero input lag, immediate response to key presses
- **Believable Arc**: Parabolic jump trajectory with gravity
- **Clean Landing**: Smooth transition from air to ground
- **Edge Stopping**: Player stops at canvas edges, no clipping

## Controls

| Action | Keys |
|--------|------|
| Move Left | ← or A |
| Move Right | → or D |
| Jump | ↑ or W or Space |
| Reset Position | R (debug only) |

## Accessibility

### Keyboard Only
- 100% keyboard accessible (no mouse required)
- All movement and actions via keyboard

### Reduced Motion
- Respects `prefers-reduced-motion` media query
- Movement remains fully functional
- Skips walk cycle animation (legs stay in idle pose)
- No decorative particles or flourishes

## Testing

### Desktop Keyboard Test Checklist
✓ Walk left using A or ←
✓ Walk right using D or →
✓ Character flips direction when changing movement
✓ Jump using Space, ↑, or W
✓ Jump has believable arc (goes up, comes down smoothly)
✓ Lands cleanly on platform without bouncing or clipping
✓ Cannot walk off screen edges
✓ Cannot jump through ceiling
✓ Cannot fall through platform
✓ Press R to reset to starting position
✓ Movement is responsive with no visible lag

### Responsive Canvas Test
✓ Canvas fills container
✓ Resizes when browser window changes
✓ Player position scales appropriately
✓ Ground platform remains at bottom

## File Structure
```
src/components/game/
├── GameCanvas.tsx    - Main game loop and rendering
└── PlayerSprite.tsx  - Character drawing function

src/hooks/
├── useKeyboardControls.ts  - Input state management
└── useCollision.ts         - Collision detection utilities

src/components/
└── Game.tsx  - Game page wrapper with controls instructions
```

## Routes
- `/game` - Playable game engine test page

## Design Decisions

### Why Hand-Rolled Physics?
- Simple requirements don't justify a physics library
- Full control over game feel and collision response
- Smaller bundle size
- Learning opportunity

### Why Canvas Over DOM?
- Better performance for sprite animation
- Pixel-perfect rendering control
- Standard for 2D game development
- Easy to add particles, effects later

### Why No Death/Damage?
- Phase 3 focus: prove movement feels good
- Complexity comes in later phases
- Testing requires uninterrupted play

## Next Steps (Future Phases)
- Remove debug R key before deployment (Phase 15)
- Wire up HUD component with actual player state
- Add world content (obstacles, collectibles, NPCs)
- Implement game states (start, pause, complete)
- Add sound effects and music
- Particle effects on landing/jumping (if motion allowed)

## Performance Notes
- Game loop runs at ~60 FPS via `requestAnimationFrame`
- Canvas clears and redraws entire scene each frame
- Lightweight sprite drawing (no images, pure canvas drawing)
- No memory leaks - proper cleanup on unmount
