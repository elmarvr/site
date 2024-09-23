import * as React from "react";
import { cx } from "~/lib/styles";
import { Button } from "./button";
import { Icon } from "./icon";
import { useCopyToClipboard } from "~/hooks/use-copy-to-clipboard";

export const CodeBlock = React.forwardRef<
  HTMLPreElement,
  React.ComponentPropsWithoutRef<"pre">
>(({ style, className, ...props }, ref) => {
  return (
    <div className="p-4 not-prose group bg-card text-sm relative text-foreground md border">
      <CopyButton />
      <pre
        ref={ref}
        {...props}
        className={cx(
          "outline-none ring-offset-2 ring-offset-card focus-visible:ring-2 ring-ring overflow-x-auto sm:overflow-x-visible",
          className
        )}
      />
    </div>
  );
});
CodeBlock.displayName = "@ui/CodeBlock";

export const CopyButton = () => {
  const [status, copyToClipboard] = useCopyToClipboard();
  const Comp = status === "copied" ? Icon.Check : Icon.Copy;

  return (
    <Button
      className="absolute top-4 right-4 grid place-items-center bg-card border size-7 group-hover:opacity-100 md:opacity-0 transition-[opacity,colors]"
      onClick={(event) => {
        copyToClipboard(event.currentTarget.nextSibling?.textContent ?? "");
      }}
    >
      <Comp className="size-4 animate-in zoom-in fade-in" />
    </Button>
  );
};
