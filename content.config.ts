import skills from "~/content/skills.json";
import { defineCollection, defineConfig } from "@content-collections/core";
import { compileMDX } from "~/mdx/compile";

const snippets = defineCollection({
  name: "snippets",
  directory: "app/content/snippets",
  include: "**/*.mdx",
  schema: (z) => ({
    title: z.string(),
    date: z.coerce.date(),
    // summary: z.string(),
  }),
  transform: async (document, context) => {
    const content = await compileMDX(context, document);

    return {
      ...document,
      slug: document._meta.fileName.split(".")[0],
      content,
    };
  },
});

const projects = defineCollection({
  name: "projects",
  directory: "app/content/projects",
  include: "**/*.mdx",
  schema: (z) => ({
    title: z.string(),
    image: z.string(),
    skills: z.array(z.enum(Object.keys(skills) as [keyof typeof skills])),
    url: z.string().optional(),
    github: z.string().optional(),
  }),

  transform: async (document, context) => {
    const content = await compileMDX(context, document);

    return {
      ...document,
      skills: document.skills.map(
        (skill) => skills[skill] as (typeof skills)["react"]
      ),
      slug: document._meta.fileName.split(".")[0],
      content,
    };
  },
});

export default defineConfig({
  collections: [snippets, projects],
});
