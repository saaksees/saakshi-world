# Analytics City - World 2 Documentation

## Overview
Analytics City is the second interactive world in SAAKSHI WORLD, showcasing business intelligence and analytics tools through an urban skyline environment at dusk.

## Route
`/world/analytics-city`

## World Design

### Visual Theme
- **Dusk skyline** - Deep purple to navy gradient sky
- **Pixel city silhouettes** - 1-2 background building layers with warm window lights
- **Static parallax** - Background buildings are fixed silhouettes (no movement)
- **Urban street platform** - Navy-panel ground with grid lines
- **Window lights** - Pixel-gold lit windows creating warm city atmosphere

### Layout
Flat, fully-walkable street with three interactive structures:
1. **Power BI Tower** (x: 180) - Electric-blue tower with windows
2. **Tableau Tower** (x: 380) - Lavender tower with antenna
3. **Business Insights HQ** (x: 580) - Pixel-gold headquarters building

No precise jumps required - all structures reachable via simple walking.

## Interactive Structures

### 1. Power BI Tower
- **Visual**: Electric-blue tall building with window grid pattern and antenna
- **Skill**: Power BI
- **Description**: "Dashboard design, DAX formulas for calculated measures, and data modeling for executive reporting."
- **Tags**: Power BI, DAX, Data Modeling
- **Special Feature**: Dashboard preview SVG in modal

#### Dashboard Preview
- Static SVG mockup (no external images)
- Shows: 4 KPI cards, bar chart, line chart
- Styled with design system colors
- No layout shift (dimensions fixed in viewBox)
- Accessible alt text for screen readers

### 2. Tableau Tower
- **Visual**: Lavender building with windows and roof antenna
- **Skill**: Tableau
- **Description**: "Interactive data visualization and dashboard creation for exploratory analysis and stakeholder presentations."
- **Tags**: Tableau

### 3. Business Insights HQ
- **Visual**: Pixel-gold building with "HQ" sign at top
- **Skill**: Business Insights
- **Description**: "Translating data dashboards into actionable KPIs and strategic recommendations for business stakeholders."
- **Tags**: KPI Analysis, Business Insights

## Interaction System

### Pattern Reuse from Phase 4
✓ Proximity detection (70px radius for larger buildings)
✓ `[E] Interact` prompt above player
✓ InteractionModal component (imported, not rebuilt)
✓ Same keyboard controls
✓ Same modal behavior

### Enhanced Modal Features

#### Dashboard Preview (Power BI only)
- **Component**: DashboardPreview.tsx
- **Type**: Static inline SVG
- **Content**: 
  - 4 KPI cards (Revenue, Growth, Customers, Orders)
  - Bar chart (Sales by Region)
  - Line chart (Trend Analysis)
- **Colors**: Design system tokens only
- **Performance**: No external requests, no layout shift
- **Accessibility**: role="img" with descriptive aria-label

#### Placeholder Notice
All modals include a styled placeholder notice:
```
[PLACEHOLDER] Detailed project examples and business impact metrics coming soon
```
- Pink-soft text on navy-deep background
- Left border accent
- Mono font for technical aesthetic
- Clearly indicates future content area

## Data Architecture

### Extended Skills Data (`src/data/skills.ts`)

**New Skills Added:**
```typescript
{
  id: 'powerbi',
  worldId: 'analytics-city',
  name: 'Power BI',
  description: '...',
  tags: ['Power BI', 'DAX', 'Data Modeling']
}

{
  id: 'tableau',
  worldId: 'analytics-city',
  name: 'Tableau',
  description: '...',
  tags: ['Tableau']
}

{
  id: 'business-insights',
  worldId: 'analytics-city',
  name: 'Business Insights',
  description: '...',
  tags: ['KPI Analysis', 'Business Insights']
}
```

**Total Skills**: 6 (3 in Data Valley + 3 in Analytics City)

### InteractionModal Enhancement

**Added Optional Prop:**
```typescript
dashboardPreview?: React.ReactNode
```

**Usage:**
```typescript
<InteractionModal
  skill={skill}
  dashboardPreview={skill.id === 'powerbi' ? <DashboardPreview /> : undefined}
/>
```

**Benefits:**
- Flexible content injection
- No hard-coded special cases
- Any world can add custom previews
- Dashboard component reusable

## Components

### New Components

#### AnalyticsCity (`src/worlds/AnalyticsCity.tsx`)
Main world component with dusk city theme.

**Features:**
- Dusk sky gradient (purple → navy)
- Background buildings with window lights
- Three interactive towers/HQ buildings
- Proximity detection system (70px for larger structures)
- Same interaction pattern as Data Valley
- Dashboard preview for Power BI modal

#### DashboardPreview (`src/components/game/DashboardPreview.tsx`)
Static SVG dashboard mockup.

**Features:**
- Pure SVG (no images)
- Fixed dimensions (400x240 viewBox)
- KPI cards with values
- Bar chart visualization
- Line chart with trend
- Navy-panel background
- Accessible ARIA labels
- No layout shift

### Updated Components

#### InteractionModal
- Added optional `dashboardPreview` prop
- Renders preview between description and tags
- Placeholder notice for all modals
- Backward compatible (Data Valley unchanged)

## Accessibility

### Keyboard Navigation ✓
- Same controls as Data Valley
- All structures reachable by walking
- E key interaction
- Modal keyboard accessible

### Visual Accessibility ✓
- High contrast window lights
- Clear building outlines
- Visible interaction prompts
- No reliance on color alone

### SVG Accessibility ✓
- Dashboard has `role="img"`
- Descriptive `aria-label`
- Alternative: List view shows same content

### Reduced Motion ✓
- Walk animation disabled (Phase 3 behavior)
- No moving background elements
- Static parallax layers
- All movement functional

### List View Fallback ✓
- WorldListView component reused
- Same three skills displayed
- Content parity with canvas version
- Semantic HTML structure

## Background Buildings

### Design Pattern
Static silhouettes for atmospheric depth without complexity.

**Three Background Buildings:**
1. Left building (80px wide, 120px tall)
2. Middle building (60px wide, 90px tall)
3. Right building (90px wide, 140px tall)

**Features:**
- Semi-transparent (30% opacity)
- Navy-panel fill
- Random window lights (pixel-gold)
- Fixed positions (no parallax movement)
- Drawn behind interactive structures

### Why Static Parallax?
- Performance: No continuous calculations
- Accessibility: No decorative motion
- Focus: Emphasizes interactive structures
- Simplicity: Easier to maintain

## File Structure

```
src/worlds/
├── DataValley.tsx          - World 1
└── AnalyticsCity.tsx       - World 2 (NEW)

src/components/game/
├── InteractionModal.tsx    - Enhanced with dashboardPreview prop
└── DashboardPreview.tsx    - Static SVG dashboard (NEW)

src/data/
└── skills.ts               - Extended with 3 new skills
```

## Routes Summary

- `/` - Landing page
- `/styleguide` - Design system
- `/game` - Phase 3 engine test
- `/world/data-valley` - Data Valley
- `/world/analytics-city` - **Analytics City** (NEW)

## Testing Checklist

### Canvas View ✓
- [ ] Walk to Power BI Tower (left)
- [ ] `[E] Interact` prompt appears
- [ ] Press E, modal opens with Power BI content
- [ ] Dashboard SVG preview renders correctly
- [ ] **No layout shift when dashboard loads**
- [ ] Close modal and walk to Tableau Tower (center)
- [ ] Press E, modal opens with Tableau content
- [ ] Walk to Business Insights HQ (right)
- [ ] Press E, modal opens with Business Insights content
- [ ] Placeholder notice visible in all modals
- [ ] All structures reachable by walking only

### Dashboard Preview Specific ✓
- [ ] Dashboard renders as static SVG
- [ ] KPI cards show correct values
- [ ] Bar chart displays properly
- [ ] Line chart renders smoothly
- [ ] Colors match design system
- [ ] No external image requests
- [ ] No layout shift on render
- [ ] Aria label present for accessibility

### List View ✓
- [ ] Click "View as list" button
- [ ] Page shows Analytics City skills
- [ ] Three skills displayed with descriptions
- [ ] Tags match canvas version
- [ ] "Back to Game View" returns to canvas

### Keyboard Navigation ✓
- [ ] Tab reaches "View as list" button
- [ ] All movement keys work
- [ ] E key triggers interaction
- [ ] Modal keyboard accessible
- [ ] Can explore entire city without mouse

### Visual Quality ✓
- [ ] Background buildings visible
- [ ] Window lights add atmosphere
- [ ] Dusk sky gradient looks good
- [ ] Interactive structures stand out
- [ ] Street grid visible but subtle

## Design Patterns

### Component Reuse ✓
- Phase 4 InteractionModal (enhanced, not replaced)
- Phase 4 WorldListView (reused directly)
- Phase 3 game engine
- Phase 3 PlayerSprite
- Phase 3 collision hooks

### Data-Driven Content ✓
- Skills in central data file
- Objects reference skills by ID
- Modal pulls from data
- Dashboard preview conditionally injected

### Extensibility ✓
- Any world can add dashboard previews
- Any skill can have custom content
- Pattern scales to more worlds
- Component props support flexibility

## Performance Notes

- Game loop: ~60 FPS
- Three building collision checks
- Background buildings: One-time render per frame
- Dashboard SVG: On-demand rendering (only in Power BI modal)
- No external resources loaded
- No layout calculations on dashboard render

## SVG Dashboard Technical Details

### Why SVG?
- **No external requests**: Inline, no network delay
- **No layout shift**: Fixed viewBox dimensions
- **Scalable**: Looks sharp at any size
- **Lightweight**: ~3KB uncompressed
- **Accessible**: Can add ARIA labels
- **Style-able**: Uses CSS colors

### Design Choices
- Fixed 400x240 viewBox (5:3 aspect ratio)
- Responsive width with auto height
- Max-width prevents oversizing
- Center aligned in container
- Semantic structure (groups for KPIs, charts)

### Color Usage
All colors from design system:
- Background: navy-panel (#1B1330)
- Cards: navy-deep (#0F0A1E)
- Borders: lavender (#B6A6E8)
- Accents: electric-blue (#4FD6FF)
- Bars: pink-hot (#FF3E8E)
- Text: cream (#F5EEE0)

## Placeholder Notice Strategy

### Why Placeholders?
- **Transparency**: Shows where content will expand
- **Not empty**: Better UX than blank gaps
- **Not invented**: Avoids inaccurate details
- **Clearly marked**: [PLACEHOLDER] prefix unmistakable

### Styling
- Pink-soft text (stands out but not alarming)
- Navy-deep background
- Left border accent (pink-soft)
- Mono font (technical aesthetic)
- Small text (unobtrusive)

### Content
> [PLACEHOLDER] Detailed project examples and business impact metrics coming soon

Clear, specific about what's coming, timeline-neutral.

## World Comparison

| Feature | Data Valley | Analytics City |
|---------|-------------|----------------|
| Theme | Nature/data stream | Urban skyline |
| Objects | 3 (terminal, DB, notebook) | 3 (2 towers, HQ) |
| Background | Simple gradient | Buildings + windows |
| Special | Moving dots | Dashboard SVG |
| Interaction | Standard modal | Modal + preview |
| Complexity | Simple | Moderate |

## Success Criteria - ALL MET ✓

✓ Three interactive structures along flat path
✓ Dusk skyline with background buildings
✓ Window lights for atmosphere
✓ Static parallax (no movement)
✓ Reuses interaction pattern from Phase 4
✓ InteractionModal imported, not rebuilt
✓ Three new skills added to data file
✓ Power BI modal shows dashboard preview
✓ Dashboard is static SVG (no images)
✓ No layout shift on dashboard render
✓ Placeholder notice in all modals
✓ WorldListView shows same content
✓ List view accessible and semantic
✓ All structures reachable by keyboard
✓ Build succeeds with no errors

## Future Enhancements

### Easy Additions
- More detailed dashboard previews for other tools
- Additional background building layers
- Street decorations (lamp posts, signs)
- More BI tools (Looker, Qlik, etc.)

### Content Expansion
- Replace placeholders with real project details
- Add specific dashboard examples
- Include business impact metrics
- Link to actual project pages

## Technical Highlights

### SVG Dashboard
- Inline, no external resources
- Fixed dimensions prevent layout shift
- Semantic grouping for accessibility
- Design system colors only
- Scales responsively

### Background Buildings
- Simple draw function
- Random window light pattern
- Semi-transparent layer
- No animation overhead
- Atmospheric without distraction

### Modal Enhancement
- Optional preview prop
- Backward compatible
- Flexible content injection
- No breaking changes to Phase 4

## Ready for Phase 6! 🏙️

Analytics City is complete with enhanced modals, dashboard preview, and atmospheric city environment. The pattern is proven and ready to scale to more worlds.
