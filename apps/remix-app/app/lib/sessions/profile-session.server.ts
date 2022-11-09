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
  return {
    hasAlreadyLoggedIn: () => {
      return session.has('alreadyLoggedIn');
    },
    unsetAlreadyLoggedIn: () => session.unset('alreadyLoggedIn'),
    setAlreadyLoggedIn: (alreadyLoggedIn: boolean) => session.set('alreadyLoggedIn', alreadyLoggedIn),
    commit: () => profileSession.commitSession(session),
  };
}

export {
  getProfileSession,
};
