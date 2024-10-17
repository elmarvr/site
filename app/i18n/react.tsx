import {
  Link,
  useLocation,
  useNavigate,
  type LinkProps,
} from "@remix-run/react";
import * as React from "react";
import {
  createIntlCache,
  IntlProvider,
  RawIntlProvider,
  useIntl,
} from "react-intl";
import { Locale, localePath, messages } from "./core";
import { i18n } from "i18n.config";

export const I18nProvider = ({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: Locale;
}) => {
  return (
    <IntlProvider
      locale={locale}
      defaultLocale={i18n.defaultLocale}
      messages={messages[locale]}
    >
      {children}
    </IntlProvider>
  );
};

export interface LocaleLinkProps extends LinkProps {}
export const LocaleLink = React.forwardRef<HTMLAnchorElement, LocaleLinkProps>(
  ({ to, ...props }, ref) => {
    const intl = useIntl();

    const localized = React.useMemo(() => {
      if (typeof to === "string") {
        return localePath(to, intl.locale);
      }

      if (to.pathname) {
        return {
          ...to,
          pathname: localePath(to.pathname, intl.locale),
        };
      }

      return to;
    }, [to]);

    return <Link ref={ref} to={localized} {...props} />;
  }
);
LocaleLink.displayName = "@i18n/LocaleLink";

export function useChangeLocale() {
  const navigate = useNavigate();
  const location = useLocation();

  return (locale: Locale) =>
    navigate({
      pathname: `/${locale}/change`,
      search: `?redirectTo=${encodeURIComponent(location.pathname)}`,
    });
}
