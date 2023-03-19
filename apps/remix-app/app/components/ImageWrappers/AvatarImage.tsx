type AvatarImageProps = {
  avatarMedium?: string | null;
  avatarFull?: string | null;
  loading?: 'lazy' | 'eager';
}

export default function AvatarImage({
  avatarFull,
  avatarMedium,
  loading = 'lazy',
}: AvatarImageProps) {
  return (
    <img
      src={avatarFull ? avatarFull : (avatarMedium ? avatarMedium : '/svg-images/no-image-placeholder.svg')}
      alt="avatar"
      width={avatarFull ? 184 : (avatarMedium ? 64 : undefined)}
      height={avatarFull ? 184 : (avatarMedium ? 64 : undefined)}
      loading={loading}
      onError={(e) => {
        e.currentTarget.src = '/svg-images/no-image-placeholder.svg';
      }}
      className="rounded-lg"
    />
  );
}
