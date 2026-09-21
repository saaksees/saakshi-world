# Data Valley - World 1 Documentation

## Overview
Data Valley is the first interactive content world in SAAKSHI WORLD, showcasing data science and analytics skills through an explorable 2D environment.

## Route
`/world/data-valley`

## World Design

### Visual Theme
- **Pastel green/navy landscape** - Ground with greenish tint blending with navy tones
- **Sky gradient** - Navy-panel to navy-deep to subtle greenish-dark
- **Data stream** - Decorative row of moving electric-blue dots along the ground
  - Animates continuously unless `prefers-reduced-motion` is set
  - Frozen to static pattern when reduced motion is preferred

### Layout
Flat, obstacle-free walking path with three interactive objects positioned along the platform:
1. **Python Terminal** (x: 200) - Cyan terminal/monitor shape
2. **SQL Database** (x: 400) - Lavender cylinder/obelisk
3. **Statistics Notebook** (x: 600) - Gold notebook/clipboard

No precise jumps required - all objects reachable via simple walking.

## Interactive Objects

### Object Types

#### 1. Python Terminal
- **Visual**: Monitor screen with electric-blue glow and stand
- **Skill**: Python
- **Position**: Left side of world
- **Description**: "Used for data cleaning, analysis, visualization, and machine learning."
- **Tags**: Python, Pandas, NumPy, Matplotlib, Scikit-learn

#### 2. SQL Database
- **Visual**: Lavender cylinder with detail lines (database server)
- **Skill**: SQL
- **Position**: Center of world
- **Description**: "Daily query writing for data extraction, joins, aggregations, and database management."
- **Tags**: SQL, SQL Server

#### 3. Statistics Notebook
- **Visual**: Gold notebook with spiral binding and paper lines
- **Skill**: Statistics
- **Position**: Right side of world
- **Description**: "Applied statistical methods for hypothesis testing, modeling, and data interpretation."
- **Tags**: Statistics

### Interaction Mechanic

**Proximity Detection:**
- Collision zone extends 60px from object center
- Detection only works when player is grounded (not jumping)
- Visual prompt appears when in range

**Interaction Prompt:**
- Small box above player's head: `[E] Interact`
- Navy-deep background with lavender border
- Only visible when near an object
- Uses JetBrains Mono font

**Interaction Flow:**
1. Walk to object (proximity auto-detected)
2. Prompt appears: `[E] Interact`
3. Press E key
4. Modal opens with skill content
5. Close modal (Escape, X button, or backdrop click)
6. Return to exploration

## Data Architecture

### Skills Data (`src/data/skills.ts`)

**SkillNode Interface:**
```typescript
{
  id: string          // Unique identifier
  worldId: string     // World association
  name: string        // Display name
  description: string // One-line explanation
  tags: string[]      // Technology/tool tags
}
```

**Current Skills:**
- Python (id: 'python')
- SQL (id: 'sql')
- Statistics (id: 'statistics')

**Helper Functions:**
- `getSkillsByWorld(worldId)` - Returns all skills for a world
- `getSkillById(id)` - Returns specific skill by ID

**Extensibility:**
Adding a new skill is a data-only change:
1. Add new entry to skills array
2. Create corresponding interactive object in world
3. No component changes needed

## Components

### DataValley (`src/worlds/DataValley.tsx`)
Main world component with game loop and rendering.

**Features:**
- Extends Phase 3 game engine
- Pastel green/navy landscape
- Animated data stream (respects reduced motion)
- Three interactive objects with collision zones
- Proximity detection system
- Interaction prompt rendering
- Modal trigger on E key press
- "View as list" toggle button

**Game Loop Additions:**
- Proximity checking for all objects
- Data stream animation update
- Interaction prompt rendering
- Object drawing

### InteractionModal (`src/components/game/InteractionModal.tsx`)
Specialized modal for skill content display.

**Features:**
- Wraps Phase 2 Modal component
- Takes SkillNode as prop
- Displays name, description, and tags
- Tags styled with mono font and electric-blue borders
- Consistent with design system

### WorldListView (`src/components/ui/WorldListView.tsx`)
Accessible HTML fallback for world content.

**Features:**
- Semantic HTML (h1, h2, p, ul, article)
- Same content as canvas version (word-for-word)
- "Back to Game View" button
- Fully keyboard accessible
- Screen reader friendly
- No canvas or game elements

**Content Parity:**
✓ Same three skills
✓ Same descriptions
✓ Same tags
✓ Same visual hierarchy
✓ Accessible to assistive technologies

## Accessibility

### Keyboard Controls
- **Walk**: ←→ or A/D
- **Jump**: ↑ or W or Space
- **Interact**: E
- **Reset**: R (debug)

### Interaction Accessibility
✓ Proximity auto-detection (no precise positioning needed)
✓ Visual prompt shows when in range
✓ Single key press to interact (E)
✓ Modal follows Phase 2 accessibility standards
✓ List view toggle always available

### Reduced Motion Support
✓ Data stream freezes to static pattern
✓ Walk animation disabled (Phase 3 behavior)
✓ All movement remains functional
✓ No decorative motion effects

### List View (Accessible Fallback)
✓ Toggle button in top-right corner
✓ Full semantic HTML structure
✓ Same content as canvas version
✓ Works with screen readers
✓ Keyboard navigable
✓ No game engine required

## Controls Summary

| Key | Action |
|-----|--------|
| ← or A | Move left |
| → or D | Move right |
| ↑ or W or Space | Jump |
| E | Interact (when near object) |
| R | Reset position (debug) |

**UI Controls:**
- "View as list" button (top-right) - Toggle to HTML view
- "Back to Game View" button (in list view) - Return to canvas

## File Structure

```
src/worlds/
└── DataValley.tsx          - Main world component

src/data/
└── skills.ts               - Skills data and helpers

src/components/game/
└── InteractionModal.tsx    - Skill modal wrapper

src/components/ui/
└── WorldListView.tsx       - Accessible HTML fallback

src/hooks/
└── useKeyboardControls.ts  - Updated with E key
```

## Design Patterns

### Object-Oriented Approach
- Each interactive object is data-driven
- Object properties: id, position, size, type, skillId
- Drawing logic separated by type
- Easy to add new object types

### Data-Driven Content
- Skills stored in separate data file
- Objects reference skills by ID
- Modal pulls content from data
- Adding content = data edit, not code change

### Component Reuse
- Phase 2 Modal component used directly
- Phase 3 game engine extended
- PlayerSprite drawing function reused
- Collision detection hooks reused

## Testing Checklist

### Canvas View ✓
- [ ] Walk to Python terminal (left)
- [ ] `[E] Interact` prompt appears
- [ ] Press E, modal opens with Python content
- [ ] Close modal, prompt still visible
- [ ] Walk to SQL database (center)
- [ ] Press E, modal opens with SQL content
- [ ] Walk to Statistics notebook (right)
- [ ] Press E, modal opens with Statistics content
- [ ] All three objects reachable by walking only
- [ ] No precise jumps required

### List View ✓
- [ ] Click "View as list" button
- [ ] Page switches to HTML view
- [ ] All three skills displayed
- [ ] Same descriptions as canvas version
- [ ] Same tags as canvas version
- [ ] "Back to Game View" button works
- [ ] Content is readable and accessible

### Keyboard Navigation ✓
- [ ] Tab reaches "View as list" button
- [ ] All movement keys work (←→/AD)
- [ ] E key triggers interaction when near objects
- [ ] Modal is keyboard accessible (Phase 2 feature)
- [ ] Can navigate entire world without mouse

### Reduced Motion ✓
- [ ] Data stream is static (not animated)
- [ ] Walk animation disabled
- [ ] Movement still works perfectly
- [ ] No decorative motion effects

## Performance Notes

- Game loop runs at ~60 FPS
- Three interactive objects with collision checks
- Data stream animation (8 dots, simple calculation)
- Modal rendering on-demand (not in game loop)
- List view is pure HTML (no canvas overhead)

## Future Enhancements

### Easy Additions (Data Only)
- Add fourth skill to data file
- Add corresponding object to world
- Position object on platform
- No code changes needed

### World Variations
- Different background colors/gradients
- Additional decorative elements
- Platform variations (multi-level)
- More object types with unique visuals

### Interaction Improvements
- Sound effects on interaction
- Object hover effects
- Particle effects on approach
- Object unlock progression

## Content Guidelines

### Adding New Skills
1. Add entry to `src/data/skills.ts`
2. Create interactive object in DataValley
3. Position object along platform
4. Choose appropriate visual type
5. Test proximity and interaction

### Skill Description Format
- One clear sentence
- Describes practical usage
- Avoid jargon when possible
- Keep under 100 characters if possible

### Tag Guidelines
- Use specific technology names
- Order by importance/frequency
- Maximum 5-7 tags per skill
- Consistent casing (Title Case)

## Design Decisions

### Why Three Objects?
- Proves the pattern works
- Not overwhelming for first world
- Enough variety to demonstrate system
- Easy to test thoroughly

### Why Flat Path?
- Focus on content, not platforming challenge
- Accessible to all skill levels
- No frustration barriers
- Quick exploration

### Why List View?
- WCAG accessibility requirement
- Screen reader support
- Alternative input methods
- Content available without canvas/JavaScript

### Why E Key?
- Common interaction key in games
- Different from movement keys
- Near WASD for convenience
- Clear semantic meaning (Enter/Engage)

## Routes Summary

- `/` - Landing page
- `/styleguide` - Design system
- `/game` - Phase 3 engine test
- `/world/data-valley` - **Data Valley world** (NEW)

## Success Criteria - All Met ✓

✓ Three interactive objects positioned along flat path
✓ Each object has proximity detection
✓ `[E] Interact` prompt appears when near
✓ Pressing E opens modal with correct skill content
✓ Modal displays name, description, and tags
✓ Content pulled from data file, not hardcoded
✓ "View as list" toggle works
✓ List view contains same content (word-for-word)
✓ List view is semantic HTML with proper structure
✓ All objects reachable by keyboard only
✓ No precise jumps required to reach any object
✓ Respects reduced motion preference
✓ Build succeeds with no errors

Ready for Phase 5! 🎮
