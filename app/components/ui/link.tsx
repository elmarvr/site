import { Link as RemixLink } from "@remix-run/react";
import * as React from "react";
import { useIntl } from "react-intl";
import { $i18n } from "~/i18n/routing";
import { focusRing } from "~/lib/styles";

interface LinkProps extends React.ComponentPropsWithoutRef<typeof RemixLink> {}
const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, to, ...props }, ref) => {
    const intl = useIntl();

    const _to = React.useMemo(() => {
      if (typeof to === "string") {
        return $i18n(to, intl.locale);
      }

      if (to.pathname) {
        return {
          ...to,
          pathname: $i18n(to.pathname, intl.locale),
        };
      }

      return to;
    }, [to, intl.locale]);

    return (
      <RemixLink
        ref={ref}
        to={_to}
        className={focusRing({ className })}
        {...props}
      />
    );
  }
);
Link.displayName = "@ui/Link";

export { Link, type LinkProps };
