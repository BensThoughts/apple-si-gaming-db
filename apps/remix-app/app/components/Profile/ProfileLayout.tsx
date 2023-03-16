import PrivacyCard from './PrivacyCard';
import ProfileCard from './ProfileCard';

export default function ProfileLayout({
  displayName,
  avatarFull,
}: {
  displayName?: string | null;
  avatarFull?: string | null;
}) {
  return (
    <div className="flex flex-col gap-8 items-center p-6 bg-tertiary rounded-lg border-1 border-secondary-highlight">
      <ProfileCard avatarFull={avatarFull} displayName={displayName} />
      <PrivacyCard />
    </div>
  );
}
