import {
  // createCookie,
  createCookieSessionStorage,
} from '@remix-run/node';

const sessionSecret = process.env.ASGD_BANNER_SESSION_SECRET;

if (!sessionSecret) {
  throw new Error('ASGD_BANNER_SESSION_SECRET must be set');
}

// TODO: Change secret to use ENV var
const bannerSession = createCookieSessionStorage({
  cookie: {
    name: '__banner_session',
    secrets: [sessionSecret],
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production' ? true : false,
    maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
  },
});


async function getBannerSession(request: Request) {
  const session = await bannerSession.getSession(request.headers.get('Cookie'));

  const setShowBanner =
    (bannerName: string, showBanner: boolean) =>
      session.set(bannerName, showBanner);

  const hasShowBanner = (bannerName: string) => session.has(bannerName);

  const getShowBanner = (bannerName: string) => {
    const showNewDomainBanner = session.get(bannerName);
    if (showNewDomainBanner) {
      return true;
    }
    return false;
  };

  return {
    hasShowBanner,
    getShowBanner,
    setShowBanner,
    commit: () => bannerSession.commitSession(session),
  };
}

export {
  getBannerSession,
};
