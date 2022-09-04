import AnimatedUnderline from '~/components/AnimatedUnderline';

export default function ExternalLinks({
  steamAppId,
}: {
  steamAppId: number,
}) {
  return (
    <>
      <a
        href={`https://store.steampowered.com/app/${steamAppId}`}
        rel="noopener noreferrer"
        target="_blank"
      >
        <AnimatedUnderline>
            Steam
        </AnimatedUnderline>
      </a>
      <a
        href={`https://steamdb.info/app/${steamAppId}`}
        rel="noopener noreferrer"
        target="_blank"
      >
        <AnimatedUnderline>
          SteamDB
        </AnimatedUnderline>

      </a>
      <a
        href={`https://steamcharts.com/app/${steamAppId}`}
        rel="noopener noreferrer"
        target="_blank"
      >
        <AnimatedUnderline>
          Steamcharts
        </AnimatedUnderline>
      </a>
    </>
  );
}
