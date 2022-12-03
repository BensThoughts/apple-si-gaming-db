export default function AppHeaderImage({
  headerImageSrc,
  name,
}: {
  headerImageSrc: string,
  name: string,
}) {
  return (
    <img
      src={headerImageSrc}
      alt={`cover art for ${name}`}
      width={460}
      height={215}
      className="rounded-md"
      loading="lazy"
      onError={(e) => {
        e.currentTarget.src = '/svg-images/no-image-placeholder.svg';
      }}
    />
  );
}
