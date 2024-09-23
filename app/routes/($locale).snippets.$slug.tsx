import { LoaderFunctionArgs, SerializeFrom } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { FormattedDate, FormattedMessage } from "react-intl";
import { i18n } from "i18n.config";

import { Link } from "~/components/ui/link";
import { CollectionEntry, getCollection, getEntry } from "~/lib/collection";
import { MDXContent } from "~/mdx/client";
import { useViewTransitionState } from "~/hooks/use-view-transition";
import { cx } from "~/lib/styles";

export const loader = ({ params }: LoaderFunctionArgs) => {
  const locale = params.locale ?? i18n.defaultLocale;

  const snippet = getEntry("snippets", `${locale}/${params.slug}`);

  if (!snippet) {
    throw new Response(null, {
      status: 404,
      statusText: "Not Found",
    });
  }

  const snippets = getCollection(
    "snippets",
    (entry) => entry._meta.directory === locale
  );

  snippets.sort((a, b) => {
    return a.date > b.date ? -1 : 1;
  });

  const index = snippets.findIndex((s) => s.slug === snippet.slug);
  const previous = snippets[index - 1];
  const next = snippets[index + 1];

  return {
    snippet,
    previous,
    next,
  };
};

export default function SnippetName() {
  const { snippet, previous, next } = useLoaderData<typeof loader>();
  const isTransitioning = useViewTransitionState("/snippets");

  return (
    <div>
      <div
        className="pb-4"
        style={{
          viewTransitionName: "snippet-title",
        }}
      >
        <h1 className="text-lg">{snippet.title}</h1>
        <p className="text-muted-foreground">
          <FormattedDate
            value={snippet.date}
            day="numeric"
            month="short"
            year="numeric"
          />
        </p>
      </div>

      <div
        data-entering={isTransitioning ? "" : undefined}
        className="prose-zinc prose-invert [&>p+.code-group]:mt-7 data-[entering]:animate-in data-[entering]:slide-in-from-bottom-4 data-[entering]:fade-in"
      >
        <MDXContent code={snippet.content} />
      </div>

      <div className="flex justify-between mt-8 border-t gap-4 py-4">
        {previous && <SnippetLink snippet={previous} type="previous" />}
        {next && <SnippetLink snippet={next} type="next" />}
      </div>
    </div>
  );
}

const SnippetLink = ({
  snippet,
  type,
}: {
  snippet: SerializeFrom<CollectionEntry<"snippets">>;
  type: "previous" | "next";
}) => {
  return (
    <Link
      unstable_viewTransition
      className={cx(
        "flex flex-col group",
        type === "next" ? "ml-auto" : "mr-auto"
      )}
      to={`/snippets/${snippet.slug}`}
    >
      <p
        className={cx(
          "text-muted-foreground text-sm",
          type === "next" ? "text-right" : ""
        )}
      >
        <FormattedMessage id={`general.${type}`} />
      </p>
      <p className="underline decoration-background group-hover:decoration-foreground transition-colors underline-offset-4 decoration-1">
        {snippet.title}
      </p>
    </Link>
  );
};
