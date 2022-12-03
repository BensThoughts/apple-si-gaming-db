export default function AvatarImage({
  avatarMedium,
}: {
  avatarMedium: string, // the src for avatar
}) {
  return (
    <img
      src={avatarMedium}
      alt="avatar"
      width={64}
      height={64}
      loading="lazy"
      onError={(e) => {
        e.currentTarget.src = '/svg-images/no-image-placeholder.svg';
      }}
    />
  );
}
