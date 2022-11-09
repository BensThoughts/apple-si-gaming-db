export {};
// import { redirect } from '@remix-run/node';
// import type { ActionFunction } from '@remix-run/node';

// import { getBannerSession } from '~/lib/sessions/banner-session.server';
// import { safeRedirect } from '~/lib/loader-functions/utils.server';

// export const action: ActionFunction = async ({ request }) => {
//   const profileSession = await getBannerSession(request);
//   const formData = await request.formData();
//   const redirectToData = formData.get('redirectTo');
//   const redirectTo = safeRedirect(redirectToData);
//   const bannerName = formData.get('bannerName');
//   if (typeof bannerName != 'string') {
//     return redirect(redirectTo);
//   }
//   profileSession.setShowBanner(bannerName, false);
//   return redirect(redirectTo, { headers: { 'Set-Cookie': await profileSession.commit() } });
// };
