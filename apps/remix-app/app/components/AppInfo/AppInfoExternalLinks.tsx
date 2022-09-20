import ExternalLink from '~/components/ExternalLink';

export default function AppInfoExternalLinks({
  steamAppId,
}: {
  steamAppId: number,
}) {
  return (
    <div className="flex gap-2">
      <ExternalLink href={`https://store.steampowered.com/app/${steamAppId}`}>
        Steam
      </ExternalLink>
      <ExternalLink href={`https://steamdb.info/app/${steamAppId}`}>
        SteamDB
      </ExternalLink>
      <ExternalLink href={`https://steamcharts.com/app/${steamAppId}`}>
        Steamcharts
      </ExternalLink>
    </div>
  );
}
