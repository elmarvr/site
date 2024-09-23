import { useNavigate, useSearchParams } from "@remix-run/react";
import * as React from "react";
import { useViewTransitionState } from "~/hooks/use-view-transition";
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
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const isTransitioning = useViewTransitionState();

  const value = params.get("code") ?? items[0];

  return (
    <Tabs
      ref={ref}
      {...props}
      value={value}
      onValueChange={(value) => {
        navigate(
          { search: `?code=${value}` },
          { unstable_viewTransition: true }
        );
      }}
      className="code-group border rounded-md bg-card"
    >
      <Tabs.List>
        {items.map((item, index) => (
          <Tabs.Trigger value={item} key={index}>
            {item}
            {value === item && (
              <div
                className="absolute -bottom-px z-10 left-0 w-full h-0.5 bg-primary rounded-full"
                style={{
                  viewTransitionName: isTransitioning
                    ? `tabs-trigger-${id}`
                    : undefined,
                }}
              />
            )}
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
