import ExternalLink from '~/components/ExternalLink';

export default function ExternalLinks({
  steamAppId,
}: {
  steamAppId: number,
}) {
  return (
    <>
      <ExternalLink href={`https://store.steampowered.com/app/${steamAppId}`}>
        Steam
      </ExternalLink>
      <ExternalLink href={`https://steamdb.info/app/${steamAppId}`}>
        SteamDB
      </ExternalLink>
      <ExternalLink href={`https://steamcharts.com/app/${steamAppId}`}>
        Steamcharts
      </ExternalLink>
    </>
  );
}
