import { useFetcher } from '@remix-run/react';

export function useLogout() {
  const fetcher = useFetcher();
  const logout = () => fetcher.submit({}, { action: '/actions/logout', method: 'post' });
  return logout;
}
