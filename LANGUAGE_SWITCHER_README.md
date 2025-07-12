# Language Switcher Implementation

This project includes a complete internationalization (i18n) setup using `react-i18next` with a sophisticated language switcher component built with Material-UI.

## 🚀 Features

- **Multi-language Support**: English and Korean translations
- **MUI Language Switcher**: Beautiful dropdown with flag icons
- **Automatic Language Detection**: Detects browser language
- **Persistent Language Selection**: Saves choice in localStorage
- **Real-time Language Switching**: Instant translation updates
- **Responsive Design**: Works on desktop and mobile

## 📁 File Structure

```
src/
├── i18n.ts                          # i18n configuration
├── locales/
│   ├── en.json                      # English translations
│   └── ko.json                      # Korean translations
├── components/
│   ├── LanguageSwitcher.tsx         # Main language switcher component
│   └── LanguageExample.tsx          # Usage example component
└── app/
    └── components/
        └── headers/
            └── HomeNavbar.tsx       # Navbar with integrated language switcher
```

## 🛠️ Setup

### 1. Install Dependencies

```bash
yarn add react-i18next i18next i18next-browser-languagedetector
```

### 2. i18n Configuration (`src/i18n.ts`)

```typescript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enTranslations from './locales/en.json';
import koTranslations from './locales/ko.json';

const resources = {
  en: { translation: enTranslations },
  ko: { translation: koTranslations },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
  });

export default i18n;
```

### 3. Import in Main App (`src/index.tsx`)

```typescript
import './i18n'; // Add this import
```

## 🎨 Language Switcher Component

### Basic Usage

```tsx
import LanguageSwitcher from './components/LanguageSwitcher';

function App() {
  return (
    <div>
      <LanguageSwitcher />
    </div>
  );
}
```

### Component Features

- **Flag Icons**: 🇺🇸 for English, 🇰🇷 for Korean
- **Tooltip**: Shows "Language" on hover
- **Dropdown Menu**: Clean MUI menu with language options
- **Selected State**: Highlights current language
- **Accessibility**: Proper ARIA labels and keyboard navigation

## 📝 Translation Structure

### Translation Keys

```json
{
  "common": {
    "language": "Language",
    "english": "English", 
    "korean": "Korean"
  },
  "navigation": {
    "home": "Home",
    "drinks": "Drinks",
    "desserts": "Desserts"
  },
  "home": {
    "welcome": "Welcome to Cafert",
    "subtitle": "Discover the perfect blend..."
  }
}
```

### Using Translations

```tsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('home.welcome')}</h1>
      <p>{t('home.subtitle')}</p>
    </div>
  );
}
```

## 🔧 Integration Examples

### 1. Navbar Integration

The language switcher is already integrated into the main navbar:

```tsx
// In HomeNavbar.tsx
import LanguageSwitcher from '../../../components/LanguageSwitcher';

// Desktop navbar
<LanguageSwitcher />

// Mobile drawer
<LanguageSwitcher />
```

### 2. Custom Styling

```tsx
// Custom styled language switcher
<LanguageSwitcher 
  style={{ 
    color: 'white',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: '8px'
  }} 
/>
```

### 3. Programmatic Language Change

```tsx
import { useTranslation } from 'react-i18next';

function LanguageController() {
  const { i18n } = useTranslation();
  
  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };
  
  return (
    <div>
      <button onClick={() => changeLanguage('en')}>English</button>
      <button onClick={() => changeLanguage('ko')}>한국어</button>
    </div>
  );
}
```

## 🌐 Adding New Languages

### 1. Create Translation File

```json
// src/locales/ja.json
{
  "common": {
    "language": "言語",
    "english": "英語",
    "korean": "韓国語",
    "japanese": "日本語"
  }
}
```

### 2. Update i18n Configuration

```typescript
// src/i18n.ts
import jaTranslations from './locales/ja.json';

const resources = {
  en: { translation: enTranslations },
  ko: { translation: koTranslations },
  ja: { translation: jaTranslations }, // Add new language
};
```

### 3. Update Language Switcher

```typescript
// src/components/LanguageSwitcher.tsx
const languages = [
  { code: 'en', name: t('common.english'), flag: '🇺🇸' },
  { code: 'ko', name: t('common.korean'), flag: '🇰🇷' },
  { code: 'ja', name: t('common.japanese'), flag: '🇯🇵' }, // Add new language
];
```

## 🎯 Best Practices

1. **Consistent Key Structure**: Use nested objects for organization
2. **Fallback Values**: Always provide fallback text for missing translations
3. **Pluralization**: Use i18next pluralization for different number forms
4. **Context**: Use translation context for different meanings of the same word
5. **Testing**: Test with different languages and RTL support if needed

## 🐛 Troubleshooting

### Common Issues

1. **Language not switching**: Check if i18n is properly imported in index.tsx
2. **Missing translations**: Ensure all keys exist in both language files
3. **MUI import errors**: Make sure you're using the correct MUI version (v4 or v5)
4. **Build errors**: Clear node_modules and reinstall dependencies

### Debug Mode

Enable debug mode in development:

```typescript
// src/i18n.ts
debug: process.env.NODE_ENV === 'development'
```

This will show missing translation keys in the console.

## 📱 Mobile Support

The language switcher is fully responsive and works on mobile devices:

- **Touch-friendly**: Large touch targets
- **Mobile drawer**: Integrated into mobile navigation
- **Responsive design**: Adapts to different screen sizes

## 🎨 Customization

### Styling

```tsx
// Custom styles for the language switcher
const customStyles = {
  languageButton: {
    color: '#8B4513',
    '&:hover': { color: '#A0522D' }
  },
  languageMenu: {
    minWidth: 200,
    backgroundColor: '#fff',
    boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
  }
};
```

### Icons

Replace flag emojis with custom icons:

```tsx
import { Language as LanguageIcon } from '@material-ui/icons';

// Use custom icons instead of emojis
{/* <span>🇺🇸</span> */}
<LanguageIcon style={{ fontSize: 20 }} />
```

## 🚀 Performance

- **Lazy Loading**: Translations are loaded on demand
- **Caching**: Language preference is cached in localStorage
- **Optimized**: Minimal bundle size impact
- **Tree Shaking**: Only used translations are included

## 📄 License

This implementation is part of the Cafert coffee shop project and follows React and Material-UI best practices. 