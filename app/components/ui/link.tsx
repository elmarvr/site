import { Link as RemixLink } from "@remix-run/react";
import * as React from "react";
import { useIntl } from "react-intl";
import { $i18n } from "~/i18n/routing";
import { cx, focusRing } from "~/lib/styles";
import { Icon } from "./icon";

interface LinkProps extends React.ComponentPropsWithoutRef<typeof RemixLink> {}
const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, to, children, ...props }, ref) => {
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

    const isExternal =
      typeof _to === "string" &&
      (_to.startsWith("http") || _to.startsWith("www"));

    return (
      <RemixLink
        ref={ref}
        to={_to}
        className={cx(
          "inline-flex items-center gap-1",
          focusRing({ className })
        )}
        {...props}
      >
        {children}
        {isExternal && <Icon.ArrowRight className="size-4 -rotate-45" />}
      </RemixLink>
    );
  }
);
Link.displayName = "@ui/Link";

export { Link, type LinkProps };
