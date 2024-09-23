import { Slot } from "@radix-ui/react-slot";
import type { VariantProps } from "cva";
import * as React from "react";
import { compose, cva, focusRing } from "~/lib/styles";

const buttonStyle = compose(
  focusRing,
  cva({
    base: "px-4 h-9 flex items-center justify-center rounded transition-colors",
    variants: {
      variant: {
        subtle: "bg-transparent text-white hover:bg-white/10",
      },
      size: {
        icon: "p-0 w-9",
      },
    },
    defaultVariants: {
      variant: "subtle",
      size: "icon",
    },
  })
);

interface ButtonProps
  extends React.ComponentPropsWithoutRef<"button">,
    VariantProps<typeof buttonStyle> {
  asChild?: boolean;
}
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        {...props}
        className={buttonStyle({
          className,
          variant,
          size,
        })}
      />
    );
  }
);
Button.displayName = "@ui/Button";

export { Button, type ButtonProps };
