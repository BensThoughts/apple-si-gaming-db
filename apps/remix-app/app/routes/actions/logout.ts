import { redirect } from '@remix-run/node';
import type { ActionArgs } from '@remix-run/node';
// import { getBannerSession } from '~/lib/sessions/banner-session.server';
import { getProfileSession } from '~/lib/sessions/profile-session.server';

export async function action({ request }: ActionArgs) {
  const profileSession = await getProfileSession(request);
  profileSession.logout();
  const headers = new Headers();
  headers.append('Set-Cookie', await profileSession.commit());

  // const bannerSession = await getBannerSession(request);
  // bannerSession.setShowSignInBanner();
  // headers.append('Set-Cookie', await bannerSession.commit());

  return redirect('/api/auth/steam/logout', { headers, status: 302 });
}
