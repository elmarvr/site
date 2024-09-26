import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { i18n } from "i18n.config";

import { Icon } from "~/components/ui/icon";
import { Link } from "~/components/ui/link";
import { Prose } from "~/components/ui/prose";
import { getCollection } from "~/lib/collection";
import { MDXContent } from "~/mdx/client";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const locale = params.locale ?? i18n.defaultLocale;

  const projects = getCollection(
    "projects",
    (entry) => entry._meta.directory === locale
  );

  return {
    projects,
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
            <div className="flex justify-between items-center">
              <h2 className="font-semibold">{project.title}</h2>

              <ul className="flex gap-2">
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
            </div>

            <Prose>
              <MDXContent code={project.content} />
            </Prose>

            <div className="flex gap-3">
              {project.url && <ProjectLink to={project.url}>Live</ProjectLink>}
              {project.github && (
                <ProjectLink to={project.github}>Source</ProjectLink>
              )}
            </div>
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
      <Icon.ArrowRight className="-rotate-45 size-3.5 text-primary mt-0.5" />
    </Link>
  );
};
