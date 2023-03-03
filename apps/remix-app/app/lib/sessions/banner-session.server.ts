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
  const setShowSignInBanner = () => session.flash('showSignInBanner', 'true');
  // const setShowSignInBanner = (showBanner: boolean) => {
  //   if (showBanner) {
  //     session.set('showSignInBanner', 'true');
  //   } else {
  //     session.unset('showSignInBanner');
  //   }
  // };
  const getShowSignInBanner = () => {
    const showBanner = session.get('showSignInBanner');
    if (showBanner) {
      return true;
    }
    return false;
  };

  return {
    // setShowSignInBanner,
    setShowSignInBanner,
    getShowSignInBanner,
    commit: () => bannerSession.commitSession(session),
  };
}

export {
  getBannerSession,
};
