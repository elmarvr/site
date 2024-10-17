import { LoaderFunctionArgs } from "@remix-run/node";

export const loader = ({ request }: LoaderFunctionArgs) => {
  const sitemapUrl = new URL(request.url);

  sitemapUrl.pathname = "/sitemap.xml";

  const robotText = `
      User-agent: Googlebot
      Disallow: /nogooglebot/
  
      User-agent: *
      Allow: /
  
      Sitemap: ${sitemapUrl}
      `;

  return new Response(robotText, {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
    },
  });
};
