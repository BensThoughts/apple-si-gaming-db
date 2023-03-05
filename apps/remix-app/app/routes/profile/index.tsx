import Card from '~/components/Cards/Card';
import ProfileLayout from '~/components/Profile/Login/ProfileLayout';
import LogoutButton from '~/components/Profile/LogoutButton';
import { useUserSession } from '~/lib/hooks/useMatchesData';

export default function ProfileIndexRoute() {
  const { steamUserProfile } = useUserSession();
  if (!steamUserProfile) {
    return (
      <Card title="No Steam User Found!">
        <div className="flex flex-col gap-3">
          <p>
            Something went wrong. You need to logout and back in again
            for the site to work properly. Thanks!
          </p>
          <LogoutButton />
        </div>
      </Card>
    );
  }
  const {
    avatarFull,
    displayName,
  } = steamUserProfile;
  return (
    <ProfileLayout displayName={displayName} avatarFull={avatarFull} />
  );
}
