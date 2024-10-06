export const SpotifyWidget = () => {
  return (
    <div className="bg-card h-20 rounded p-3">
      <div className="aspect-square bg-red-500 h-full rounded"></div>
    </div>
  );
};

async function getAccessToken() {
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: process.env.SPOTIFY_REFRESH_TOKEN!,
      client_id: process.env.SPOTIFY_CLIENT_ID!,
    }),
  });
}
