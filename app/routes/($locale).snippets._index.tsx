import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { i18n } from "i18n.config";
import { FormattedDate, FormattedPlural, useIntl } from "react-intl";
import { Link } from "~/components/ui/link";
import { useViewTransitionState } from "~/hooks/use-view-transition";
import { CollectionEntry, getCollection } from "~/lib/collection";

export const loader = ({ params }: LoaderFunctionArgs) => {
  const locale = params.locale ?? i18n.defaultLocale;

  const snippets = getCollection(
    "snippets",
    (entry) => entry._meta.directory === locale
  );

  snippets.sort((a, b) => (a.date > b.date ? -1 : 1));

  const grouped: {
    date: Date;
    items: typeof snippets;
    showYear: boolean;
  }[] = [];

  for (const snippet of snippets) {
    const previous = grouped[grouped.length - 1];

    if (!previous || previous.date.getMonth() !== snippet.date.getMonth()) {
      const showYear =
        !previous || previous.date.getFullYear() !== snippet.date.getFullYear();

      grouped.push({
        showYear,
        date: snippet.date,
        items: [snippet],
      });
      continue;
    }

    previous.items.push(snippet);
  }

  return {
    snippets: grouped,
  };
};

export default function Snippets() {
  const { snippets } = useLoaderData<typeof loader>();

  return (
    <div>
      <ul>
        {snippets.map(({ date, items, showYear }) => {
          return (
            <div key={date}>
              <li className="font-semibold flex justify-between">
                <p>
                  <FormattedDate value={date} month="long" />
                </p>

                {showYear && (
                  <p>
                    <FormattedDate value={date} year="numeric" />
                  </p>
                )}
              </li>
              <ul className="divide-y divide-border divide-dashed">
                {items.map((snippet) => (
                  <li key={snippet.slug}>
                    <SnippetLink
                      snippet={{
                        ...snippet,
                        date: new Date(snippet.date),
                      }}
                    />
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </ul>
    </div>
  );
}

export const SnippetLink = ({
  snippet,
}: {
  snippet: CollectionEntry<"snippets">;
}) => {
  const to = `/snippets/${snippet.slug}`;
  const isTransitioning = useViewTransitionState(to);

  return (
    <Link
      className="flex items-center py-3 text-zinc-200"
      to={to}
      unstable_viewTransition
    >
      <h2
        style={{
          viewTransitionName: isTransitioning ? "snippet-title" : undefined,
        }}
      >
        {snippet.title}
      </h2>

      <p className="ml-auto">
        <FormattedOrdinal value={snippet.date.getDate()} />
      </p>
    </Link>
  );
};

export const FormattedOrdinal = ({ value }: { value: number }) => {
  const intl = useIntl();

  return (
    <FormattedPlural
      value={value}
      one={intl.formatMessage({ id: "plural.one" })}
      two={intl.formatMessage({ id: "plural.two" })}
      few={intl.formatMessage({ id: "plural.few" })}
      other={intl.formatMessage({ id: "plural.other" })}
    >
      {(suffix) => (
        <>
          {value}
          {suffix}
        </>
      )}
    </FormattedPlural>
  );
};
