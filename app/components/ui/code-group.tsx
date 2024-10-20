import * as React from "react";
import { Tabs, TabsContentProps, TabsProps } from "./tabs";

interface CodeGroupProps extends TabsProps {
  id: string;
  items: string[];
  children: React.ReactNode;
}

const CodeGroupRoot = React.forwardRef<
  HTMLDivElement,
  Omit<CodeGroupProps, "value" | "onValueChange" | "defaultValue">
>(({ id, items, children, ...props }, ref) => {
  return (
    <Tabs
      ref={ref}
      defaultValue={items[0]}
      {...props}
      className="code-group border rounded bg-card"
    >
      <Tabs.List>
        {items.map((item, index) => (
          <Tabs.Trigger value={item} key={index}>
            {item}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
      {children}
    </Tabs>
  );
});
CodeGroupRoot.displayName = "@ui/CodeGroup";

const CodeGroupContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, ...props }, ref) => {
    return (
      <Tabs.Content ref={ref} {...props} className="[&>div]:border-none mt-0" />
    );
  }
);
CodeGroupContent.displayName = "@ui/CodeGroup.Content";

const CodeGroup = Object.assign(CodeGroupRoot, {
  Content: CodeGroupContent,
});

export { CodeGroup, type CodeGroupProps };
