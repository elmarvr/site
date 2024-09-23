import { transformerTwoslash } from "@shikijs/twoslash";

export function twoslash() {
  return transformerTwoslash({
    rendererRich: {
      jsdoc: false,
      hast: {
        hoverToken: {
          tagName: "Popup",
        },
        hoverPopup: {
          tagName: "Popup.Content",
        },
        hoverCompose: ({ popup, token }) => [
          popup,
          {
            type: "element",
            tagName: "Popup.Trigger",
            properties: {
              asChild: true,
            },
            children: [
              {
                type: "element",
                tagName: "span",
                properties: {
                  class:
                    "twoslash-hover duration-300 decoration-card group-hover:decoration-[inherit] underline underline-offset-[5px] decoration-dotted",
                },
                children: [token],
              },
            ],
          },
        ],
        errorToken: {
          tagName: "span",
          properties: {
            class:
              "underline decoration-red-500 decoration-wavy underline-offset-2",
          },
        },
      },
    },
  });
}
