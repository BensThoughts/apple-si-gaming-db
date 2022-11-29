import Heading from '~/components/Heading';
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
    <div className="flex flex-col gap-8 items-center w-full p-4 bg-tertiary rounded-lg border-1 border-secondary-highlight">
      <Heading>Profile</Heading>
      <ProfileCard avatarFull={avatarFull} displayName={displayName} />
      <PrivacyCard />
    </div>
  );
}
