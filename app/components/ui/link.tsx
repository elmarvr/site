import { Link as RemixLink } from "@remix-run/react";
import * as React from "react";
import { cx, focusRing } from "~/lib/styles";
import { Icon } from "./icon";
import { isExternalUrl } from "~/lib/utils";
import { LocaleLink, type LocaleLinkProps } from "~/i18n/react";

interface LinkProps extends LocaleLinkProps {}
const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, to, children, ...props }, ref) => {
    const isExternal = typeof to === "string" && isExternalUrl(to);
    const Comp = isExternal ? RemixLink : LocaleLink;

    return (
      <Comp
        ref={ref}
        to={to}
        className={cx(
          "inline-flex items-center gap-1",
          focusRing({ className })
        )}
        {...props}
      >
        {children}
        {isExternal && (
          <Icon.ArrowRight className="size-3.5 mt-0.5 -rotate-45 text-primary" />
        )}
      </Comp>
    );
  }
);
Link.displayName = "@ui/Link";

export { Link, type LinkProps };
