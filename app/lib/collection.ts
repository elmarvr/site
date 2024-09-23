import * as collections from "app:content";

export type CollectionName = keyof typeof collections extends `all${infer Name}`
  ? Lowercase<Name>
  : never;

export type Collection<T extends CollectionName> =
  (typeof collections)[`all${Capitalize<T>}`];

export type CollectionEntry<T extends CollectionName> = Collection<T>[number];

export function getCollection<T extends CollectionName>(
  collection: T,
  filter?: (
    entry: CollectionEntry<T>,
    index: number,
    collection: Collection<T>
  ) => boolean
): Collection<T> {
  const result = collections[`all${capitalize(collection)}`];

  if (filter) {
    return result.filter((entry, index, collection) =>
      filter(entry, index, collection)
    );
  }

  return result;
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
