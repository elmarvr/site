import { LoaderFunctionArgs, MetaArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { Link } from "~/components/ui/link";
import { Prose } from "~/components/ui/prose";
import { createServerIntl } from "~/i18n/server";
import { getCollection } from "~/lib/collection";
import { generateSeoMeta } from "~/lib/seo.server";
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
  const title = intl.formatMessage({ id: "page.projects.title" });
  const description = intl.formatMessage({ id: "page.projects.description" });

  const projects = getCollection(
    "projects",
    (entry) => entry._meta.directory === intl.locale
  );

  return {
    projects,
    seo,
    title,
    description,
  };
};

export default function Projects() {
  const { projects } = useLoaderData<typeof loader>();

  return (
    <ul className="space-y-7 pt-8">
      {projects.map((project, index) => {
        return (
          <li
            key={project.slug}
            className="space-y-3 animate-in fade-in fill-mode-both slide-in-from-bottom-10"
            style={{
              animationDelay: `${100 * index}ms`,
            }}
          >
            <div className="flex items-center">
              <h2 className="font-semibold">{project.title}</h2>

              {[project.url, project.github].filter(Boolean).length > 0 && (
                <div className="h-[1em] w-px bg-border mx-5" />
              )}

              <div className="flex gap-3">
                {project.url && (
                  <ProjectLink to={project.url}>Live</ProjectLink>
                )}
                {project.github && (
                  <ProjectLink to={project.github}>Source</ProjectLink>
                )}
              </div>
            </div>

            <Prose>
              <MDXContent code={project.content} />
            </Prose>

            <ul className="flex flex-wrap gap-2">
              {project.skills.map((skill) => {
                return (
                  <li
                    className="bg-card py-0.5 px-2 text-xs rounded"
                    key={skill.name}
                  >
                    {skill.name}
                  </li>
                );
              })}
            </ul>
          </li>
        );
      })}
    </ul>
  );
}

const ProjectLink = ({
  to,
  children,
}: {
  to: string;
  children: React.ReactNode;
}) => {
  return (
    <Link className="flex items-center gap-1 group hover:underline" to={to}>
      {children}
    </Link>
  );
};
