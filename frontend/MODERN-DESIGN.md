# MealCart - Modern Frontend Design 🎨

## 🚀 Complete Redesign Overview

This is a complete, professional-grade frontend redesign of MealCart using modern web technologies and best practices.

## ✨ Key Features

### 🎨 Design System
- **Color Scheme**: Modern purple gradient theme with full dark mode support
- **Typography**: Inter variable font for optimal readability
- **Components**: Production-grade UI components built with Radix UI primitives
- **Animations**: Smooth, performant animations using Framer Motion
- **Responsive**: Mobile-first design that works on all devices

### 🛠️ Technology Stack

#### Core Libraries
- **React 19** - Latest React with modern hooks
- **Vite 7** - Lightning-fast build tool
- **Tailwind CSS 3** - Utility-first CSS framework
- **Framer Motion** - Production-ready animation library

#### UI Components (Shadcn/ui inspired)
- **Radix UI** - Accessible, unstyled component primitives
  - Dialog (modals)
  - Dropdown Menu
  - Toast notifications
  - Tabs
  - Avatar
  - Separator

#### Utilities
- **clsx** - Dynamic className composition
- **tailwind-merge** - Intelligent Tailwind class merging
- **class-variance-authority** - Type-safe component variants

## 📁 New Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── ui/              # Reusable UI components
│   │   │   ├── button.jsx
│   │   │   ├── card.jsx
│   │   │   ├── input.jsx
│   │   │   ├── badge.jsx
│   │   │   └── dialog.jsx
│   │   ├── layout/          # Layout components
│   │   │   ├── Navbar.jsx
│   │   │   └── Footer.jsx
│   │   ├── sections/        # Page sections
│   │   │   ├── Hero.jsx
│   │   │   ├── Features.jsx
│   │   │   ├── SearchSection.jsx
│   │   │   └── RecipeGrid.jsx
│   │   └── auth/            # Authentication
│   │       └── AuthModal.jsx
│   ├── lib/                 # Utilities
│   │   └── utils.js
│   ├── App-Modern.jsx       # New main app
│   └── index.css           # Global styles with design tokens
```

## 🎨 Design Tokens

### Colors
```css
/* Light Mode */
--primary: 271 91% 65%        /* Purple */
--background: 0 0% 100%        /* White */
--foreground: 240 10% 3.9%     /* Almost Black */

/* Dark Mode */
--primary: 271 91% 65%         /* Purple (same) */
--background: 240 10% 3.9%     /* Dark Gray */
--foreground: 0 0% 98%         /* Almost White */
```

### Components

#### Button Variants
- `default` - Primary purple button with shadow
- `gradient` - Purple gradient (recommended for CTAs)
- `outline` - Border-only button
- `ghost` - Transparent button
- `secondary` - Muted background
- `destructive` - Red for dangerous actions

#### Card Components
- `Card` - Container with shadow and border
- `CardHeader` - Top section with padding
- `CardTitle` - Heading text
- `CardDescription` - Muted description
- `CardContent` - Main content area
- `CardFooter` - Bottom section

### Animations

#### Framer Motion Animations
- Smooth page transitions
- Scroll-triggered animations
- Hover states
- Loading states
- Modal enter/exit animations

#### Custom Keyframes
- `fade-in` - Opacity transition
- `slide-up` - Slide from bottom
- `slide-down` - Slide from top
- `shimmer` - Loading skeleton effect
- `float` - Gentle floating animation
- `gradient` - Animated gradient background

## 🚀 Getting Started

### Installation
```bash
cd frontend
npm install
```

### Development
```bash
npm run dev
```
Visit http://localhost:5173

### Build for Production
```bash
npm run build
npm run preview  # Preview production build
```

## 📱 Responsive Design

### Breakpoints
- `sm`: 640px - Small devices
- `md`: 768px - Medium devices
- `lg`: 1024px - Large devices
- `xl`: 1280px - Extra large devices
- `2xl`: 1400px - Container max width

### Mobile Features
- Touch-optimized tap targets (min 44x44px)
- Prevents zoom on input focus (16px font size)
- Smooth scrolling
- Mobile menu with animations
- Optimized images

## 🎭 Component Usage Examples

### Button
```jsx
import { Button } from '@/components/ui/button';

<Button variant="gradient" size="lg">
  Get Started
</Button>
```

### Card
```jsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Recipe Title</CardTitle>
  </CardHeader>
  <CardContent>
    Recipe content here...
  </CardContent>
</Card>
```

### Animated Component
```jsx
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  Content
</motion.div>
```

## 🎨 Customization

### Colors
Edit `tailwind.config.js` to customize the color palette:
```js
colors: {
  primary: {
    500: '#a855f7',  // Your brand color
    600: '#9333ea',
  }
}
```

### Fonts
Edit `index.css` to change fonts:
```css
@import url('https://fonts.googleapis.com/css2?family=YourFont:wght@300;400;600&display=swap');
```

### Animations
Customize animations in `tailwind.config.js`:
```js
keyframes: {
  yourAnimation: {
    '0%': { transform: 'scale(1)' },
    '100%': { transform: 'scale(1.1)' }
  }
}
```

## 🔧 Configuration

### Path Aliases
Configured in `vite.config.js` and `jsconfig.json`:
```js
import { Button } from '@/components/ui/button';  // ✅
import { Button } from '../../../components/ui/button';  // ❌
```

### Environment Variables
Create `.env` file:
```env
VITE_API_URL=http://localhost:5001/api
```

## 🌙 Dark Mode

Dark mode is automatically detected from system preferences and persists in localStorage.

Toggle dark mode programmatically:
```jsx
const [darkMode, setDarkMode] = useState(false);

// Toggle
setDarkMode(!darkMode);

// Apply to document
document.documentElement.classList.toggle('dark', darkMode);
```

## 📊 Performance

### Optimizations
- Code splitting with React lazy loading
- Image optimization
- Tree shaking
- Minification in production
- CSS purging (unused Tailwind classes removed)

### Bundle Size
- Modern React 19 (smaller bundle)
- Radix UI (headless, minimal styles)
- Framer Motion (tree-shakeable)

## 🧪 Best Practices

### Component Structure
```jsx
// ✅ Good
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const MyComponent = ({ className, ...props }) => {
  return (
    <div className={cn("base-classes", className)} {...props}>
      Content
    </div>
  );
};
```

### Naming Conventions
- Components: PascalCase (e.g., `RecipeCard.jsx`)
- Utilities: camelCase (e.g., `utils.js`)
- CSS classes: kebab-case (e.g., `.recipe-card`)

### File Organization
- One component per file
- Co-locate related files
- Use index.js for re-exports

## 🎯 Key Improvements Over Old Design

1. **Modern UI Library**: Replaced custom components with Radix UI primitives
2. **Better Animations**: Framer Motion instead of GSAP
3. **Type Safety**: CVA for component variants
4. **Design System**: Consistent tokens and spacing
5. **Accessibility**: ARIA labels, keyboard navigation
6. **Performance**: Lighter bundle, faster animations
7. **Maintainability**: Clean component structure
8. **Responsive**: Mobile-first approach
9. **Dark Mode**: Built-in, smooth transitions
10. **Professional**: Production-grade patterns

## 📝 Notes

- All old components are preserved in their original locations
- New design is in `App-Modern.jsx`
- Entry point updated in `main.jsx` to use new app
- Tailwind configuration supports both old and new components

## 🤝 Contributing

When adding new components:
1. Follow Shadcn/ui patterns
2. Use Radix UI primitives when possible
3. Apply Tailwind classes with `cn()` utility
4. Add Framer Motion for animations
5. Ensure dark mode support
6. Test responsive design

## 📚 Resources

- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Framer Motion Docs](https://www.framer.com/motion/)
- [Radix UI Docs](https://www.radix-ui.com/)
- [Shadcn/ui](https://ui.shadcn.com/)

---

**Built with ❤️ using modern web technologies**
