import ProfileLayout from '~/components/Profile/Login/ProfileLayout';
import { useRootSteamUserContextData } from '~/lib/hooks/useMatchesData';

export default function ProfileIndexRoute() {
  const steamUserData = useRootSteamUserContextData();
  if (!steamUserData) {
    return (
      <div>
        No User Found!
      </div>
    );
  }
  const {
    avatarFull,
    displayName,
  } = steamUserData;
  return (
    <ProfileLayout displayName={displayName} avatarFull={avatarFull} />
  );
}
