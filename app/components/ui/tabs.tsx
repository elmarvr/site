import { useComposedRefs } from "@radix-ui/react-compose-refs";
import * as RadixTabs from "@radix-ui/react-tabs";
import { useControllableState } from "@radix-ui/react-use-controllable-state";
import * as React from "react";
import { cx, focusRing } from "~/lib/styles";

interface TabsIndicatorContextValue {
  itemMap: Map<
    React.MutableRefObject<HTMLButtonElement | null>,
    {
      ref: React.MutableRefObject<HTMLButtonElement | null>;
      value: string;
    }
  >;
  activeTrigger: HTMLButtonElement | null;
}

const TabsIndicatorContext =
  React.createContext<TabsIndicatorContextValue | null>(null);

interface TabsProps extends RadixTabs.TabsProps {}
const TabsRoot = React.forwardRef<HTMLDivElement, TabsProps>(
  ({ value: prop, onValueChange, defaultValue, ...props }, ref) => {
    const itemMap = new Map();

    const [value, setValue] = useControllableState({
      prop,
      defaultProp: defaultValue,
      onChange: onValueChange,
    });

    const [activeTrigger, setActiveTrigger] =
      React.useState<HTMLButtonElement | null>(null);

    React.useEffect(() => {
      const items = Array.from(itemMap.values());
      const item = items.find((item) => item.value === value);
      setActiveTrigger(item?.ref.current ?? null);
    }, [value]);

    return (
      <TabsIndicatorContext.Provider value={{ itemMap, activeTrigger }}>
        <RadixTabs.Root
          ref={ref}
          {...props}
          value={value}
          onValueChange={setValue}
        />
      </TabsIndicatorContext.Provider>
    );
  }
);
TabsRoot.displayName = "@ui/Tabs";

interface TabsListProps extends RadixTabs.TabsListProps {}
const TabsList = React.forwardRef<HTMLDivElement, TabsProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <RadixTabs.List
        ref={ref}
        {...props}
        className={cx("border-b relative flex px-3", className)}
      >
        {children}
        <TabsIndicator />
      </RadixTabs.List>
    );
  }
);
TabsList.displayName = "@ui/Tabs.List";

interface TabsTriggerProps extends RadixTabs.TabsTriggerProps {}
const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, ...props }, forwardedRef) => {
    const triggerRef = React.useRef<HTMLButtonElement | null>(null);
    const ref = useComposedRefs(forwardedRef, triggerRef);

    const ctx = React.useContext(TabsIndicatorContext)!;

    React.useEffect(() => {
      ctx.itemMap.set(triggerRef, { ref: triggerRef, value: props.value });

      return () => {
        ctx.itemMap.delete(triggerRef);
      };
    });

    return (
      <RadixTabs.Trigger
        ref={ref}
        {...props}
        className={cx(
          focusRing(),
          "relative px-1.5 ui-state-active:after:h-0.5 h-9 flex items-center cursor-pointer justify-center transition-colors ui-state-active:text-foreground hover:text-foreground text-muted-foreground",
          className
        )}
      />
    );
  }
);
TabsTrigger.displayName = "@ui/Tabs.Trigger";

interface TabsIndicatorProps extends React.ComponentPropsWithoutRef<"div"> {
  placeholder?: boolean;
}
const TabsIndicator = React.forwardRef<HTMLDivElement, TabsIndicatorProps>(
  ({ className, placeholder, style, ...props }, ref) => {
    const ctx = React.useContext(TabsIndicatorContext)!;

    const position = React.useMemo(() => {
      if (!ctx.activeTrigger) return { left: 0, width: 0 };

      return {
        left: ctx.activeTrigger.offsetLeft,
        width: ctx.activeTrigger.offsetWidth,
      };
    }, [ctx.activeTrigger]);

    if (!ctx.activeTrigger) return null;

    return (
      <div
        aria-hidden
        ref={ref}
        className={cx(
          "bottom-0 z-10 left-0 h-0.5 bg-primary rounded-full transition-all",
          className
        )}
        style={{
          position: "absolute",
          transform: `translateX(${position.left}px)`,
          width: position.width,
          ...style,
        }}
        {...props}
      />
    );
  }
);
TabsIndicator.displayName = "@ui/Tabs.Indicator";

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
  type TabsIndicatorProps,
};
