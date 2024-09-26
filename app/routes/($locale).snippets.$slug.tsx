import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { i18n } from "i18n.config";
import { FormattedMessage } from "react-intl";
import { Icon } from "~/components/ui/icon";
import { Link } from "~/components/ui/link";
import { Prose } from "~/components/ui/prose";
import { useViewTransitionState } from "~/hooks/use-view-transition";

import { getCollection, getEntry } from "~/lib/collection";
import { attr } from "~/lib/utils";
import { MDXContent } from "~/mdx/client";

export const loader = ({ params }: LoaderFunctionArgs) => {
  const locale = params.locale ?? i18n.defaultLocale;

  const snippet = getEntry("snippets", `${locale}/${params.slug}`);

  if (!snippet) {
    throw new Response(null, {
      status: 404,
      statusText: "Not Found",
    });
  }

  return {
    snippet,
  };
};

export default function SnippetName() {
  const { snippet } = useLoaderData<typeof loader>();
  const isTransitioning = useViewTransitionState("/snippets");

  return (
    <div className="pt-8">
      <h2
        className="inline-flex text-lg pb-3"
        style={{
          viewTransitionName: "snippet-title",
        }}
      >
        {snippet.title}
      </h2>

      <Prose
        data-entering={attr(isTransitioning)}
        className="animate-in data-[entering]:fade-in data-[entering]:slide-in-from-bottom-1/2"
      >
        <MDXContent code={snippet.content} />
      </Prose>

      <div className="py-5 flex justify-between">
        {snippet.previous && (
          <Link
            className="flex flex-col group"
            to={`/snippets/${snippet.previous.slug}`}
          >
            <div className="flex items-center text-sm text-muted-foreground">
              <Icon.CaretLeft className="size-[1em]" />
              <FormattedMessage id="general.previous" />
            </div>
            <span className="group-hover:underline">
              {snippet.previous.title}
            </span>
          </Link>
        )}

        {snippet.next && (
          <Link
            className="flex flex-col items-end group ml-auto"
            to={`/snippets/${snippet.next.slug}`}
          >
            <div className="flex items-center text-sm text-muted-foreground">
              <FormattedMessage id="general.next" />
              <Icon.CaretRight className="size-[1em]" />
            </div>
            <span className="group-hover:underline">{snippet.next.title}</span>
          </Link>
        )}
      </div>
    </div>
  );
}

// <h1 className="text-lg">{snippet.title}</h1>
// <p className="text-muted-foreground">
//   <FormattedDate
//     value={snippet.date}
//     day="numeric"
//     month="short"
//     year="numeric"
//   />
// </p>

// <div
// data-entering={isTransitioning ? "" : undefined}
// className="prose-zinc prose-invert [&>p+.code-group]:mt-7 data-[entering]:animate-in data-[entering]:slide-in-from-bottom-4 data-[entering]:fade-in"
// >
// <MDXContent code={snippet.content} />
// </div>

// <div className="flex justify-between mt-8 border-t gap-4 py-4">
// {previous && <SnippetLink snippet={previous} type="previous" />}
// {next && <SnippetLink snippet={next} type="next" />}
// </div>

// const SnippetLink = ({
//   snippet,
//   type,
// }: {
//   snippet: SerializeFrom<CollectionEntry<"snippets">>;
//   type: "previous" | "next";
// }) => {
//   return (
//     <Link
//       unstable_viewTransition
//       className={cx(
//         "flex flex-col group",
//         type === "next" ? "ml-auto" : "mr-auto"
//       )}
//       to={`/snippets/${snippet.slug}`}
//     >
//       <p
//         className={cx(
//           "text-muted-foreground text-sm",
//           type === "next" ? "text-right" : ""
//         )}
//       >
//         <FormattedMessage id={`general.${type}`} />
//       </p>
//       <p className="underline decoration-background group-hover:decoration-foreground transition-colors underline-offset-4 decoration-1">
//         {snippet.title}
//       </p>
//     </Link>
//   );
// };
