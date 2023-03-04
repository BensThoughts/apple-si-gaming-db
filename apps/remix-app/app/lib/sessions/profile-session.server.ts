import {
  // createCookie,
  createCookieSessionStorage,
} from '@remix-run/node';

const sessionSecret = process.env.ASGD_PROFILE_SESSION_SECRET;

if (!sessionSecret) {
  throw new Error('ASGD_PROFILE_SESSION_SECRET must be set');
}

type ProfileSessionData = {
  userProfileId: number;
};

// type SessionFlashData = {
//   error: string;
// };

// TODO: Change secret to use ENV var
const userProfileSession = createCookieSessionStorage<ProfileSessionData>({
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
  const setUserProfileId = (userProfileId: number) => session.set('userProfileId', userProfileId);
  const unsetUserProfileId = () => session.unset('userProfileId');

  return {
    login: (userProfileId: number) => setUserProfileId(userProfileId),
    logout: () => unsetUserProfileId(),
    getUserProfileId: () => {
      const userProfileId = session.get('userProfileId');
      if (!userProfileId) {
        return undefined;
      }
      // TODO: Casting to Number because userProfileId used to be a string
      // TODO: any currently logged in users will get an error otherwise
      // TODO: this can go away in a couple months from 03/04/2023
      if (!isFinite(Number(userProfileId))) {
        return undefined;
      }
      return Number(userProfileId);
    },
    commit: () => userProfileSession.commitSession(session),
    destroy: () => userProfileSession.destroySession(session),
  };
}

export {
  getProfileSession,
};
