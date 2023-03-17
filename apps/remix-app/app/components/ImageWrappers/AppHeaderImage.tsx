export default function AppHeaderImage({
  headerImageSrc,
  name,
  className,
}: {
  headerImageSrc?: string;
  name: string;
  className?: string;
}) {
  return (
    <img
      src={headerImageSrc ? headerImageSrc : '/svg-images/no-image-placeholder.svg'}
      alt={`cover art for ${name}`}
      width={460}
      height={215}
      className={`rounded-md ${className}`}
      loading="lazy"
      onError={(e) => {
        e.currentTarget.src = '/svg-images/no-image-placeholder.svg';
      }}
    />
  );
}
