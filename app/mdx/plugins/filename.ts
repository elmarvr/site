import type mdast from "mdast";
import { visit } from "unist-util-visit";

const filenameRegex = /filename="(.*)"/;
const importRegex = /from ('|")\.\/(.*)('|")/g;

const imports = new Map<string, string>();

export const filenamePlugin = () => {
  return (tree: mdast.Root) => {
    visit(tree, "code", (node: mdast.Code) => {
      if (!node.meta) return;
      const filename = node.meta.match(filenameRegex)?.[1];

      if (filename) {
        node.value = `//@filename: ${filename}\n//---cut---\n${node.value}`;

        imports.set(filename.split(".")[0], node.value);
      }
    });

    visit(tree, "code", (node: mdast.Code) => {
      node.value = resolveImports(node.value);
    });
  };
};

// Could be optimized, but it's fine for now
function resolveImports(code: string): string {
  const matches = code.matchAll(importRegex);

  for (const match of matches) {
    const value = imports.get(match[2]);

    if (value) {
      code = `${resolveImports(value)}\n${code}`;
    }
  }

  return code;
}
