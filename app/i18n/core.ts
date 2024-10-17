import { i18n } from "i18n.config";
import { createIntl as __createIntl, IntlCache, IntlConfig } from "react-intl";
import en from "~/lang/en.json";
import nl from "~/lang/nl.json";

export type Locale = (typeof i18n)["locales"][number];

export const messages = {
  en,
  nl,
} satisfies Record<Locale, Record<string, string>>;

declare global {
  namespace FormatjsIntl {
    interface Message {
      ids: keyof (typeof messages)[Locale];
    }
    interface IntlConfig {
      locale: Locale;
    }
  }
}

export interface InstanceConfig
  extends Omit<IntlConfig, "defaultLocale" | "messages"> {}

export function createIntl(config: InstanceConfig, cache?: IntlCache) {
  return __createIntl(
    {
      defaultLocale: i18n.defaultLocale,
      messages: messages[config.locale],
      ...config,
    },
    cache
  );
}

export function localePath(pathname: string, locale: Locale) {
  for (const l of i18n.locales) {
    pathname = pathname.replace(`/${l}`, "");
  }

  const segment = locale === i18n.defaultLocale ? "" : `/${locale}`;

  return `${segment}${pathname}`;
}
