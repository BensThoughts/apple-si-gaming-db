export default function AppHeaderImage({
  headerImageSrc,
  name,
  className,
  loading = 'lazy',
}: {
  headerImageSrc?: string | null;
  name: string;
  className?: string;
  loading?: 'lazy' | 'eager';
}) {
  return (
    <img
      src={headerImageSrc ? headerImageSrc : '/svg-images/no-image-placeholder.svg'}
      alt={`cover art for ${name}`}
      width={460}
      height={215}
      className={`rounded-md ${className ? className : ''}`}
      loading={loading}
      onError={(e) => {
        e.currentTarget.src = '/svg-images/no-image-placeholder.svg';
      }}
    />
  );
}
