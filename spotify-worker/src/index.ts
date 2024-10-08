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

const routes = app
  .get("/lastPlayed", async (c) => {
    const response = await spotify("me/player/recently-played");

    const json = await response.json();

    const { items } = z
      .object({
        items: z.array(z.any()),
      })
      .parse(json);

    return c.json(items[0]);
  })
  .get("/isPlaying", async (c) => {
    const response = await spotify("me/player/currently-playing");

    if (response.status === 204) {
      return c.json({
        isPlaying: false,
      });
    }

    return c.json({
      isPlaying: true,
    });
  })
  .get("accessToken", async (c) => {
    const accessToken = await getAccessToken();
    return c.json({ accessToken });
  });

async function spotify(endpoint: string) {
  const accessToken = await getAccessToken();

  return fetch(`https://api.spotify.com/v1/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
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

export type App = typeof routes;
export default app;
