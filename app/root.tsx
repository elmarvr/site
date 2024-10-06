import { TooltipProvider } from "@radix-ui/react-tooltip";
import type { ShouldRevalidateFunctionArgs } from "@remix-run/react";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useParams,
  useRouteError,
} from "@remix-run/react";
import { i18n } from "i18n.config";
import { IntlProvider } from "react-intl";

import en from "~/lang/en.json";
import nl from "~/lang/nl.json";

import "./index.css";

const messages = {
  en,
  nl,
};

declare global {
  namespace FormatjsIntl {
    interface Message {
      ids: keyof typeof nl;
    }
  }
}

export const shouldRevalidate = ({
  currentParams,
  nextParams,
}: ShouldRevalidateFunctionArgs) => {
  if (currentParams.locale !== nextParams.locale) {
    return true;
  }
};

export function Layout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const locale = params?.locale ?? i18n.defaultLocale;

  return (
    <TooltipProvider>
      <IntlProvider
        locale={locale}
        defaultLocale={locale}
        messages={messages[locale as keyof typeof messages]}
      >
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
      </IntlProvider>
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
