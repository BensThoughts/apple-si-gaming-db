import { useFetcher } from '@remix-run/react';
import RoundedButton from '~/components/Buttons/RoundedButton';

export default function LogoutButton() {
  const fetcher = useFetcher();

  return (
    <RoundedButton
      className="w-full max-w-[6rem] focus-visible:show-ring-tertiary"
      onClick={() => fetcher.submit({}, { action: '/actions/logout', method: 'post' })}
    >
      Logout
    </RoundedButton>
  );
}
