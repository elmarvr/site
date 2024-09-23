import { i18n } from "i18n.config";

export function $i18n(pathname: string, locale: string) {
  for (const l of i18n.locales) {
    pathname = pathname.replace(`/${l}`, "");
  }

  const localeSegment = locale === i18n.defaultLocale ? "" : `/${locale}`;

  return `${localeSegment}${pathname}`;
}
