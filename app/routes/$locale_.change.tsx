import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { localeCookie } from "~/i18n/server";
import { type Locale, localePath } from "~/i18n/core";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const search = new URL(request.url).searchParams;
  const locale = params.locale as Locale;

  const headers = new Headers();
  headers.set("Set-Cookie", await localeCookie.serialize(locale));

  console.log(
    "redirectTo",
    localePath(search.get("redirectTo") ?? "/", locale)
  );

  return redirect(localePath(search.get("redirectTo") ?? "/", locale), {
    headers,
  });
};
