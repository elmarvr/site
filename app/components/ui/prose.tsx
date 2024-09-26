import * as React from "react";
import { cx } from "~/lib/styles";

interface ProseProps extends React.ComponentPropsWithoutRef<"div"> {}
const Prose = React.forwardRef<HTMLDivElement, ProseProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        {...props}
        className={cx("prose prose-invert prose-zinc", className)}
      />
    );
  }
);
Prose.displayName = "@ui/Prose";

export { Prose, type ProseProps };
