---
title: Expo Live Query
date: 2024-08-12
---

De useLiveQuery hook bouwt voort op de @tanstack/query useQuery, zodat je real-time updates krijgt vanuit een Expo SQLite database. Hierdoor blijft je UI altijd up-to-date met de laatste data wijzigingen.

:::code-group

```tsx [client] filename="client.tsx"
import React from "react";
//---cut---
import { useLiveQuery } from "./use-live-query";
import { db, MessagesTable } from "./db";

const MesageList = () => {
  const { data, error } = useLiveQuery({
    query: db.query.messages.findMany(),
    queryKey: ["messages"],
  });

  //etc...
};

const MessageSingle = (props: { id: number }) => {
  const { data, error } = useLiveQuery({
    query: db.query.messages.findFirst({
      where: (fields, { eq }) => eq(fields.id, props.id),
    }),
    queryKey: ["message", props.id],
  });

  //even more...
};
```

```ts [live-query] filename="use-live-query.ts"
import { is, SQL, Subquery } from "drizzle-orm";
import {
  getTableConfig,
  getViewConfig,
  SQLiteTable,
  SQLiteView,
  type AnySQLiteSelect,
} from "drizzle-orm/sqlite-core";
import { SQLiteRelationalQuery } from "drizzle-orm/sqlite-core/query-builders/query";

import { addDatabaseChangeListener } from "expo-sqlite/next";
import * as React from "react";

import {
  type DefaultError,
  useQuery,
  useQueryClient,
  type QueryKey,
  hashKey,
  type DataTag,
} from "@tanstack/react-query";
//---cut---
export const useLiveQuery = <
  TQuery extends
    | Pick<AnySQLiteSelect, "_" | "then">
    | SQLiteRelationalQuery<"sync", unknown>,
  TQueryKey extends QueryKey,
  TData = Awaited<TQuery>
>(opts: {
  query: TQuery;
  queryKey: TQueryKey;
  select?: (data: Awaited<TQuery>) => TData;
}) => {
  const { query, queryKey, ...rest } = opts;
  const [error, setError] = React.useState<Error>();

  const queryClient = useQueryClient();
  const { data } = useQuery<
    Awaited<TQuery>,
    DefaultError,
    TData,
    TQueryKey
  >({
    queryKey,
    staleTime: Infinity,
    ...rest,
  });

  React.useEffect(() => {
    const entity = is(query, SQLiteRelationalQuery)
      ? // @ts-expect-error
        query.table
      : //@ts-expect-error
        (query as AnySQLiteSelect).config.table;

    if (is(entity, Subquery) || is(entity, SQL)) {
      setError(
        new Error("Selecting subqueries and SQL are not supported")
      );
    }

    let listener:
      | ReturnType<typeof addDatabaseChangeListener>
      | undefined = undefined;

    if (is(entity, SQLiteTable) || is(entity, SQLiteView)) {
      const config = is(entity, SQLiteTable)
        ? getTableConfig(entity)
        : getViewConfig(entity);

      query
        .then((data) => {
          queryClient.setQueryData(queryKey, data);
        })
        .catch(setError);

      listener = addDatabaseChangeListener(({ tableName }) => {
        if (config.name === tableName) {
          query
            .then((data) => {
              queryClient.setQueryData(queryKey, data);
            })
            .catch(setError);
        }
      });
    }

    return () => {
      listener?.remove();
    };
  }, [hashKey(queryKey)]);

  return {
    data,
    error,
  };
};
```

```ts [database] filename="db.ts"
import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite/next";
//---cut---
const expo = openDatabaseSync("cool-message-app.db", {
  enableChangeListener: true,
});

export const MessagesTable = sqliteTable("messages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  content: text("content"),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$onUpdate(() => new Date()),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const db = drizzle(expo, {
  schema: {
    messages: MessagesTable,
  },
});
```

:::
