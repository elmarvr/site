import { LoaderFunctionArgs, MetaArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { FormattedDate, FormattedPlural, useIntl } from "react-intl";

import { CollectionEntry, getCollection } from "~/lib/collection";
import { ViewTransitionLink } from "~/components/view-transition-link";
import { orderBy } from "~/lib/utils";
import { createServerIntl, detectLocale } from "~/i18n/server";
import { generateSeoMeta } from "~/lib/seo.server";

export const meta = ({ data }: MetaArgs<typeof loader>) => {
  if (!data) return [];

  return [
    {
      title: data.title,
    },
    {
      name: "description",
      content: data.description,
    },
    ...data.seo.links,
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const intl = await createServerIntl(request);
  const seo = await generateSeoMeta(request);
  const title = intl.formatMessage({ id: "page.snippets.title" });
  const description = intl.formatMessage({ id: "page.snippets.description" });

  const snippets = orderBy(
    getCollection("snippets", (entry) => entry._meta.directory === intl.locale),
    (snippet) => snippet.date,
    "desc"
  );

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
    seo,
    title,
    description,
  };
};

export default function Snippets() {
  const { snippets } = useLoaderData<typeof loader>();

  return (
    <div className="pt-8">
      <ul className="space-y-4">
        {snippets.map(({ date, items, showYear }) => {
          return (
            <div key={date}>
              <li className="flex justify-between font-semibold">
                <time>
                  <FormattedDate value={date} month="long" />
                </time>

                {showYear && (
                  <time>
                    <FormattedDate value={date} year="numeric" />
                  </time>
                )}
              </li>

              <ul className="divide-y divide-border divide-dashed">
                {items.map((snippet) => (
                  <SnippetItem
                    key={snippet.slug}
                    snippet={{
                      ...snippet,
                      date: new Date(snippet.date),
                    }}
                  />
                ))}
              </ul>
            </div>
          );
        })}
      </ul>
    </div>
  );
}

export const SnippetItem = ({
  snippet,
}: {
  snippet: CollectionEntry<"snippets">;
}) => {
  return (
    <li className="flex justify-between py-3 items-center text-zinc-300">
      <ViewTransitionLink
        to={`/snippets/${snippet.slug}`}
        name="snippet-title"
        className="hover:underline underline-offset-2"
      >
        {snippet.title}
      </ViewTransitionLink>

      <time>
        <FormattedOrdinal value={new Date(snippet.date).getDate()} />
      </time>
    </li>
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
