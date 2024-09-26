import * as React from "react";
import { Link, LinkProps } from "./ui/link";
import { useViewTransitionState } from "~/hooks/use-view-transition";

interface ViewTransitionLinkProps
  extends Omit<LinkProps, "unstable_viewTransition"> {
  name: string;
}
const ViewTransitionLink = React.forwardRef<
  HTMLAnchorElement,
  ViewTransitionLinkProps
>(({ to, name, style, ...props }, ref) => {
  const isTransitioning = useViewTransitionState(to);

  return (
    <Link
      ref={ref}
      to={to}
      unstable_viewTransition
      {...props}
      style={{
        viewTransitionName: isTransitioning ? name : undefined,
        ...style,
      }}
    />
  );
});

export { ViewTransitionLink, type ViewTransitionLinkProps };
