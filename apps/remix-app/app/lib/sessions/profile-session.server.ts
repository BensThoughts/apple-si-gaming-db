import {
  // createCookie,
  createCookieSessionStorage,
} from '@remix-run/node';

const sessionSecret = process.env.ASGD_PROFILE_SESSION_SECRET;

if (!sessionSecret) {
  throw new Error('ASGD_PROFILE_SESSION_SECRET must be set');
}

// TODO: Change secret to use ENV var
const profileSession = createCookieSessionStorage({
  cookie: {
    name: '__profile_session',
    secrets: [sessionSecret],
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production' ? true : false,
    maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
  },
});

async function getProfileSession(request: Request) {
  const session = await profileSession.getSession(request.headers.get('Cookie'));

  const setIsLoggedIn = () => session.set('isLoggedIn', 'true');
  const unsetIsLoggedIn = () => session.unset('isLoggedIn');
  const setUserProfileId = (userProfileId: number) => session.set('userProfileId', userProfileId.toString());
  const unsetUserProfileId = () => session.unset('userProfileId');
  // const setSteamUserId64 = (steamUserId64: string) => session.set('steamUserId64', steamUserId64);
  // const unsetSteamUserId64 = () => session.unset('steamUserId64');

  return {
    login: (
        userProfileId: number,
        // steamUserId64: string,
    ) => {
      setUserProfileId(userProfileId);
      // setSteamUserId64(steamUserId64);
      setIsLoggedIn();
    },
    logout: () => {
      // TODO: "When using session.unset(), you need to be sure no
      // TODO: other loaders in the request are going to want to read that"
      unsetUserProfileId();
      // unsetSteamUserId64();
      unsetIsLoggedIn();
    },

    getIsLoggedIn: () => {
      const isLoggedIn = session.get('isLoggedIn') as string | undefined;
      if (!isLoggedIn) {
        return false;
      }
      return true;
    },
    getUserProfileId: () => {
      const userProfileId = session.get('userProfileId') as string | undefined;
      if (!userProfileId) {
        return undefined;
      }
      return Number(userProfileId);
    },
    // getSteamUserId64: () => session.get('steamUserId64') as string | undefined,
    commit: () => profileSession.commitSession(session),
  };
}

export {
  getProfileSession,
};
