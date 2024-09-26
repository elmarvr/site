import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { i18n } from "i18n.config";
import { Link } from "~/components/ui/link";
import { Prose } from "~/components/ui/prose";
import { ViewTransitionLink } from "~/components/view-transition-link";
import { useViewTransitionState } from "~/hooks/use-view-transition";
import { getCollection } from "~/lib/collection";
import { orderBy } from "~/lib/utils";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const locale = params.locale ?? i18n.defaultLocale;

  const snippets = getCollection(
    "snippets",
    (entry) => entry._meta.directory === locale
  );

  const projects = getCollection(
    "projects",
    (entry) => entry._meta.directory === locale
  );

  return {
    recentSnippets: orderBy(snippets, (snippet) => snippet.date, "desc").slice(
      0,
      3
    ),

    recentProjects: projects.slice(0, 3),
  };
};

export default function Index() {
  const { recentProjects, recentSnippets } = useLoaderData<typeof loader>();
  const isTransitioning = useViewTransitionState("/snippets/");

  return (
    <div className="pt-8">
      <h1
        className="text-lg inline-block pb-3 font-semibold"
        style={{
          viewTransitionName: "logo",
        }}
      >
        Elmar
      </h1>
      <Prose>
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quod eius
        culpa necessitatibus perspiciatis recusandae error ullam reiciendis quia
        doloribus impedit corporis veritatis est ipsam, optio accusantium
        aliquam tempore maxime non.
      </Prose>

      <div className="grid grid-cols-2 pt-5">
        <div>
          <h2 className="pb-3 text-muted-foreground">Projects</h2>
          <ul className="space-y-2">
            {recentProjects.map((project) => (
              <li key={project.slug}>
                <Link
                  className="hover:underline"
                  to={project.url ?? project.github ?? "/projects"}
                >
                  {project.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="pb-3 text-muted-foreground">Recent Snippets</h2>
          <ul className="space-y-2">
            {recentSnippets.map((snippet) => (
              <li key={snippet.slug}>
                <ViewTransitionLink
                  name="snippet-title"
                  className="hover:underline"
                  to={`/snippets/${snippet.slug}`}
                >
                  {snippet.title}
                </ViewTransitionLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
