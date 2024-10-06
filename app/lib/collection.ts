import config from "content.config";
import * as collections from "app:content";
import { GetTypeByName } from "@content-collections/core";

type CollectionName = (typeof config.collections)[number]["name"];
type CollectionEntry<TName extends CollectionName> = GetTypeByName<
  typeof config,
  TName
>;
type Collection<TName extends CollectionName> = Array<CollectionEntry<TName>>;

export function getCollection<T extends CollectionName>(
  collection: T,
  filter?: (entry: CollectionEntry<T>, index: number) => boolean
): Collection<T> {
  const result = getAll(collection);

  if (filter) {
    return result.filter((entry, index) => filter(entry, index));
  }

  return result;
}

function getAll<T extends CollectionName>(collection: T): Collection<T> {
  const key = collection.endsWith("s") ? collection : `${collection}s`;

  return collections[
    `all${capitalize(key)}` as keyof typeof collections
  ] as any;
}

export function getEntry<TName extends CollectionName>(
  collection: TName,
  path: string
): CollectionEntry<TName> {
  const result = getCollection(
    collection,
    (entry) => entry._meta.path === path
  )[0];

  if (!result) {
    throw new Error(`No entry found for path: ${path}`);
  }

  return result;
}

function capitalize<T extends string>(str: T): Capitalize<T> {
  return (str.charAt(0).toUpperCase() + str.slice(1)) as Capitalize<T>;
}
