import { ReactNode } from 'react';
import { LanguageCode, DEFAULT_LANGUAGE } from '../../lib/i18n';

interface LayoutProps {
  children: ReactNode;
  params: {
    locale: string;
  };
}

export default function LocaleLayout({ children, params }: LayoutProps) {
  // We just pass the children through since the actual layout is in the root layout.tsx
  return children;
}
