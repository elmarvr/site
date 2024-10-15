import { z } from "zod";
import { createClient } from "@vercel/kv";
import { env } from "~/env";

export const kv = createClient({
  url: env.KV_REST_API_URL,
  token: env.KV_REST_API_TOKEN,
});

export async function getPlaybackState() {
  const response = await spotify("me/player");

  if (response.status === 204) {
    const { track, played_at } = await getLastPlayed();

    return {
      track,
      timestamp: new Date(played_at).getTime(),
      isPlaying: false,
    };
  }

  const json = await response.json();
  const { item, timestamp, is_playing } = z
    .object({
      item: trackSchema,
      is_playing: z.boolean(),
      timestamp: z.number(),
    })
    .parse(json);

  return {
    track: item,
    timestamp,
    isPlaying: is_playing,
  };
}

export type PlaybackState = Awaited<ReturnType<typeof getPlaybackState>>;

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
  const accessToken = await kv.get("spotify:access_token");

  if (accessToken) {
    return accessToken;
  }

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(
        `${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`
      ).toString("base64")}`,
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: env.SPOTIFY_REFRESH_TOKEN,
    }),
  });

  const json = await response.json();

  const { access_token, expires_in } = z
    .object({
      access_token: z.string(),
      expires_in: z.number(),
    })
    .parse(json);

  await kv.set("spotify:access_token", access_token, {
    ex: expires_in,
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
