import { spotify } from "~/lib/spotify";
import { InferResponseType } from "hono/client";
import { FormattedDate, FormattedMessage } from "react-intl";

type PlaybackState = InferResponseType<typeof spotify.playbackState.$get>;

export const SpotifyWidget = ({ state }: { state: PlaybackState }) => {
  const { track, isPlaying, timestamp } = state;

  return (
    <div className="p-2 bg-card/20 rounded">
      <div className="h-14 flex items-center">
        <div className="aspect-square h-full rounded overflow-hidden">
          {track && (
            <a href={track.album.externalUrl}>
              <img src={track.album.imageUrl} alt={track.album.name} />
            </a>
          )}
        </div>
        <div className="ml-4">
          <p className="font-medium">{track.name}</p>
          <p className="text-sm text-muted-foreground">
            {track.artists.map((artist, index) => (
              <>
                {
                  <a href={artist.externalUrl} className="hover:underline">
                    {artist.name}
                  </a>
                }
                {index < track.artists.length - 1 ? ", " : ""}
              </>
            ))}
          </p>
        </div>
      </div>

      <div className="flex items-center text-sm text-muted-foreground mt-2">
        {isPlaying ? (
          <>
            <div className="size-2 relative mr-2">
              <div className="absolute animate-ping h-full aspect-square rounded-full bg-primary" />
              <div className="h-full aspect-square rounded-full bg-primary" />
            </div>

            <FormattedMessage id="player.listening-now" />
          </>
        ) : (
          <>
            <FormattedMessage id="player.last-played-at" />{" "}
            <FormattedDate
              value={timestamp}
              dateStyle="medium"
              timeStyle="long"
            />
          </>
        )}
      </div>
    </div>
  );
};
