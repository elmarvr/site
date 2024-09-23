import * as React from "react";
import * as _jsx_runtime from "react/jsx-runtime";
import * as ReactDOM from "react-dom";
import type { MDXContentProps as __MDXContentProps } from "mdx-bundler/client";

import { CodeBlock } from "~/components/ui/code-block";
import { Popup } from "~/components/ui/popup";
import { CodeGroup } from "~/components/ui/code-group";

function getMDXExport(code: string) {
  const scope = { React, ReactDOM, _jsx_runtime };
  const fn = new Function(...Object.keys(scope), code);

  return fn(...Object.values(scope));
}

export interface MDXContentProps extends __MDXContentProps {
  code: string;
}

export const MDXContent = ({ code, components, ...props }: MDXContentProps) => {
  const Comp = React.useMemo(() => getMDXExport(code).default, [code]);

  return (
    <Comp
      {...props}
      components={{
        ...components,
        pre: CodeBlock,
        Popup,
        CodeGroup,
      }}
    />
  );
};
