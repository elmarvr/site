import { compileMDX as __compileMDX } from "@content-collections/mdx";
import rehypeShiki from "@shikijs/rehype";
import remarkDirective from "remark-directive";

import { twoslash } from "./plugins/twoslash";
import { filenamePlugin } from "./plugins/filename";
import { codeGroupPlugin } from "./plugins/code-group";

type CompileArgs = Parameters<typeof __compileMDX> extends [
  infer Context,
  infer Document,
  any?
]
  ? [context: Context, document: Document]
  : never;

export async function compileMDX(...[context, document]: CompileArgs) {
  return __compileMDX(context, document, {
    remarkPlugins: [filenamePlugin, remarkDirective, codeGroupPlugin],
    rehypePlugins: [
      [
        rehypeShiki,
        {
          theme: "one-dark-pro",
          transformers: [twoslash()],
        },
      ],
    ],
  });
}
