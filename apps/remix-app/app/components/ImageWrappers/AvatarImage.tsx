export default function AvatarImage({
  avatarMedium,
  avatarFull,
}: {
  avatarMedium?: string, // the src for avatar
  avatarFull?: string;
}) {
  return (
    <img
      src={avatarFull ? avatarFull : (avatarMedium ? avatarMedium : '/svg-images/no-image-placeholder.svg')}
      alt="avatar"
      width={avatarFull ? 184 : (avatarMedium ? 64 : undefined)}
      height={avatarFull ? 184 : (avatarMedium ? 64 : undefined)}
      loading="eager"
      onError={(e) => {
        e.currentTarget.src = '/svg-images/no-image-placeholder.svg';
      }}
      className="rounded-lg"
    />
  );
}
