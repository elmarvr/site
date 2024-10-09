import { Resource } from "sst";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { Buffer } from "node:buffer";
import { z } from "zod";

const app = new Hono()
  .use(
    cors({
      origin: ["http://localhost:5173"],
    })
  )
  .onError((error, c) => {
    return c.json({ error: error.message }, { status: 500 });
  });

const routes = app.get("playbackState", async (c) => {
  const response = await spotify("me/player");

  if (response.status === 204) {
    const { track, played_at } = await getLastPlayed();

    return c.json({
      track,
      timestamp: new Date(played_at).getTime(),
      isPlaying: false,
    });
  }

  const json = await response.json();
  const { item, timestamp, is_playing } = z
    .object({
      item: trackSchema,
      is_playing: z.boolean(),
      timestamp: z.number(),
    })
    .parse(json);

  return c.json({
    track: item,
    timestamp,
    isPlaying: is_playing,
  });
});

async function getLastPlayed() {
  const response = await spotify("me/player/recently-played");

  const json = await response.json();

  const { items } = z
    .object({
      items: z.array(
        z.object({
          track: trackSchema,
          played_at: z.string(),
        })
      ),
    })
    .parse(json);

  return items[0];
}

async function spotify(endpoint: string) {
  const accessToken = await getAccessToken();

  const response = await fetch(`https://api.spotify.com/v1/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response;
}

async function getAccessToken() {
  const accessToken = await Resource.MyStorage.get("spotify:access_token");

  if (accessToken) {
    return accessToken;
  }

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(
        `${Resource.SpotifyClientId.value}:${Resource.SpotifyClientSecret.value}`
      ).toString("base64")}`,
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: Resource.SpotifyRefreshToken.value,
    }),
  });

  const json = await response.json();

  const { access_token, expires_in } = z
    .object({
      access_token: z.string(),
      expires_in: z.number(),
    })
    .parse(json);

  await Resource.MyStorage.put("spotify:access_token", access_token, {
    expirationTtl: expires_in,
  });

  return access_token;
}

const externalUrlSchema = z
  .object({
    external_urls: z.object({
      spotify: z.string(),
    }),
  })
  .transform(({ external_urls, ...value }) => ({
    ...value,
    externalUrl: external_urls.spotify,
  }));

const artistSchema = z
  .object({
    name: z.string(),
  })
  .and(externalUrlSchema);

const albumSchema = z
  .object({
    name: z.string(),
    images: z.array(
      z.object({
        url: z.string(),
      })
    ),
  })
  .transform(({ images, ...value }) => ({
    ...value,
    imageUrl: images[0].url,
  }))
  .and(externalUrlSchema);

const trackSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    album: albumSchema,
    artists: z.array(artistSchema.and(externalUrlSchema)),
  })
  .and(externalUrlSchema);

export type App = typeof routes;
export default app;
