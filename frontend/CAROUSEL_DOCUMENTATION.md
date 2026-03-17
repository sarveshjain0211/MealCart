# Testimonials Carousel Documentation

## Overview

The **TestimonialsCarousel** component is an interactive carousel that displays customer testimonials with auto-scrolling functionality. It's designed to be fully responsive, accessible, and visually engaging.

## File Structure

```
frontend/src/components/sections/
├── TestimonialsCarousel.jsx      # Main carousel component
├── TestimonialsCarousel.css      # Carousel styling and animations
└── Testimonials.jsx              # Original static grid (deprecated)
```

## Component Features

### 1. **Auto-Scrolling**
- Automatically advances to the next testimonial every **4 seconds**
- Pauses when user interacts (clicks navigation, hovers, etc.)
- Resumes automatically after **10 seconds of inactivity**
- Visual indicator shows auto-scroll status

### 2. **Responsive Design**
Adapts the number of visible testimonials based on screen size:
- **Mobile** (< 768px): 1 testimonial per view
- **Tablet** (768px - 1024px): 2 testimonials per view
- **Desktop** (> 1024px): 3 testimonials per view

### 3. **Navigation Controls**
- **Previous/Next Buttons**: Large, accessible buttons on sides
- **Dot Indicators**: Shows current position and allows direct navigation
- **Keyboard Support**: Full keyboard navigation support

### 4. **Auto-Scroll Behavior**
```
User Interaction Timeline:
├─ Auto-scrolling active (4s interval)
├─ User clicks button/dot → Auto-scroll pauses
├─ 10-second inactivity → Auto-scroll resumes
└─ Loop back to start
```

## Component Props

The `TestimonialsCarousel` component currently uses hardcoded testimonials but can be extended to accept props:

```jsx
<TestimonialsCarousel 
  testimonials={customTestimonials}  // Optional: custom testimonials array
  autoScrollInterval={5000}          // Optional: custom interval (ms)
  itemsPerView={3}                   // Optional: fixed items per view
/>
```

## Testimonials Data Structure

Each testimonial object should have:

```javascript
{
  id: 1,
  name: "Name",
  role: "User Role",
  image: "😊",           // Emoji avatar
  rating: 5,             // 1-5 stars
  text: "Testimonial text...",
  highlight: "Key phrase"
}
```

## Current Testimonials

The carousel includes 6 default testimonials:

1. **Sarah Chen** - Busy Professional (👩‍💼)
   - Quote: "MealCart has completely changed how I approach meal planning..."
   - Highlight: Time-saving

2. **Marcus Johnson** - Fitness Coach (💪)
   - Quote: "As a fitness coach, I'm always looking for healthy recipe ideas..."
   - Highlight: Nutrition-focused

3. **Jennifer Davis** - Parent (👨‍👩‍👧‍👦)
   - Quote: "Getting my kids to eat healthy vegetables is a challenge..."
   - Highlight: Family-friendly

4. **David Rodriguez** - Chef (👨‍🍳)
   - Quote: "The recipe suggestions are creative and practical..."
   - Highlight: Chef-approved

5. **Emily Watson** - Student (📚)
   - Quote: "Budget-friendly recipes are exactly what I need..."
   - Highlight: Budget-conscious

6. **Tom Anderson** - Health Enthusiast (🏃)
   - Quote: "I love the dietary filter options..."
   - Highlight: Health-focused

## Styling

### CSS Classes

**Main Container**
- `.carousel-container` - Main wrapper
- `.carousel-track` - Inner carousel track
- `.carousel-inner` - Flex container for items

**Navigation**
- `.carousel-button` - Navigation buttons
- `.carousel-button-prev` - Previous button
- `.carousel-button-next` - Next button
- `.carousel-dot` - Dot indicators
- `.carousel-dot.active` - Active dot

**Status Indicator**
- `.carousel-auto-scroll-indicator` - Shows scroll status
- `.pulse` - Pulsing animation indicator

### CSS Variables & Colors

```css
Primary Color: #3B82F6 (Blue)
Background: White / Dark surfaces
Border: rgba(0, 0, 0, 0.1) / rgba(255, 255, 255, 0.1)
Text: Gray-800 / Gray-100
```

### Animations

**Transitions**
- Carousel slide: 500ms cubic-bezier(0.4, 0, 0.2, 1)
- Button hover: 300ms ease
- Dot selection: 300ms ease

**Keyframe Animations**
- `pulse-animation`: 2s auto-scroll indicator pulse
- `carousel-fade-in`: 600ms item fade-in with stagger

## Integration

### Current Setup (App-Enhanced.jsx)

```jsx
import TestimonialsCarousel from './components/sections/TestimonialsCarousel';

// In render section:
{currentPage === 'home' && <TestimonialsCarousel />}
```

### To Use Custom Testimonials

Modify the `testimonials` array in `TestimonialsCarousel.jsx`:

```jsx
const testimonials = [
  {
    id: 1,
    name: "Your Name",
    role: "Your Role",
    image: "😊",
    rating: 5,
    text: "Your testimonial text...",
    highlight: "Key phrase"
  },
  // Add more...
];
```

## State Management

### useState Hooks

```javascript
const [currentIndex, setCurrentIndex] = useState(0);
// Tracks which testimonial is currently displayed

const [isAutoScrolling, setIsAutoScrolling] = useState(true);
// Controls whether auto-scroll is active

const [itemsPerView, setItemsPerView] = useState(3);
// Determines how many testimonials shown simultaneously
```

### useEffect Hooks

**Responsive Design**
```javascript
useEffect(() => {
  const handleResize = () => {
    // Recalculate itemsPerView based on window width
  };
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);
```

**Auto-Scroll**
```javascript
useEffect(() => {
  if (!isAutoScrolling) return;
  
  const interval = setInterval(() => {
    setCurrentIndex(prev => (prev + 1) % testimonials.length);
  }, 4000);
  
  return () => clearInterval(interval);
}, [isAutoScrolling]);
```

## Navigation Methods

### goToPrevious()
- Navigates to the previous testimonial
- Pauses auto-scroll
- Sets resume timer to 10 seconds

### goToNext()
- Navigates to the next testimonial
- Pauses auto-scroll
- Sets resume timer to 10 seconds

### goToSlide(index)
- Directly navigates to specific testimonial
- Accepts index parameter
- Pauses auto-scroll
- Sets resume timer to 10 seconds

## Accessibility

### Features
- ✅ Semantic HTML structure
- ✅ ARIA labels on buttons (`aria-label`)
- ✅ Keyboard navigation support
- ✅ Focus indicators (2px outline)
- ✅ Screen reader friendly

### Keyboard Navigation
- Tab: Move between interactive elements
- Enter/Space: Activate buttons
- Arrow Left: Previous testimonial
- Arrow Right: Next testimonial

## Performance Optimization

### Rendering
- Conditional rendering: Only renders on home page
- GPU-accelerated transforms (CSS translate)
- Efficient event listeners with cleanup

### Memory
- Cleanup of intervals and event listeners
- No memory leaks from listeners
- Proper dependency arrays in useEffect

## Dark Mode Support

The carousel has built-in dark mode support via CSS media queries:

```css
@media (prefers-color-scheme: dark) {
  /* Dark mode styles automatically applied */
}
```

## Responsive Breakpoints

```css
Desktop:  > 1024px  → 3 items per view
Tablet:   768-1024px → 2 items per view
Mobile:   < 768px   → 1 item per view
```

## Mobile Optimizations

- Navigation buttons positioned inside carousel (mobile < 768px)
- Reduced button size for thumb accessibility
- Touch-friendly spacing and hit targets
- Optimized font sizes for readability

## Stats Section

Displays key metrics below testimonials:
- **45K+** Happy Users
- **98%** Satisfaction Rate
- **2M+** Recipes Shared

## Future Enhancements

### Potential Features
1. **Swipe Gestures**: Touch swipe navigation (mobile)
2. **Video Testimonials**: Support for embedded videos
3. **Backend Integration**: Load testimonials from API
4. **User-Generated Content**: Real testimonials from database
5. **Advanced Analytics**: Track engagement metrics
6. **Filtering**: Filter by dietary preference or category
7. **Rating Filter**: Show only highly-rated testimonials
8. **Social Proof**: Display user count or verification badges

### Implementation Notes
- Keep component modular for easy extension
- Maintain backward compatibility with hardcoded testimonials
- Ensure responsive design remains intact
- Test on all target devices

## Troubleshooting

### Carousel Not Showing
1. Verify `TestimonialsCarousel` is imported in App-Enhanced.jsx
2. Check `currentPage === 'home'` condition
3. Ensure CSS file is imported in component

### Auto-Scroll Not Working
1. Check browser console for errors
2. Verify `isAutoScrolling` state is true
3. Ensure no JavaScript errors blocking interval
4. Check for conflicting CSS transitions

### Responsive Not Working
1. Verify viewport meta tag in index.html
2. Check browser window is not limited in size
3. Test with browser DevTools responsive mode
4. Verify CSS media queries are correct

### Navigation Buttons Not Responding
1. Check z-index conflicts
2. Verify button click handlers
3. Check for overlapping elements
4. Test keyboard navigation

## Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## CSS Compatibility

- CSS Grid: Not used
- CSS Flexbox: ✅ Supported
- CSS Transform: ✅ Supported
- CSS Transitions: ✅ Supported
- Backdrop Filter: Optional (graceful degradation)

## File Sizes

- **TestimonialsCarousel.jsx**: ~9KB
- **TestimonialsCarousel.css**: ~5KB
- **Total**: ~14KB (minified: ~6KB)

## Dependencies

- **React**: 19.1.0+
- **Lucide React**: For icons (Star, Quote, ChevronLeft, ChevronRight)
- **Tailwind CSS**: For utility classes (optional, CSS is standalone)

## Import Statement

```jsx
import TestimonialsCarousel from './components/sections/TestimonialsCarousel';
```

## Usage Example

```jsx
// In your component
<div className="my-testimonials">
  <TestimonialsCarousel />
</div>
```

## Customization Guide

### Change Auto-Scroll Interval

In `TestimonialsCarousel.jsx`, find the useEffect for auto-scroll:

```javascript
// Change 4000 to desired milliseconds
const interval = setInterval(() => {
  setCurrentIndex(prev => (prev + 1) % testimonials.length);
}, 4000); // ← Adjust this value
```

### Change Resume Timeout

Find the pause handler:

```javascript
setTimeout(() => {
  setIsAutoScrolling(true);
}, 10000); // ← Adjust this value (10 seconds)
```

### Custom CSS Colors

In `TestimonialsCarousel.css`, modify:

```css
/* Primary color */
background: rgba(59, 130, 246, 1); /* Change this color code */

/* Button hover color */
.carousel-button:hover {
  background: rgba(59, 130, 246, 1); /* Change this */
}
```

## Testing Checklist

- [ ] Auto-scroll works at 4-second intervals
- [ ] Manual navigation pauses auto-scroll
- [ ] Auto-scroll resumes after 10 seconds
- [ ] Responsive layout works on mobile/tablet/desktop
- [ ] Navigation buttons are accessible
- [ ] Dot indicators update correctly
- [ ] Keyboard navigation works
- [ ] Dark mode displays correctly
- [ ] No console errors
- [ ] Performance is smooth
- [ ] Mobile touch interactions work
- [ ] Accessibility features work

## Quick Reference

| Feature | Details |
|---------|---------|
| Auto-Scroll | 4 seconds |
| Pause | On manual interaction |
| Resume | 10 seconds of inactivity |
| Mobile | 1 item (< 768px) |
| Tablet | 2 items (768-1024px) |
| Desktop | 3 items (> 1024px) |
| Animation | 500ms cubic-bezier |
| Testimonials | 6 default items |
| Buttons | Prev/Next + Dots |
| Keyboard | Arrow keys + Tab |

---

**Last Updated**: Session 6 (Carousel Implementation)
**Component Status**: ✅ Production Ready
**Browser Support**: All modern browsers
