import * as RadixTabs from "@radix-ui/react-tabs";
import * as React from "react";
import { cx, focusRing } from "~/lib/styles";

interface TabsProps extends RadixTabs.TabsProps {}
const TabsRoot = RadixTabs.Root;
TabsRoot.displayName = "@ui/Tabs";

interface TabsListProps extends RadixTabs.TabsListProps {}
const TabsList = React.forwardRef<HTMLDivElement, TabsProps>(
  ({ className, ...props }, ref) => {
    return (
      <RadixTabs.List
        ref={ref}
        {...props}
        className={cx("border-b flex px-3", className)}
      />
    );
  }
);
TabsList.displayName = "@ui/Tabs.List";

interface TabsTriggerProps extends RadixTabs.TabsTriggerProps {}
const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, ...props }, ref) => {
    return (
      <RadixTabs.Trigger
        ref={ref}
        {...props}
        className={cx(
          focusRing(),
          "relative text-sm px-1.5 ui-state-active:after:h-0.5 font-normal h-9 flex items-center cursor-pointer justify-center transition-colors ui-state-active:text-foreground hover:text-foreground text-muted-foreground",
          className
        )}
      />
    );
  }
);
TabsTrigger.displayName = "@ui/Tabs.Trigger";

interface TabsContentProps extends RadixTabs.TabsContentProps {}
const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, ...props }, ref) => {
    return (
      <RadixTabs.Content
        ref={ref}
        {...props}
        className={cx(focusRing(), "rounded mt-2", className)}
      />
    );
  }
);
TabsContent.displayName = "@ui/Tabs.Content";

const Tabs = Object.assign(TabsRoot, {
  List: TabsList,
  Trigger: TabsTrigger,
  Content: TabsContent,
});

export {
  Tabs,
  type TabsContentProps,
  type TabsListProps,
  type TabsProps,
  type TabsTriggerProps,
};
