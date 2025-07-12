# HeroSection Component

A beautiful, responsive hero section for coffee shop websites with parallax effects, steam animation, and smooth scrolling.

## Features

✅ **Large Background Image** - Uses coffee-themed background with overlay gradients
✅ **Parallax Effect** - Text moves smoothly when scrolling
✅ **Steam Animation** - Animated steam particles rising from coffee cup
✅ **Scroll Arrow** - Animated arrow that invites scrolling
✅ **Responsive Design** - Works perfectly on all devices
✅ **Modern UI** - Clean, minimal design with your existing color scheme

## Usage

### Basic Usage
```tsx
import HeroSection from '../components/HeroSection';

function MyPage() {
  return (
    <div>
      <HeroSection />
      {/* Your other content */}
    </div>
  );
}
```

### With Navigation
```tsx
import HeroSection from '../components/HeroSection';

function MyPage() {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <MainContent />
      <Footer />
    </div>
  );
}
```

## Demo

Visit `/hero-demo` to see the HeroSection in action with demo content.

## Customization

The component uses your existing Material-UI theme colors:
- Primary: `#2C3E50` (Deep blue-gray)
- Secondary: `#E67E22` (Elegant orange)
- Background gradients and overlays

### Background Image
The component uses `/coffee-hero.jpg` from your public folder. You can replace this image or modify the background URL in the component.

### Steam Animation
The steam effect uses CSS keyframes with 5 animated particles that rise from the coffee cup image. The animation is subtle and loops smoothly.

### Parallax Effect
Uses Framer Motion's `useScroll` and `useTransform` for smooth parallax scrolling effects on the main headline and subheadline.

## Technical Details

- **Framework**: React + TypeScript
- **Styling**: Material-UI (MUI) with custom CSS
- **Animations**: Framer Motion + CSS Keyframes
- **Responsive**: Mobile-first design with breakpoints
- **Performance**: Optimized with proper event listeners and cleanup

## Files Created

1. `src/app/components/HeroSection.tsx` - Main component
2. `src/app/screens/HeroDemo.tsx` - Demo page
3. `src/app/components/HeroSection.md` - This documentation

## Integration

The component is modular and can be easily integrated into any page. It doesn't modify any existing logic or styles unless explicitly used.

## Browser Support

- Modern browsers with CSS Grid and Flexbox support
- Smooth scrolling and CSS animations
- Framer Motion animations 