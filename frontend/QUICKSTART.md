# 🚀 MealCart - Quick Start Guide

## Prerequisites
- Node.js (v18 or higher)
- npm or yarn

## Installation

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies (if not already done)
npm install
```

## Development

```bash
# Start development server
npm run dev
```

The app will be available at: **http://localhost:5173**

## Features in New Design

### 🎨 Modern UI Components
- **Navbar** - Smooth animations, mobile menu, dark mode toggle
- **Hero** - Stunning hero with animated background
- **Features** - Beautiful feature cards with icons
- **Search** - Advanced search with tag filtering
- **Recipe Grid** - Modern recipe cards with hover effects
- **CTA** - Call-to-action section
- **Footer** - Clean footer with social links
- **Auth Modal** - Sign in/Sign up modal

### 🎭 Animations
- Page transitions
- Scroll animations
- Hover effects
- Loading states
- Modal animations

### 🌙 Dark Mode
- Auto-detects system preference
- Smooth transitions
- Persists in localStorage

### 📱 Responsive
- Mobile-first design
- Touch-optimized
- Hamburger menu on mobile

## Build for Production

```bash
# Create optimized production build
npm run build

# Preview production build
npm run preview
```

## Customization

### Change Colors
Edit `tailwind.config.js`:
```js
colors: {
  primary: {
    500: '#your-color',
  }
}
```

### Change Fonts
Edit `index.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=YourFont:wght@300;400;600&display=swap');
```

## Project Structure

```
src/
├── components/
│   ├── ui/              # Reusable components
│   ├── layout/          # Layout components
│   ├── sections/        # Page sections
│   └── auth/            # Authentication
├── lib/                 # Utilities
├── App-Modern.jsx       # Main app
└── index.css           # Global styles
```

## Tech Stack

- **React 19** - UI library
- **Vite 7** - Build tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Radix UI** - Component primitives
- **Axios** - HTTP client

## Available Scripts

```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## Environment Variables

Create `.env` file:
```env
VITE_API_URL=http://localhost:5001/api
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Tips

1. **Dark Mode**: Click the sun/moon icon in navbar
2. **Mobile Menu**: Click hamburger icon on mobile
3. **Search**: Use tags for better results
4. **Auth**: Click "Get Started" or "Sign In"

## Troubleshooting

### Port already in use
```bash
# Change port in vite.config.js
server: {
  port: 3000  // Change to any available port
}
```

### Build errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Support

For issues or questions, check:
- `MODERN-DESIGN.md` - Complete documentation
- `REDESIGN-SUMMARY.md` - What changed

---

**Happy Coding! 🎉**
