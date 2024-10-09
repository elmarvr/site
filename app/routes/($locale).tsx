import type { LoaderFunctionArgs } from "@remix-run/node";
import { Outlet, redirect, useLocation } from "@remix-run/react";
import { FormattedMessage, useIntl } from "react-intl";
import { i18n } from "i18n.config";

import { LocaleSelect } from "~/components/locale-select";
import { detectLocale } from "~/i18n/detect-locale.server";
import { $i18n } from "~/i18n/routing";
import { Link } from "~/components/ui/link";
import { Icon } from "~/components/ui/icon";
import { Button } from "~/components/ui/button";
import { Tooltip } from "~/components/ui/tooltip";

export const links = () => {
  return [
    { rel: "preconnect", href: "https://fonts.googleapis.com" },
    {
      rel: "preconnect",
      href: "https://fonts.gstatic.com",
      crossOrigin: "true",
    },
    {
      href: "https://fonts.googleapis.com/css2?family=Inconsolata:wght@200..900&display=swap",
      rel: "stylesheet",
    },
  ];
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const detected = detectLocale(request);

  if (params.locale && !i18n.locales.includes(params.locale)) {
    throw new Error("Invalid locale");
  }

  if (!params.locale && detected !== i18n.defaultLocale) {
    return redirect($i18n(request.url, detected));
  }

  return null;
};

export default function LocaleLayout() {
  const intl = useIntl();
  const location = useLocation();

  return (
    <div className="px-2 mx-auto max-w-xl">
      <header className="sticky top-0 z-20 bg-background">
        <nav className="flex justify-between items-center w-full py-3 rounded">
          {location.pathname !== $i18n("/", intl.locale) ? (
            <Link
              className="flex items-center gap-2"
              to="/"
              unstable_viewTransition
              style={{ viewTransitionName: "logo" }}
            >
              Elmar
            </Link>
          ) : (
            <span></span>
          )}

          <div className="flex items-center gap-1">
            <Tooltip>
              <Tooltip.Trigger asChild>
                <Button asChild>
                  <Link to="/projects" unstable_viewTransition>
                    <Icon.Brackets />
                  </Link>
                </Button>
              </Tooltip.Trigger>
              <Tooltip.Content>
                <FormattedMessage id="nav.projects" />
              </Tooltip.Content>
            </Tooltip>

            <Tooltip>
              <Tooltip.Trigger asChild>
                <Button asChild>
                  <Link to="/snippets" unstable_viewTransition>
                    <Icon.Scissors />
                  </Link>
                </Button>
              </Tooltip.Trigger>
              <Tooltip.Content>
                <FormattedMessage id="nav.snippets" />
              </Tooltip.Content>
            </Tooltip>

            <Tooltip>
              <LocaleSelect>
                <Tooltip.Trigger asChild>
                  <Button>
                    <Icon.Globe />
                  </Button>
                </Tooltip.Trigger>
              </LocaleSelect>
              <Tooltip.Content>
                <FormattedMessage id="nav.language" />
              </Tooltip.Content>
            </Tooltip>
          </div>
        </nav>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
}
