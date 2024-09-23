import * as React from "react";
import { cx } from "~/lib/styles";
import {
  Popover,
  type PopoverContentProps,
  type PopoverProps,
  type PopoverTriggerProps,
} from "./popover";

const PopupContext = React.createContext<{
  onOpenChange: (e: React.PointerEvent, value: boolean) => void;
} | null>(null);

function usePopupContext(component: string) {
  const ctx = React.useContext(PopupContext);

  if (!ctx) {
    throw new Error(`<${component} /> must be used within a <Popup />`);
  }

  return ctx;
}

interface PopupProps extends PopoverProps {
  delay?: number;
}
const PopupRoot = ({ children, delay = 200, ...props }: PopupProps) => {
  const [open, setOpen] = React.useState(false);
  const timeoutRef = React.useRef<NodeJS.Timeout>();

  const onOpenChange = React.useCallback(
    (e: React.PointerEvent, value: boolean) => {
      if (e.pointerType === "touch") return;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        setOpen(value);
      }, delay);
    },
    [delay]
  );

  return (
    <PopupContext.Provider value={{ onOpenChange }}>
      <Popover {...props} open={open} onOpenChange={setOpen}>
        {children}
      </Popover>
    </PopupContext.Provider>
  );
};
PopupRoot.displayName = "@ui/Popup";

interface PopupTriggerProps extends PopoverTriggerProps {}
const PopupTrigger = React.forwardRef<HTMLButtonElement, PopupTriggerProps>(
  ({ children, ...props }, ref) => {
    const ctx = usePopupContext("Popup.Trigger");

    return (
      <Popover.Trigger
        ref={ref}
        {...props}
        onPointerEnter={(e) => ctx.onOpenChange(e, true)}
        onPointerLeave={(e) => ctx.onOpenChange(e, false)}
      >
        {children}
      </Popover.Trigger>
    );
  }
);
PopupTrigger.displayName = "@ui/Popup.Trigger";

interface PopupContentProps extends PopoverContentProps {}
const PopupContent = React.forwardRef<HTMLDivElement, PopupContentProps>(
  (
    { children, className, align = "start", collisionPadding = 8, ...props },
    ref
  ) => {
    const ctx = usePopupContext("Popup.Content");

    return (
      <Popover.Content
        ref={ref}
        {...props}
        align={align}
        collisionPadding={collisionPadding}
        onPointerEnter={(e) => ctx.onOpenChange(e, true)}
        onPointerLeave={(e) => ctx.onOpenChange(e, false)}
        onOpenAutoFocus={(e) => {
          e.preventDefault();
        }}
        className={cx("p-2 text-sm", className)}
      >
        {children}
      </Popover.Content>
    );
  }
);
PopupContent.displayName = "@ui/Popup.Content";

const Popup = Object.assign(PopupRoot, {
  Trigger: PopupTrigger,
  Content: PopupContent,
});

export {
  Popup,
  type PopupContentProps,
  type PopupProps,
  type PopupTriggerProps,
};
