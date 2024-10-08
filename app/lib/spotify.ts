import type { App } from "../../spotify-worker/src/index";
import { hc } from "hono/client";
import { Resource } from "sst";

export const spotify = hc<App>(Resource.Spotify.url);
