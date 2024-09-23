import { unstable_useViewTransitionState, useLocation } from "@remix-run/react";
import type { To, RelativeRoutingType } from "@remix-run/router";

function useViewTransitionState(opts?: {
  relative?: RelativeRoutingType;
}): boolean;
function useViewTransitionState(to: To, opts?: ViewTransitionOptions): boolean;
function useViewTransitionState(...args: any[]) {
  const location = useLocation();
  const to = typeof args[0] === "string" ? args[0] : location.pathname;
  const opts = typeof args[0] === "object" ? args[0] : args[1];

  return unstable_useViewTransitionState(to ?? location.pathname, opts);
}

interface ViewTransitionOptions {
  relative?: RelativeRoutingType;
}

export { type ViewTransitionOptions, useViewTransitionState };
