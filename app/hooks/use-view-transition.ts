import { unstable_useViewTransitionState, useLocation } from "@remix-run/react";
import type { To, RelativeRoutingType } from "@remix-run/router";
import { useIntl } from "react-intl";
import { $i18n } from "~/i18n/route";

function useViewTransitionState(opts?: {
  relative?: RelativeRoutingType;
}): boolean;
function useViewTransitionState(to: To, opts?: ViewTransitionOptions): boolean;
function useViewTransitionState(...args: any[]) {
  const location = useLocation();
  const intl = useIntl();

  const to = typeof args[0] === "string" ? args[0] : location.pathname;
  const opts = typeof args[0] === "object" ? args[0] : args[1];

  return unstable_useViewTransitionState($i18n(to, intl.locale), opts);
}

interface ViewTransitionOptions {
  relative?: RelativeRoutingType;
}

export { type ViewTransitionOptions, useViewTransitionState };
