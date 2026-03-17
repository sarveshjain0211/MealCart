# 🎨 Visual Design Showcase

## Color Palette

### Light Mode
```
Background:    #FFFFFF (White)
Foreground:    #0F172A (Dark Gray)
Primary:       #A855F7 (Purple)
Secondary:     #F1F5F9 (Light Gray)
Accent:        #9333EA (Deep Purple)
Muted:         #64748B (Gray)
```

### Dark Mode
```
Background:    #0F172A (Dark)
Foreground:    #F8FAFC (Light)
Primary:       #A855F7 (Purple - same)
Secondary:     #1E293B (Dark Gray)
Accent:        #9333EA (Deep Purple - same)
Muted:         #94A3B8 (Light Gray)
```

## Component Showcase

### 🔘 Button Variants

**Default**
- Purple background
- White text
- Shadow on hover

**Gradient** (CTA buttons)
- Purple to pink gradient
- Smooth hover effect
- Recommended for main actions

**Outline**
- Transparent background
- Border only
- Hover fills background

**Ghost**
- Completely transparent
- Subtle hover effect
- Good for less emphasis

### 📦 Card Component

**Structure:**
```
┌─────────────────────┐
│   Image (56px)      │ ← Hover scales 110%
├─────────────────────┤
│ Badge   ❤️          │ ← Category + Favorite
├─────────────────────┤
│ Title               │
│ Description         │
│ ⏱️ Time 👥 Servings │
├─────────────────────┤
│ [View Recipe] →     │
└─────────────────────┘
```

**Effects:**
- Shadow increases on hover
- Image zooms on hover
- Border highlights on hover

### 🎭 Animations

**Page Load**
```
Elements fade in from bottom
Duration: 0.5s
Stagger delay: 0.1s per element
```

**Scroll Animations**
```
Elements animate into view
Trigger: When 20% visible
Once only: Yes
```

**Hover Effects**
```
Cards: Scale 1.02
Buttons: Shadow increases
Images: Scale 1.1
Text: Color changes
```

### 🎨 Special Effects

**Glass Morphism**
```css
backdrop-filter: blur(10px)
background: rgba(255, 255, 255, 0.05)
border: 1px solid rgba(255, 255, 255, 0.1)
```

**Gradient Text**
```css
background: linear-gradient(to right, purple-600, purple-400)
-webkit-background-clip: text
color: transparent
```

**Animated Gradient Background**
```css
background: linear-gradient(-45deg, 4 purple shades)
animation: gradient 15s ease infinite
background-size: 400% 400%
```

## Layout Breakdown

### 📐 Section Spacing
```
Hero:     min-h-screen + pt-20
Features: py-24
Search:   py-24
Recipes:  py-12
CTA:      py-24
Footer:   py-12
```

### 📱 Responsive Grid
```
Mobile (< 768px):   1 column
Tablet (768-1024):  2 columns
Desktop (> 1024):   3 columns
```

### 🎯 Container Width
```
Max width: 1400px
Padding:   16px (mobile), 32px (desktop)
Centered:  Yes
```

## Typography Scale

```
Hero Title:      48px (mobile) → 72px (desktop)
Section Title:   32px (mobile) → 48px (desktop)
Card Title:      20px
Body:            16px
Caption:         14px
Small:           12px
```

## Spacing System

```
xs:  4px   (0.25rem)
sm:  8px   (0.5rem)
md:  16px  (1rem)
lg:  24px  (1.5rem)
xl:  32px  (2rem)
2xl: 48px  (3rem)
3xl: 64px  (4rem)
```

## Border Radius

```
sm:  4px   - Small elements
md:  8px   - Default
lg:  12px  - Cards
xl:  16px  - Large cards
2xl: 24px  - Hero sections
full: 9999px - Circles/Pills
```

## Shadows

```
sm:  Shadow below (subtle)
md:  Shadow below (medium)
lg:  Shadow below (large)
xl:  Shadow below (extra large)
2xl: Shadow all around (dramatic)
```

## Icon Sizes

```
xs:  12px
sm:  16px
md:  20px (default)
lg:  24px
xl:  32px
```

## Z-Index Layers

```
Background:      -10
Normal:          0
Header:          50
Overlay:         40
Modal:           50
Toast:           100
```

## Animation Timings

```
Fast:    150ms  - Color changes
Normal:  300ms  - Most transitions
Slow:    500ms  - Page transitions
Slower:  1000ms - Large movements
```

## Breakpoints Reference

```
sm:  640px   - Small tablets
md:  768px   - Tablets
lg:  1024px  - Small laptops
xl:  1280px  - Laptops
2xl: 1400px  - Desktops
```

## Component States

### Button States
```
Default:  Normal appearance
Hover:    Darker background, larger shadow
Active:   Slightly smaller scale
Focus:    Ring around button
Disabled: 50% opacity, no pointer events
```

### Input States
```
Default:  Border visible
Focus:    Primary color border, ring
Error:    Red border
Disabled: Muted background
```

### Card States
```
Default:  Shadow-sm
Hover:    Shadow-lg, border-primary
Active:   Scale 0.98
```

## Accessibility

### Focus States
```
Ring: 2px solid primary color
Offset: 2px from element
Visible: Yes (never hidden)
```

### Color Contrast
```
Normal text:    4.5:1 minimum
Large text:     3:1 minimum
Interactive:    3:1 minimum
```

### Touch Targets
```
Minimum size:   44x44px
Padding:        12px minimum
Spacing:        8px between
```

## Performance

### Image Optimization
```
Format:   WebP with JPEG fallback
Loading:  Lazy loading
Sizes:    Responsive srcset
```

### Code Splitting
```
Route-based: Yes
Component:   Lazy loading
Dynamic:     Import as needed
```

### CSS
```
Purging:     Unused classes removed
Minification: Production only
Critical:     Inline critical CSS
```

---

**This design system ensures consistency across all components! 🎨**
