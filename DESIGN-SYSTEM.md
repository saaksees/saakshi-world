# SAAKSHI WORLD Design System

## Visual Language
Retro-pixel game meets modern, readable UI — not childish, not a Mario clone.

## Color Tokens
All components use only these 8 Tailwind color tokens:

- `navy-deep` (#0F0A1E) - Background base
- `navy-panel` (#1B1330) - Panel/card backgrounds
- `pink-soft` (#F7A8C4) - Soft accents
- `pink-hot` (#FF3E8E) - Primary action color
- `lavender` (#B6A6E8) - Secondary borders and text
- `cream` (#F5EEE0) - Primary text color
- `pixel-gold` (#FFC94D) - Coin/currency indicators
- `electric-blue` (#4FD6FF) - XP indicators & focus rings

## Typography

### Font Families
- **Pixel Font** (Press Start 2P): Headings and HUD labels ONLY
  - Class: `font-pixel`
  - Never use for paragraph-length text (unreadable)
  
- **Sans Font** (Inter): All body copy and readable text
  - Class: `font-sans`
  - Default for paragraphs, descriptions, UI text
  
- **Mono Font** (JetBrains Mono): Skill tags and technical labels
  - Class: `font-mono`
  - Use for code snippets, tags, badges

## Components

### Button (`src/components/ui/Button.tsx`)
Two variants with proper accessibility:

**Primary Variant:**
- Pink-hot background, cream text
- Chunky pixel-style shadow (4px offset)
- Active state with shadow animation
- Focus ring: 4px electric-blue

**Secondary Variant:**
- Transparent background, lavender border
- Hover state with lavender tint
- Focus ring: 4px electric-blue

Usage:
```tsx
<Button variant="primary">Start Adventure</Button>
<Button variant="secondary">View Projects</Button>
```

### Modal (`src/components/ui/Modal.tsx`)
Dialogue box pattern with full accessibility:

**Features:**
- Slides up from bottom on mobile, centered on desktop
- Navy-panel background with lavender border
- Close button (×) top-right
- Closes on Escape key
- Closes on backdrop click
- Focus trap when open
- Prevents body scroll

Usage:
```tsx
<Modal isOpen={isOpen} onClose={handleClose} title="Welcome">
  <p>Modal content here</p>
</Modal>
```

### HUD (`src/components/ui/HUD.tsx`)
Heads-up display overlay:

**Features:**
- Fixed position, top of viewport
- Semi-transparent gradient background
- Left: Name and role (small pixel font)
- Right: XP (★ electric-blue) and coins (◆ pixel-gold) counters
- Pointer-events-none on container, auto on content

Usage:
```tsx
<HUD name="Saakshi" role="Developer" xp={1337} coins={42} />
```

### SkipButton (`src/components/ui/SkipButton.tsx`)
Persistent navigation button:

**Features:**
- Fixed bottom-right position
- Secondary button styling
- Always visible, always accessible
- Keyboard focusable with electric-blue ring

Usage:
```tsx
<SkipButton to="/portfolio" />
```

## Accessibility Standards

### Keyboard Navigation
✓ All interactive elements are keyboard accessible (Tab/Shift+Tab)
✓ Focus states are always visible (electric-blue, 4px ring)
✓ Modal traps focus when open
✓ Escape key closes modal
✓ Skip links allow bypassing game content

### Focus Management
- `focus-visible:outline-none` removes default outline
- `focus-visible:ring-4 focus-visible:ring-electric-blue` adds custom focus ring
- Focus rings are 4px for high visibility
- Electric-blue chosen for maximum contrast on all backgrounds

### ARIA & Semantic HTML
- Modal uses `role="dialog"` and `aria-modal="true"`
- Close button has `aria-label="Close modal"`
- Modal title linked with `aria-labelledby`

## Testing the System

### View the Styleguide
Navigate to `/styleguide` to see all components in action.

### Keyboard Navigation Test
1. Navigate to `/styleguide`
2. Press Tab repeatedly
3. Verify focus ring appears on:
   - Primary button
   - Primary button (disabled shows but can't activate)
   - Secondary button
   - Secondary button (disabled)
   - "Open Modal" button
   - Skip button (bottom-right)
4. Open modal, verify focus trap works
5. Press Escape to close modal

All interactive elements must be reachable and show electric-blue focus ring.

## File Structure
```
src/components/ui/
├── Button.tsx       - Primary & secondary button variants
├── Modal.tsx        - Accessible dialogue box
├── HUD.tsx          - Overlay stats display
└── SkipButton.tsx   - Persistent skip navigation
```

## Design Principles
1. **Readable First**: Pixel fonts only for headings, never body text
2. **Accessible Always**: Every interactive element is keyboard-accessible
3. **Retro, Not Childish**: Sophisticated color palette, modern UX patterns
4. **Focus Visibility**: Electric-blue focus rings on ALL interactive elements
5. **Consistent Tokens**: Only use the 8 predefined color tokens
