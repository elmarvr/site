/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "portfolio-remix",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
    };
  },
  async run() {
    const storage = new sst.cloudflare.Kv("MyStorage");

    const spotifyClientId = new sst.Secret(
      "SpotifyClientId",
      "76494cb01f864601aef66a6a95f638f1"
    );

    const spotifyClientSecret = new sst.Secret("SpotifyClientSecret", "");

    const spotifyRefreshToken = new sst.Secret("SpotifyRefreshToken", "");

    const worker = new sst.cloudflare.Worker("Spotify", {
      handler: "./spotify-worker/src/index.ts",
      url: true,
      link: [
        storage,
        spotifyClientId,
        spotifyClientSecret,
        spotifyRefreshToken,
      ],
    });

    new sst.aws.Remix("MyWeb", {
      link: [worker],
    });
  },
});
