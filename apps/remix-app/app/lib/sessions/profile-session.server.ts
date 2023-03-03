import {
  // createCookie,
  createCookieSessionStorage,
} from '@remix-run/node';

const sessionSecret = process.env.ASGD_PROFILE_SESSION_SECRET;

if (!sessionSecret) {
  throw new Error('ASGD_PROFILE_SESSION_SECRET must be set');
}

// TODO: Change secret to use ENV var
const userProfileSession = createCookieSessionStorage({
  cookie: {
    name: '__user_profile_session',
    secrets: [sessionSecret],
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production' ? true : false,
    maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
  },
});

async function getProfileSession(request: Request) {
  const session = await userProfileSession.getSession(request.headers.get('Cookie'));
  const setUserProfileId = (userProfileId: number) => session.set('userProfileId', userProfileId.toString());

  return {
    login: (
        userProfileId: number,
    ) => {
      setUserProfileId(userProfileId);
    },
    logout: () => userProfileSession.destroySession(session),
    getUserProfileId: () => {
      const userProfileId = session.get('userProfileId');
      if (typeof userProfileId != 'string') {
        return undefined;
      }
      if (!isFinite(Number(userProfileId))) {
        return undefined;
      }
      return Number(userProfileId);
    },
    commit: () => userProfileSession.commitSession(session),
  };
}

export {
  getProfileSession,
};
