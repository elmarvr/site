import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import contentCollections from "@content-collections/remix-vite";
import icons from "unplugin-icons/vite";

export default defineConfig({
  plugins: [
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
      },
    }),
    tsconfigPaths(),
    contentCollections({
      configPath: "content.config.ts",
    }),
    icons({ compiler: "jsx", jsx: "react" }),
  ],
});
