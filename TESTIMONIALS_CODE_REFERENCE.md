# Testimonials Component - Code Example & Preview

---

## 🔍 Component Usage

### Import in App
```javascript
import Testimonials from './components/sections/Testimonials';
```

### Render (Conditional)
```javascript
{!user && currentPage === 'home' && <Testimonials />}
```

### Render (Always)
```javascript
<Testimonials />
```

---

## 📝 Component Code Structure

### Main Component
```javascript
const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "Sarah Chen",
      role: "Busy Professional",
      image: "👩‍💼",
      rating: 5,
      text: "MealCart has completely changed how I approach meal planning...",
      highlight: "Time-saving"
    },
    // ... 5 more testimonials
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-b...">
      {/* Header Section */}
      {/* Grid of Cards */}
      {/* Statistics Section */}
    </section>
  );
};
```

### TestimonialCard Component
```javascript
const TestimonialCard = ({ testimonial }) => {
  return (
    <div className="group glass p-8 rounded-xl hover:shadow-xl...">
      {/* Quote Icon */}
      {/* Star Rating */}
      {/* Testimonial Text */}
      {/* Highlight Badge */}
      {/* Author Info */}
    </div>
  );
};
```

### StatsCard Component
```javascript
const StatsCard = ({ number, label, icon }) => (
  <div className="text-center">
    <div className="text-4xl mb-3">{icon}</div>
    <p className="text-3xl md:text-4xl font-bold...">{number}</p>
    <p className="text-muted-foreground">{label}</p>
  </div>
);
```

---

## 🎨 JSX Structure

### Complete Section Structure
```jsx
<section className="py-20 px-4 bg-gradient-to-b from-background via-card/30 to-background">
  <div className="max-w-7xl mx-auto">
    
    {/* Header */}
    <div className="text-center mb-16">
      <span className="bg-primary/10 text-primary px-4 py-2 rounded-full">
        ⭐ Loved by Users
      </span>
      <h2 className="text-4xl md:text-5xl font-bold mb-4">
        What Our Users Are Saying
      </h2>
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
        Join thousands of happy cooks...
      </p>
    </div>

    {/* Grid of Testimonials */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {testimonials.map((testimonial) => (
        <TestimonialCard key={testimonial.id} testimonial={testimonial} />
      ))}
    </div>

    {/* Stats */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 pt-20 border-t">
      <StatsCard number="45K+" label="Active Users" icon="👥" />
      <StatsCard number="98%" label="Satisfaction Rate" icon="😊" />
      <StatsCard number="2M+" label="Recipes Discovered" icon="🍽️" />
    </div>

  </div>
</section>
```

---

## 🎯 Individual Card JSX

```jsx
<div className="group glass p-8 rounded-xl hover:shadow-xl transition-all 
                duration-300 hover:translate-y-[-4px] border border-border/50 
                hover:border-primary/50 relative overflow-hidden">
  
  {/* Background Gradient */}
  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent 
                  opacity-0 group-hover:opacity-100 transition-opacity" />
  
  <div className="relative z-10">
    
    {/* Quote Icon */}
    <div className="mb-4">
      <Quote className="w-5 h-5 text-primary/50" />
    </div>

    {/* Rating */}
    <div className="flex gap-1 mb-4">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      ))}
    </div>

    {/* Testimonial */}
    <p className="text-foreground mb-6 leading-relaxed italic">
      "MealCart has completely changed how I approach meal planning..."
    </p>

    {/* Highlight Badge */}
    <div className="mb-6">
      <span className="inline-block bg-primary/10 text-primary px-3 py-1 
                       rounded-full text-xs font-semibold">
        Time-saving
      </span>
    </div>

    {/* Author */}
    <div className="flex items-center gap-3">
      <div className="text-3xl">👩‍💼</div>
      <div>
        <p className="font-semibold text-foreground">Sarah Chen</p>
        <p className="text-sm text-muted-foreground">Busy Professional</p>
      </div>
    </div>

  </div>
</div>
```

---

## 🎨 CSS Classes Used

### Tailwind Classes
```
Layout:
- py-20 px-4: Padding
- max-w-7xl mx-auto: Container
- grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3: Responsive grid
- gap-8: Spacing between cards

Cards:
- glass: Glass effect (custom)
- p-8: Padding
- rounded-xl: Border radius
- group: Hover group
- relative overflow-hidden: For gradient overlay

Hover Effects:
- hover:shadow-xl: Shadow on hover
- hover:translate-y-[-4px]: Lift effect
- hover:border-primary/50: Border color
- transition-all duration-300: Animation

Text:
- text-4xl md:text-5xl: Responsive size
- font-bold: Bold text
- text-muted-foreground: Muted color
- italic: Italic text

Colors:
- bg-gradient-to-b: Background gradient
- from-background via-card/30 to-background: Gradient colors
- text-primary: Primary text color
- fill-yellow-400: Star fill color
```

### Custom CSS Classes
```
glass: 
  - background: rgba(255, 255, 255, 0.05)
  - backdrop-filter: blur(10px)
  - border: 1px solid rgba(255, 255, 255, 0.1)

gradient-text:
  - background: linear-gradient
  - -webkit-background-clip: text
  - -webkit-text-fill-color: transparent
```

---

## 📊 Data Flow

```
Testimonials Component
├── testimonials[] (hardcoded array)
│   └── Each testimonial object:
│       ├── id: number
│       ├── name: string
│       ├── role: string
│       ├── image: emoji string
│       ├── rating: 1-5 number
│       ├── text: string
│       └── highlight: string
│
├── .map() over testimonials array
│   └── Pass each to TestimonialCard component
│
└── Render stats separately
    └── map() over stats array
        └── Pass each to StatsCard component
```

---

## 🎬 Animation Classes

### Entrance Animation (CSS Keyframe)
```css
@keyframes float-up {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Applied with staggered delays */
.testimonial-card:nth-child(1) { animation-delay: 0.1s; }
.testimonial-card:nth-child(2) { animation-delay: 0.2s; }
.testimonial-card:nth-child(3) { animation-delay: 0.3s; }
/* etc... */
```

### Hover Animation (Tailwind)
```
group-hover:
  - translate-y becomes -4px (upward)
  - shadow increases
  - border color changes
  - opacity of gradient increases

Transition:
  - duration-300: 300ms
  - cubic-bezier: smooth easing
```

---

## 📱 Responsive Behavior

### Mobile (< 768px)
```jsx
grid-cols-1        // 1 column
gap-8              // 2rem gap
p-8                // Full padding maintained
text-4xl           // Smaller heading
```

### Tablet (768px - 1024px)
```jsx
md:grid-cols-2     // 2 columns at 768px
md:text-5xl        // Larger heading
```

### Desktop (> 1024px)
```jsx
lg:grid-cols-3     // 3 columns at 1024px
lg:text-5xl        // Full size heading
max-w-7xl          // Max container width
```

---

## 🔧 Props & Configuration

### Testimonials Component Props
```javascript
// No props - uses hardcoded data
// To customize: Edit testimonials array in component
```

### TestimonialCard Props
```javascript
TestimonialCard.propTypes = {
  testimonial: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    rating: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired,
    highlight: PropTypes.string.isRequired
  }).isRequired
}
```

### StatsCard Props
```javascript
StatsCard.propTypes = {
  number: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired
}
```

---

## 📝 Full Component Example

```javascript
import React from 'react';
import { Star, Quote } from 'lucide-react';
import './Testimonials.css';

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "Sarah Chen",
      role: "Busy Professional",
      image: "👩‍💼",
      rating: 5,
      text: "MealCart has completely changed how I approach meal planning. What used to take hours now takes minutes. The AI suggestions are spot-on!",
      highlight: "Time-saving"
    },
    // ... 5 more testimonials
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-background via-card/30 to-background">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold">
              ⭐ Loved by Users
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            What Our Users Are Saying
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of happy cooks who've transformed their kitchen experience with MealCart
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 pt-20 border-t border-border/50">
          <StatsCard number="45K+" label="Active Users" icon="👥" />
          <StatsCard number="98%" label="Satisfaction Rate" icon="😊" />
          <StatsCard number="2M+" label="Recipes Discovered" icon="🍽️" />
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
```

---

**Last Updated:** November 13, 2025  
**Status:** ✅ Complete
