export function attr(value: boolean) {
  return value ? "" : undefined;
}

export function orderBy<TItem, TKey>(
  array: TItem[],
  accessor: (item: TItem) => TKey,
  order: "asc" | "desc" = "asc"
) {
  return [...array].sort((a, b) => {
    const valueA = accessor(a);
    const valueB = accessor(b);

    if (valueA > valueB) {
      return order === "asc" ? 1 : -1;
    }

    if (valueA < valueB) {
      return order === "asc" ? -1 : 1;
    }

    return 0;
  });
}

export function isExternalUrl(url: string) {
  return url.startsWith("http") || url.startsWith("www");
}
