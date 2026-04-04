import en from './en.json';
import es from './es.json';
import pt from './pt.json';

export const locales = ['en', 'es', 'pt'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

const translations = { en, es, pt } as const;

export function useTranslations(locale: Locale) {
  const dict = translations[locale] as typeof en;
  return function t(key: string): string {
    const val = key.split('.').reduce((obj: unknown, k) => {
      if (obj && typeof obj === 'object') return (obj as Record<string, unknown>)[k];
      return undefined;
    }, dict as unknown);
    return typeof val === 'string' ? val : key;
  };
}

/** Strip locale prefix from a pathname. Returns the base path starting with /. */
export function stripLocalePath(pathname: string): string {
  const match = pathname.match(/^\/(es|pt)(\/|$)/);
  if (!match) return pathname;
  const rest = pathname.slice(match[1].length + 1);
  return rest ? rest : '/';
}

/** Build the equivalent URL for a given locale. */
export function getLocalePath(basePath: string, locale: Locale): string {
  const base = basePath === '/' ? '' : basePath;
  if (locale === defaultLocale) return basePath;
  return `/${locale}${base}`;
}

/** Get locale from a pathname (returns 'en' for unprefixed paths). */
export function getLocaleFromPath(pathname: string): Locale {
  const match = pathname.match(/^\/(es|pt)(\/|$)/);
  return match ? (match[1] as Locale) : defaultLocale;
}
