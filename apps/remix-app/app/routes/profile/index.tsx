import AnimatedUnderline from '~/components/AnimatedUnderline';
import Card from '~/components/Cards/Card';
import ProfileLayout from '~/components/Profile/Login/ProfileLayout';
import { useSteamUserProfile } from '~/lib/hooks/useMatchesData';

export default function ProfileIndexRoute() {
  const steamUserProfile = useSteamUserProfile();
  if (!steamUserProfile) {
    return (
      <Card title="No Steam User Found!">
        <div className="flex flex-col gap-3">
          You need to logout and back in again for the site to work properly.
          This is due to a transition to a new database schema. Thanks!
        </div>
        <a
          href="/api/auth/steam/logout"
        >
          <AnimatedUnderline>Logout</AnimatedUnderline>
        </a>
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
