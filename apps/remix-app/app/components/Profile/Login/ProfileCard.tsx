import AnimatedUnderline from '~/components/AnimatedUnderline';

export default function ProfileCard({
  avatarFull,
  displayName,
}: {
  avatarFull?: string | null;
  displayName?: string | null;
}) {
  return (
    <div className={`flex flex-col items-center gap-4 p-6
    border-secondary-highlight border-solid
    border-y-2 md:border-x-2 w-full max-w-md
    rounded-lg`}>
      <h2><strong>{displayName}</strong></h2>
      {avatarFull && <img
        src={avatarFull}
        alt="Current User Avatar"
        loading="lazy"
        onError={(e) => {
          e.currentTarget.src = '/svg-images/no-image-placeholder.svg';
        }}
      />}
      <a
        href="/api/auth/steam/logout"
      >
        <AnimatedUnderline>Logout</AnimatedUnderline>
      </a>
    </div>
  );
}
