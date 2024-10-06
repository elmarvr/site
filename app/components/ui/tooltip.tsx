import * as RadixTooltip from "@radix-ui/react-tooltip";
import * as React from "react";
import { cx } from "~/lib/styles";

interface TooltipProps extends RadixTooltip.TooltipProps {}
const TooltipRoot = RadixTooltip.Root;
TooltipRoot.displayName = "@ui/Tooltip";

interface TooltipTriggerProps extends RadixTooltip.TooltipTriggerProps {}
const TooltipTrigger = RadixTooltip.Trigger;
TooltipTrigger.displayName = "@ui/Tooltip.Trigger";

interface TooltipContentProps extends RadixTooltip.TooltipContentProps {}
const TooltipContent = React.forwardRef<HTMLDivElement, TooltipContentProps>(
  ({ children, className, sideOffset = 4, ...props }, ref) => {
    return (
      <RadixTooltip.Portal>
        <RadixTooltip.Content
          ref={ref}
          {...props}
          sideOffset={sideOffset}
          className={cx(
            "bg-border text-sm py-1 px-2 rounded text-foreground z-20",
            className
          )}
        >
          {children}
        </RadixTooltip.Content>
      </RadixTooltip.Portal>
    );
  }
);
TooltipContent.displayName = "@ui/Tooltip.Content";

const Tooltip = Object.assign(TooltipRoot, {
  Trigger: TooltipTrigger,
  Content: TooltipContent,
});

export {
  Tooltip,
  type TooltipContentProps,
  type TooltipProps,
  type TooltipTriggerProps,
};
