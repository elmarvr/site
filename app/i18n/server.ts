import { match } from "@formatjs/intl-localematcher";
import { createCookie } from "@remix-run/node";
import { i18n } from "i18n.config";
import Negotiator from "negotiator";
import { createIntl, Locale } from "./core";

export async function createServerIntl(request: Request) {
  const locale = await detectLocale(request);

  return createIntl({ locale });
}

export async function detectLocale(request: Request) {
  const detectors = [fromPath, fromCookie, fromHeader];

  for (const detector of detectors) {
    const locale = await detector(request);
    if (locale) {
      return locale;
    }
  }

  return i18n.defaultLocale;
}

async function fromPath(request: Request) {
  const url = new URL(request.url);
  const parts = url.pathname.split("/");

  if (parts[0] === "") {
    parts.shift();
  }

  const locale = parts[0];

  return matchLocale(locale);
}

async function fromCookie(request: Request) {
  const locale = await localeCookie.parse(request.headers.get("Cookie"));

  return matchLocale(locale);
}

async function fromHeader(request: Request) {
  const headers = Object.fromEntries(request.headers.entries());
  const negotiator = new Negotiator({ headers });

  const language = negotiator.language([...i18n.locales]);

  if (!language) {
    return null;
  }

  return matchLocale(language);
}

export function matchLocale(locale: string | null) {
  if (!locale) {
    return null;
  }

  //@ts-expect-error we want to return null if the locale is not supported
  return match([locale], i18n.locales, null) as Locale;
}

export const localeCookie = createCookie("locale", {
  path: "/",
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  httpOnly: true,
});
