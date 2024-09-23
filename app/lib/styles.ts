import { twMerge } from "tailwind-merge";
import { defineConfig } from "cva";

export const { cx, cva, compose } = defineConfig({
  hooks: {
    onComplete: (className) => twMerge(className),
  },
});

export const focusRing = cva({
  base: "focus-visible:ring-2 ring-ring ring-offset-2 ring-offset-background outline-none",
});
