'use client';

import { useTranslation } from '@/providers/TranslationProvider';

export default function LanguageSwitcher({ isDark = true }) {
  const { locale, switchLocale } = useTranslation();
  
  const activeColor = isDark ? 'text-gray-900' : 'text-white';
  const inactiveColor = isDark ? 'text-gray-600 hover:text-gray-900' : 'text-white/70 hover:text-white';
  const dividerColor = isDark ? 'text-gray-400' : 'text-white/50';
  
  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => switchLocale('de')}
        className={`px-2 py-1 text-sm transition-all ${
          locale === 'de' 
            ? `font-bold ${activeColor}` 
            : inactiveColor
        }`}
        aria-label="Switch to German"
      >
        DE
      </button>
      <span className={dividerColor}>|</span>
      <button
        onClick={() => switchLocale('en')}
        className={`px-2 py-1 text-sm transition-all ${
          locale === 'en' 
            ? `font-bold ${activeColor}` 
            : inactiveColor
        }`}
        aria-label="Switch to English"
      >
        EN
      </button>
    </div>
  );
}