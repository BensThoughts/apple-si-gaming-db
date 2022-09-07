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
        <span
          className={`underline underline-offset-4 hover:text-icon-secondary
                      transition-colors duration-200`}
        >
          Steam
        </span>
      </a>
      <a
        href={`https://steamdb.info/app/${steamAppId}`}
        rel="noopener noreferrer"
        target="_blank"
      >
        <span
          className={`underline underline-offset-4 hover:text-icon-secondary
                      transition-colors duration-200`}
        >
          SteamDB
        </span>
      </a>
      <a
        href={`https://steamcharts.com/app/${steamAppId}`}
        rel="noopener noreferrer"
        target="_blank"
      >
        <span
          className={`underline underline-offset-4 hover:text-icon-secondary
                      transition-colors duration-200`}
        >
            Steamcharts
        </span>
      </a>
    </>
  );
}
