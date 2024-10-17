import { Suspense } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Fragment } from "react/jsx-runtime";
import { PlaybackState } from "~/lib/spotify.server";
import { cx, focusRing } from "~/lib/styles";

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
          <a href={track.externalUrl} className="font-medium">
            {track.name}
          </a>
          <p className="text-sm text-muted-foreground">
            {track.artists.map((artist, index) => (
              <Fragment key={artist.externalUrl}>
                {
                  <a
                    href={artist.externalUrl}
                    className={cx(focusRing(), "hover:underline")}
                  >
                    {artist.name}
                  </a>
                }
                {index < track.artists.length - 1 ? ", " : ""}
              </Fragment>
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
            <FormattedMessage id="player.last-played-at" />
            &nbsp;
            <PlayedAtDate timestamp={timestamp} />
          </>
        )}
      </div>
    </div>
  );
};

export const PlayedAtDate = ({ timestamp }: { timestamp: number }) => {
  const intl = useIntl();

  const formattedDate = intl.formatDate(timestamp, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    timeZoneName: "short",
  });

  return (
    <Suspense>
      <time
        suppressHydrationWarning
        dateTime={new Date(timestamp).toISOString()}
      >
        {formattedDate}
      </time>
    </Suspense>
  );
};
