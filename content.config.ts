import skills from "~/content/skills.json";
import {
  defineCollection,
  defineConfig,
  Schema,
} from "@content-collections/core";
import { compileMDX } from "~/mdx/compile";
import { orderBy } from "~/lib/utils";

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
    const locale = document._meta.directory;

    const docs = orderBy(
      await context.collection.documents(),
      (doc) => doc.date
    ).filter((doc) => doc._meta.directory === locale);

    const index = docs.findIndex(
      (doc) => doc._meta.fileName === document._meta.fileName
    );

    const content = await compileMDX(context, document);

    const previous = docs[index - 1] ?? null;
    const next = docs[index + 1] ?? null;

    return {
      ...document,
      slug: slugify(document),
      content,
      previous: previous && {
        title: previous.title,
        slug: slugify(previous),
      },
      next: next && {
        title: next.title,
        slug: slugify(next),
      },
    };
  },
});

const projects = defineCollection({
  name: "projects",
  directory: "app/content/projects",
  include: "**/*.mdx",
  schema: (z) => ({
    title: z.string(),
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

const connect = defineCollection({
  name: "connect",
  directory: "app/content/connect",
  include: "**/*.mdx",
  schema: (z) => ({
    // title: z.string(),
  }),
  transform: async (document, context) => {
    const content = await compileMDX(context, document);

    return {
      ...document,
      content,
    };
  },
});

function slugify(doc: Schema<"frontmatter", {}>) {
  return doc._meta.fileName.split(".")[0];
}

export default defineConfig({
  collections: [snippets, projects, connect],
});
