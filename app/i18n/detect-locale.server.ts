import { i18n } from "i18n.config";

import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";

export function detectLocale(request: Request) {
  const headers = Object.fromEntries(request.headers.entries());

  const languages = new Negotiator({ headers }).languages(i18n.locales);

  return match(languages, i18n.locales, i18n.defaultLocale);
}
