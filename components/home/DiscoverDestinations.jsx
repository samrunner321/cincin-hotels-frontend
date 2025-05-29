'use client';

import Link from 'next/link';
import { useTranslation } from '@/providers/TranslationProvider';

export default function DiscoverDestinations() {
  const { t, locale } = useTranslation();
  
  return (
    <section className="py-20 md:py-24">
      <div className="container mx-auto px-4">
        <h4 className="text-2xl md:text-3xl font-light leading-relaxed text-gray-800 max-w-4xl mx-auto text-center">
          {t('destinations.discover')} <Link href={`/${locale}/destinations`} className="font-bold underline decoration-1 underline-offset-4 hover:decoration-2">{t('destinations.title').toLowerCase()}</Link>, {locale === 'de' ? 'wo jede handverlesene Unterkunft eine einzigartige Mischung aus Charme, Stil und Authentizität bietet.' : 'where every handpicked property offers a unique blend of charm, style, and authenticity.'}
        </h4>
      </div>
    </section>
  );
}