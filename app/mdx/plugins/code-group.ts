import type mdast from "mdast";
import { nanoid } from "nanoid";
import { visit } from "unist-util-visit";

export function codeGroupPlugin() {
  return (tree: mdast.Root) => {
    visit(tree, "containerDirective", (node, index, parent) => {
      if (node.name === "code-group") {
        const items = node.children
          .filter((c) => c.type === "code")
          .map(title)
          .filter((v): v is string => !!v);

        parent!.children.splice(index ?? 0, 1, {
          type: "mdxJsxFlowElement",
          name: "CodeGroup",
          attributes: [
            {
              type: "mdxJsxAttribute",
              name: "id",
              value: nanoid(5),
            },
            {
              type: "mdxJsxAttribute",
              name: "items",
              value: arrayAttributeValue(items),
            },
          ],
          children: node.children.map((c) => {
            if (c.type !== "code") {
              return c;
            }

            const value = title(c);

            return {
              type: "mdxJsxFlowElement",
              name: "CodeGroup.Content",
              attributes: [
                {
                  type: "mdxJsxAttribute",
                  name: "value",
                  value,
                },
              ],
              children: [c],
            };
          }),
        });
      }
    });
  };
}

function title(node: mdast.Code) {
  return node.meta?.match(/\[(.*)\]/)?.[1];
}

function arrayAttributeValue(value: string[]) {
  return {
    type: "mdxJsxAttributeValueExpression",
    value: "",
    data: {
      estree: {
        type: "Program",
        body: [
          {
            type: "ExpressionStatement",
            expression: {
              type: "ArrayExpression",
              elements: value.map((v) => ({
                type: "Literal",
                value: v,
                raw: JSON.stringify(v),
              })),
            },
          },
        ],
        sourceType: "module",
        comments: [],
      },
    },
  };
}

declare module "mdast" {
  export interface RootContentMap {
    containerDirective: ContainerDirective;
    mdxJsxFlowElement: MdxJsxFlowElement;
  }

  interface ContainerDirective extends Parent {
    type: "containerDirective";
    name: string;
  }

  interface MdxJsxFlowElement extends Parent {
    type: "mdxJsxFlowElement";
    name: string;
    attributes: any[];
  }
}
