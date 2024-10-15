import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { i18n } from "i18n.config";
import React from "react";
import { useIntl } from "react-intl";
import { SpotifyWidget } from "~/components/spotify-widget";
import { Link } from "~/components/ui/link";
import { Prose } from "~/components/ui/prose";
import { ViewTransitionLink } from "~/components/view-transition-link";
import { getCollection, getEntry } from "~/lib/collection";
import { getPlaybackState } from "~/lib/spotify.server";
import { orderBy } from "~/lib/utils";
import { MDXContent } from "~/mdx/client";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const locale = params.locale ?? i18n.defaultLocale;

  const introduction = getEntry("introduction", locale);

  const snippets = orderBy(
    getCollection("snippets", (entry) => entry._meta.directory === locale),
    (snippet) => snippet.date,
    "desc"
  );

  const projects = getCollection(
    "projects",
    (entry) => entry._meta.directory === locale
  );

  const playbackState = await getPlaybackState();

  const connect = getEntry("connect", locale);

  return {
    introduction,
    recentSnippets: snippets.slice(0, 3),
    recentProjects: projects.slice(0, 3),
    playbackState,
    connect,
  };
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

        <SpotifyWidget state={playbackState} />

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
