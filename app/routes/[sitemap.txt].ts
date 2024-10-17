import { LoaderFunctionArgs } from "@remix-run/node";
import { generateSitemap } from "~/lib/seo.server";

export const loader = ({ request }: LoaderFunctionArgs) => {
  const content = generateSitemap(request);

  return new Response(content, {
    status: 200,
    headers: {
      "Content-Type": "application/xml",
      "xml-version": "1.0",
      encoding: "UTF-8",
    },
  });
};
