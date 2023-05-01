import RoundedButton from '~/components/Buttons/RoundedButton';
import { useLogout } from '~/lib/hooks/useLogout';

export default function LogoutButton() {
  const logout = useLogout();

  return (
    <RoundedButton
      className="w-full max-w-[6rem] focus-visible:show-ring-tertiary"
      onClick={logout}
    >
      Logout
    </RoundedButton>
  );
}
