import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { i18n } from "i18n.config";

import { Icon } from "~/components/ui/icon";
import { Link } from "~/components/ui/link";
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
    <ul>
      {projects.map((project) => {
        return (
          <li key={project.slug}>
            <div className="flex justify-between items-center">
              <h2 className="font-normal">{project.title}</h2>

              <ul className="flex">
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

            <div className="text-zinc-200">
              <MDXContent code={project.content} />
            </div>

            <div className="flex">
              {project.url && (
                <Link
                  className="block hover:text-primary transition-colors"
                  to={project.url}
                >
                  Live <Icon.ArrowRight className="inline -rotate-45 size-4" />
                </Link>
              )}
              {project.github && (
                <Link
                  className="block hover:text-primary transition-colors"
                  to={project.github}
                >
                  Source{" "}
                  <Icon.ArrowRight className="inline -rotate-45 size-4" />
                </Link>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
