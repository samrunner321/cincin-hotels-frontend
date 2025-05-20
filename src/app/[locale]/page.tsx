import { redirect } from 'next/navigation';
import { DEFAULT_LANGUAGE, LanguageCode } from '../../lib/i18n';

export default function LocalePage({ params }: { params: { locale: string } }) {
  const locale = params.locale as LanguageCode;
  
  // If it's the default language, redirect to the root
  if (locale === DEFAULT_LANGUAGE) {
    redirect('/');
  }
  
  // Otherwise, redirect to the homepage with the locale prefix
  // This ensures we maintain the locale in the URL
  return null;
}
