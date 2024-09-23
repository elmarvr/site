import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

export default {
  content: [
    "./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}",
    "./content.config.ts",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--color-background)",
        foreground: "var(--color-foreground)",
        primary: "var(--color-primary)",
        "primary-foreground": "var(--color-primary-foreground)",
        popover: "var(--color-popover)",
        "popover-foreground": "var(--color-popover-foreground)",
        accent: "var(--color-accent)",
        "accent-foreground": "var(--color-accent-foreground)",
        muted: "var(--color-muted)",
        "muted-foreground": "var(--color-muted-foreground)",
        card: "var(--color-card)",
        "card-foreground": "var(--color-card-foreground)",

        border: "var(--color-border)",
        ring: "var(--color-ring)",
      },
      screens: {
        "hover-hover": { raw: "(hover: hover)" },
      },
      fontFamily: {
        body: ["Inconsolata", "monospace"],
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
    require("tailwindcss-radix")({
      variantPrefix: "ui",
    }),
  ],
} satisfies Config;
