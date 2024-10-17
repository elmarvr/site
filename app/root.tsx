import { TooltipProvider } from "@radix-ui/react-tooltip";
import type { ShouldRevalidateFunctionArgs } from "@remix-run/react";
import {
  isRouteErrorResponse,
  json,
  Links,
  Meta,
  Outlet,
  redirect,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useParams,
  useRouteError,
} from "@remix-run/react";
import { i18n } from "i18n.config";

import "./index.css";
import { LoaderFunctionArgs } from "@remix-run/node";
import { I18nProvider } from "./i18n/react";
import { localePath } from "./i18n/core";
import { detectLocale } from "./i18n/server";

export const shouldRevalidate = ({
  currentParams,
  nextParams,
}: ShouldRevalidateFunctionArgs) => {
  if (currentParams.locale !== nextParams.locale) {
    return true;
  }
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const locale = await detectLocale(request);

  if (!params.locale && locale !== i18n.defaultLocale) {
    const { pathname } = new URL(request.url);

    return redirect(localePath(pathname, locale));
  }

  return json({ locale });
};

export function Layout({ children }: { children: React.ReactNode }) {
  const { locale } = useLoaderData<typeof loader>();

  return (
    <TooltipProvider>
      <I18nProvider locale={locale}>
        <html lang={locale}>
          <head>
            <meta charSet="utf-8" />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />
            <Meta />
            <Links />
          </head>
          <body>
            {children}
            <ScrollRestoration />
            <Scripts />
          </body>
        </html>
      </I18nProvider>
    </TooltipProvider>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  return (
    <html>
      <head>
        <title>Oops!</title>
        <Meta />
        <Links />
      </head>
      <body>
        <h1>
          {isRouteErrorResponse(error)
            ? `${error.status} ${error.statusText}`
            : error instanceof Error
            ? error.message
            : "Unknown Error"}
        </h1>
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
