---
title: React hook form
summary: Simple snippet showing the difference between Typescript and Javascript
date: 2024-02-07
---

This is a snippet i use in all my React projects. A wrapper for the react-hook-form useForm hook that takes in a schema to make it type-safe and it returns a FormField component that removes the need for having to add the control prop to the FormField component.

:::code-group

```tsx [address-form] filename="address-form.tsx"
//@noErrors
import * as React from "react";
import { z } from "zod";
//---cut---
import { useForm } from "./use-form";

const AddressForm = () => {
  const form = useForm({
    schema: z.object({
      street: z.string(),
      city: z.string(),
    }),
  });

  return (
    <form>
      <form.Field name="street">
        {({ field }) => <input {...field} />}
      </form.Field>
      <form.Field name="">
        //              ^|
        {({ field }) => <input {...field} />}
      </form.Field>
    </form>
  );
};
```

```tsx [use-form] filename="use-form.tsx"
import * as React from "react";
import type { Schema } from "zod";
import {
  type FieldPath,
  useForm as __useForm,
  type UseFormProps,
  type UseFormReturn as __UseFormReturn,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
//---cut---
import { FormField, type FormFieldProps } from "./form-field";

type UseFormReturn<TSchema extends Schema> = __UseFormReturn<
  TSchema["_input"],
  any,
  TSchema["_output"]
> & {
  Field: <TName extends FieldPath<TSchema["_input"]>>(
    props: FormFieldProps<TSchema["_input"], TName>
  ) => React.ReactElement;
};

export function useForm<TSchema extends Schema>({
  schema,
  ...opts
}: Omit<UseFormProps<TSchema["_input"]>, "resolver"> & {
  schema: TSchema;
}): UseFormReturn<TSchema> {
  const form = __useForm<TSchema["_input"], any, TSchema["_output"]>({
    ...opts,
    resolver: zodResolver(schema),
  }) as any;

  form.Field = React.useCallback(
    (props: FormFieldProps<any, any>) => (
      <FormField {...props} control={form.control} />
    ),
    []
  );

  return form;
}
```

```tsx [form-field] filename="form-field.tsx"
import * as React from "react";
import {
  useController,
  type FieldPath,
  type FieldValues,
  type UseControllerProps,
  type UseControllerReturn,
  type ControllerFieldState,
} from "react-hook-form";
const FieldContext = React.createContext<ControllerFieldState | null>(
  null
);
//---cut---
export interface FormFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
> extends UseControllerProps<TFieldValues, TName> {
  children?: (
    props: UseControllerReturn<TFieldValues, TName>
  ) => React.ReactNode;
}

export const FormField = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
>({
  children,
  ...props
}: FormFieldProps<TFieldValues, TName>) => {
  const fieldProps = useController(props);

  if (!children) {
    return null;
  }

  return (
    <FieldContext.Provider value={fieldProps.fieldState}>
      {children(fieldProps)}
    </FieldContext.Provider>
  );
};
```

:::
