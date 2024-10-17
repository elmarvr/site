import type { LoaderFunctionArgs, MetaArgs } from "@remix-run/node";
import { Await, defer, useLoaderData } from "@remix-run/react";
import React, { Suspense } from "react";
import { useIntl } from "react-intl";
import { SpotifyWidget } from "~/components/spotify-widget";
import { Link } from "~/components/ui/link";
import { Prose } from "~/components/ui/prose";
import { ViewTransitionLink } from "~/components/view-transition-link";
import { createServerIntl } from "~/i18n/server";
import { getCollection, getEntry } from "~/lib/collection";
import { generateSeoMeta } from "~/lib/seo.server";
import { getPlaybackState } from "~/lib/spotify.server";
import { orderBy } from "~/lib/utils";
import { MDXContent } from "~/mdx/client";

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

  const title = intl.formatMessage({ id: "page.index.title" });
  const description = intl.formatMessage({ id: "page.index.description" });

  const introduction = getEntry("introduction", intl.locale);

  const snippets = orderBy(
    getCollection("snippets", (entry) => entry._meta.directory === intl.locale),
    (snippet) => snippet.date,
    "desc"
  );

  const projects = getCollection(
    "projects",
    (entry) => entry._meta.directory === intl.locale
  );

  const connect = getEntry("connect", intl.locale);

  return defer({
    introduction,
    recentSnippets: snippets.slice(0, 3),
    recentProjects: projects.slice(0, 3),
    playbackState: getPlaybackState(),
    connect,
    seo,
    title,
    description,
  });
};

export default function Index() {
  const intl = useIntl();
  const {
    introduction,
    recentProjects,
    recentSnippets,
    playbackState,
    connect,
  } = useLoaderData<typeof loader>();

  return (
    <div className="pt-8">
      <h1
        className="text-lg inline-block pb-5 font-semibold"
        style={{
          viewTransitionName: "logo",
        }}
      >
        Elmar
      </h1>
      <div className="space-y-12">
        <Prose>
          <MDXContent code={introduction.content} />
        </Prose>

        <div className="grid grid-cols-2">
          <RecentList title={intl.formatMessage({ id: "projects.recent" })}>
            {recentProjects.map((project) => (
              <RecentListItem key={project.slug}>
                <Link to={project.url ?? project.github ?? "/projects"}>
                  {project.title}
                </Link>
              </RecentListItem>
            ))}
          </RecentList>

          <RecentList title={intl.formatMessage({ id: "snippets.recent" })}>
            {recentSnippets.map((snippet) => (
              <RecentListItem key={snippet.slug}>
                <ViewTransitionLink
                  name="snippet-title"
                  to={`/snippets/${snippet.slug}`}
                >
                  {snippet.title}
                </ViewTransitionLink>
              </RecentListItem>
            ))}
          </RecentList>
        </div>

        <div>
          <Suspense
            fallback={
              <div className="h-[100px] bg-card/20 rounded animate-pulse"></div>
            }
          >
            <Await resolve={playbackState}>
              {(state) => <SpotifyWidget state={state} />}
            </Await>
          </Suspense>
        </div>

        <div>
          <h2 className="pb-5 text-muted-foreground">Connect</h2>
          <Prose>
            <MDXContent code={connect.content} />
          </Prose>
        </div>
      </div>
    </div>
  );
}

const RecentList = ({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) => {
  return (
    <div>
      <h2 className="pb-5 text-muted-foreground">{title}</h2>
      <ul className="space-y-3">{children}</ul>
    </div>
  );
};

const RecentListItem = ({ children }: { children: React.ReactNode }) => {
  return <li className="hover:underline">{children}</li>;
};
