'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const translations = {
  de: {
    title: 'Wir verwenden Cookies',
    description: 'Wir nutzen Cookies, um Ihre Erfahrung auf unserer Website zu verbessern. Einige Cookies sind notwendig, während andere uns helfen, die Website zu optimieren.',
    learnMore: 'Mehr erfahren',
    necessaryOnly: 'Nur notwendige',
    acceptAll: 'Alle akzeptieren'
  },
  en: {
    title: 'We use cookies',
    description: 'We use cookies to improve your experience on our website. Some cookies are necessary, while others help us optimize the website.',
    learnMore: 'Learn more',
    necessaryOnly: 'Necessary only',
    acceptAll: 'Accept all'
  }
};

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const pathname = usePathname();
  
  // Extract locale from pathname
  const locale = pathname.split('/')[1] || 'de';
  const t = translations[locale] || translations.de;

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const acceptAll = () => {
    localStorage.setItem('cookieConsent', 'all');
    setShowBanner(false);
  };

  const acceptNecessary = () => {
    localStorage.setItem('cookieConsent', 'necessary');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-xl z-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">{t.title}</h3>
            <p className="text-sm text-gray-600">
              {t.description}
            </p>
            <Link href={`/${locale}/cookies`} className="text-sm text-gray-800 underline mt-2 inline-block">
              {t.learnMore}
            </Link>
          </div>
          <div className="flex gap-3">
            <button
              onClick={acceptNecessary}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              {t.necessaryOnly}
            </button>
            <button
              onClick={acceptAll}
              className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
            >
              {t.acceptAll}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}