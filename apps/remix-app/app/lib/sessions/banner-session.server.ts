import {
  // createCookie,
  createCookieSessionStorage,
} from '@remix-run/node';

const sessionSecret = process.env.ASGD_BANNER_SESSION_SECRET;

if (!sessionSecret) {
  throw new Error('ASGD_BANNER_SESSION_SECRET must be set');
}

type BannerSessionData = {
  // showSignInBanner: boolean;
}

type BannerSessionFlashData = {
  showSignInBanner: boolean;
}

// TODO: Change secret to use ENV var
const bannerSession = createCookieSessionStorage<BannerSessionData, BannerSessionFlashData>({
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
  const flashShowSignInBanner = () => session.flash('showSignInBanner', true);
  const getShowSignInBanner = () => {
    const showBanner = session.get('showSignInBanner');
    if (showBanner) {
      return true;
    }
    return false;
  };

  return {
    flashShowSignInBanner,
    getShowSignInBanner,
    commit: () => bannerSession.commitSession(session),
    destroy: () => bannerSession.destroySession(session),
  };
}

export {
  getBannerSession,
};
