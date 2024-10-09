import * as RadixPopover from "@radix-ui/react-popover";
import * as React from "react";
import { cva, cx, focusRing } from "~/lib/styles";

interface PopoverProps extends RadixPopover.PopoverProps {}
const PopoverRoot = RadixPopover.Root;
PopoverRoot.displayName = "@ui/Popover";

interface PopoverTriggerProps extends RadixPopover.PopoverTriggerProps {}
const PopoverTrigger = RadixPopover.Trigger;
PopoverTrigger.displayName = "@ui/Popover.Trigger";

const popoverVariants = cva({
  base: "bg-popover rounded border text-popover-foreground p-4 z-20 ui-state-open:animate-in ui-state-open:fade-in ui-state-open:zoom-in-95 ui-state-closed:animate-out ui-state-closed:fade-out ui-state-closed:zoom-out-95 ui-side-bottom:slide-in-from-top-2 ui-side-top:slide-in-from-bottom-2",
});

interface PopoverContentProps extends RadixPopover.PopoverContentProps {}
const PopoverContent = React.forwardRef<HTMLDivElement, PopoverContentProps>(
  ({ children, className, sideOffset = 4, ...props }, ref) => {
    return (
      <RadixPopover.Portal>
        <RadixPopover.Content
          ref={ref}
          {...props}
          sideOffset={sideOffset}
          className={cx(focusRing(), popoverVariants(), className)}
        >
          {children}
        </RadixPopover.Content>
      </RadixPopover.Portal>
    );
  }
);
PopoverContent.displayName = "@ui/Popover.Content";

const Popover = Object.assign(PopoverRoot, {
  Trigger: PopoverTrigger,
  Content: PopoverContent,
});

export {
  Popover,
  popoverVariants,
  type PopoverContentProps,
  type PopoverProps,
  type PopoverTriggerProps,
};
