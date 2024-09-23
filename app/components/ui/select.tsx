import * as RadixSelect from "@radix-ui/react-select";
import * as React from "react";
import { cx } from "~/lib/styles";
import { Icon } from "./icon";
import { popoverVariants } from "./popover";

interface SelectProps extends RadixSelect.SelectProps {}
const SelectRoot = RadixSelect.Root;
SelectRoot.displayName = "@ui/Select";

interface SelectTriggerProps extends RadixSelect.SelectTriggerProps {}
const SelectTrigger = RadixSelect.Trigger;
SelectTrigger.displayName = "@ui/Select.Trigger";

interface SelectContentProps
  extends Omit<RadixSelect.SelectContentProps, "position"> {}
const SelectContent = React.forwardRef<HTMLDivElement, SelectContentProps>(
  ({ children, className, sideOffset = 2, ...props }, ref) => {
    return (
      <RadixSelect.Portal>
        <RadixSelect.Content
          position="popper"
          sideOffset={sideOffset}
          ref={ref}
          {...props}
          className={cx(popoverVariants(), "p-1", className)}
        >
          <RadixSelect.Viewport>{children}</RadixSelect.Viewport>
        </RadixSelect.Content>
      </RadixSelect.Portal>
    );
  }
);
SelectContent.displayName = "@ui/Select.Content";

interface SelectItemProps extends RadixSelect.SelectItemProps {}
const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <RadixSelect.Item
        ref={ref}
        {...props}
        className={cx(
          "flex items-center text-sm pl-2 pr-10 py-1 relative transition-colors rounded outline-none focus:bg-accent",
          className
        )}
      >
        <RadixSelect.ItemText>{children}</RadixSelect.ItemText>

        <RadixSelect.ItemIndicator className="absolute right-2">
          <Icon.Check className="size-4 text-primary animate-in zoom-in" />
        </RadixSelect.ItemIndicator>
      </RadixSelect.Item>
    );
  }
);
SelectItem.displayName = "@ui/Select.Item";

const Select = Object.assign(SelectRoot, {
  Trigger: SelectTrigger,
  Content: SelectContent,
  Item: SelectItem,
});

export {
  Select,
  type SelectContentProps,
  type SelectItemProps,
  type SelectProps,
  type SelectTriggerProps,
};
