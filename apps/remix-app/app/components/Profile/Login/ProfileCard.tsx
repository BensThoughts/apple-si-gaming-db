import LogoutButton from '../LogoutButton';

export default function ProfileCard({
  avatarFull,
  displayName,
}: {
  avatarFull?: string | null;
  displayName?: string | null;
}) {
  return (
    <div className={`flex flex-col items-center gap-4 w-full max-w-md`}>
      <h2 className="text-2xl"><strong>{displayName}</strong></h2>
      {avatarFull && <img
        src={avatarFull}
        alt="Current User Avatar"
        loading="lazy"
        onError={(e) => {
          e.currentTarget.src = '/svg-images/no-image-placeholder.svg';
        }}
        className="rounded-full border-1 border-secondary-highlight"
      />}
      <LogoutButton />
    </div>
  );
}
