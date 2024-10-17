import { i18n } from "i18n.config";
import { Locale, localePath } from "~/i18n/core";
import { detectLocale } from "~/i18n/server";
import { getCollection } from "./collection";

export async function generateSeoMeta(request: Request) {
  const locale = await detectLocale(request);
  const alternateLinks = generateAlternateLinks(request.url, locale);

  return {
    links: [
      ...alternateLinks.map((link) => ({
        tagName: "link",
        rel: "alternate",
        ...link,
      })),
      {
        tagName: "link",
        rel: "alternate",
        hrefLang: "x-default",
        href: withPathname(request.url, "/"),
      },
    ],
  };
}

export function generateSitemap(request: Request) {
  const links: { path: string; lastModified?: Date }[] = [
    { path: "/" },
    { path: "/snippets" },
    { path: "/projects" },
  ];

  const snippets = getCollection("snippets");

  for (const snippet of snippets) {
    links.push({
      path: `/snippets/${snippet.slug}`,
      lastModified: snippet.date,
    });
  }

  return (
    `<?xml version="1.0" encoding="UTF-8"?>` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">` +
    links.map((link) => {
      const href = withPathname(request.url, link.path);

      const alternateLinks = generateAlternateLinks(href);

      return (
        `<url>` +
        `<loc>${href}</loc>` +
        (link.lastModified
          ? `<lastmod>${link.lastModified.toISOString()}</lastmod>`
          : "") +
        alternateLinks.map(
          (alternateLink) =>
            `<xhtml:link rel="alternate" hreflang="${alternateLink.hrefLang}" href="${alternateLink.href}" />`
        ) +
        `</url>`
      );
    }) +
    `</urlset>`
  );
}

function generateAlternateLinks(
  url: URL | string,
  locale = i18n.defaultLocale as Locale
) {
  return i18n.locales
    .filter((l) => l !== locale)
    .map((lang) => {
      url = new URL(url);

      return {
        hrefLang: lang,
        href: withPathname(url, localePath(url.pathname, lang)),
      };
    });
}

function withPathname(url: URL | string, pathname: string) {
  url = new URL(url);

  url.pathname = pathname;

  return url;
}
