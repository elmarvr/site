import { Link, Outlet, useLocation, useMatch } from "@remix-run/react";
import { FormattedMessage, useIntl } from "react-intl";
import { LocaleSelect } from "~/components/locale-select";
import { Button } from "~/components/ui/button";
import { Icon } from "~/components/ui/icon";
import { Tooltip } from "~/components/ui/tooltip";
import { localePath } from "~/i18n/core";

export const meta = () => {
  return [
    {
      title: "Elmar",
    },
  ];
};

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

export default function LocaleLayout() {
  const intl = useIntl();

  const matchIndex = !!useMatch(localePath("/", intl.locale));

  return (
    <div className="px-2 mx-auto max-w-2xl">
      <header className="sticky top-0 z-20 bg-background">
        <nav className="flex justify-between items-center w-full py-3 rounded">
          {!matchIndex ? (
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
        {intl.locale}
        <Outlet />
      </main>
    </div>
  );
}
